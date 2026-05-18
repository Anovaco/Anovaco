import { neon } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> {
  if (!_sql) {
    if (!process.env.NEON_DATABASE_URL) {
      throw new Error("NEON_DATABASE_URL environment variable is not set");
    }
    _sql = neon(process.env.NEON_DATABASE_URL);
  }
  return _sql;
}

export const sql = new Proxy(((..._a: unknown[]) => undefined) as unknown as NeonQueryFunction<false, false>, {
  get(_target, prop) {
    return getDb()[prop as keyof NeonQueryFunction<false, false>];
  },
  apply(_target, _thisArg, args) {
    return (getDb() as unknown as Function)(...args);
  },
});
