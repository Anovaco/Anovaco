import Link from "next/link";
import { AnovaLogo } from "@/components/anova-logo";

export default function NotFound() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        overflow: "hidden",
        background: "#1B2B21",
        color: "#F4F1ED",
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
          fontSize: "clamp(8rem, 20vw, 14rem)",
          lineHeight: 1,
          color: "rgba(244,241,237,0.08)",
          zIndex: 0,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        404
      </span>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <AnovaLogo size={40} />

        <span
          style={{
            marginTop: "2rem",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#D4AF37",
          }}
        >
          Page Not Found
        </span>

        <h1
          style={{
            marginTop: "1rem",
            fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 1.1,
            color: "#F4F1ED",
            margin: "1rem 0 0",
          }}
        >
          You&apos;ve gone off the map.
        </h1>

        <p
          style={{
            marginTop: "1rem",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "rgba(244,241,237,0.55)",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/"
            style={{
              background: "#D4AF37",
              color: "#1B2B21",
              padding: "14px 32px",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 0,
            }}
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            style={{
              background: "transparent",
              color: "#F4F1ED",
              border: "1px solid rgba(244,241,237,0.3)",
              padding: "14px 32px",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 0,
            }}
          >
            Book a Free Audit
          </Link>
        </div>
      </div>

      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
          fontStyle: "italic",
          fontSize: "0.875rem",
          color: "rgba(212,175,55,0.4)",
          zIndex: 1,
        }}
      >
        Growth, engineered.
      </span>
    </main>
  );
}
