import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";
import { getServiceBySlug } from "@/lib/services";

const service = getServiceBySlug("reputation-management")!;

export const metadata: Metadata = {
  title: `${service.name} — Anova Co.`,
  description: service.description,
};

export default function Page() {
  return <ServicePage service={service} />;
}
