import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Anova Co.",
  description:
    "How Anova Co. collects, uses, and protects the information you share when booking a complimentary audit.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteNav forceLight />

      <header
        style={{
          background: "#1B2B21",
          padding: "120px 24px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#D4AF37",
              marginBottom: 24,
            }}
          >
            Legal
          </span>
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#F4F1ED",
              margin: 0,
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              marginTop: 16,
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: "0.875rem",
              color: "rgba(244,241,237,0.5)",
            }}
          >
            Last updated: May 2026
          </p>
        </div>
      </header>

      <main
        style={{
          background: "#F4F1ED",
        }}
      >
        <div
          className="privacy-prose"
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "80px 24px",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "#333333",
          }}
        >
          <h2>Who we are</h2>
          <p>
            Anova Co. is a business solutions consulting firm. We help growing businesses
            build the systems, presence, and strategy they need to compete and win. Our website
            is anovaco.ca.
          </p>

          <h2>What information we collect</h2>
          <p>When you book a complimentary audit through our website, we collect:</p>
          <ul>
            <li>Your name and contact details (email address and phone number)</li>
            <li>Your business name and city</li>
            <li>Information about your business (industry, your role, your goals and challenges)</li>
            <li>How you heard about us</li>
          </ul>
          <p>
            We do not collect payment information. We do not collect sensitive personal
            information.
          </p>

          <h2>Why we collect it</h2>
          <p>We collect this information solely to:</p>
          <ul>
            <li>Prepare for and conduct your audit call</li>
            <li>Send you confirmation and reminder emails about your booking</li>
            <li>Follow up after your call with next steps</li>
          </ul>
          <p>
            We do not use your information for advertising. We do not sell your information. We
            do not share it with anyone outside of the services listed below.
          </p>

          <h2>How we store it</h2>
          <p>
            Your information is stored securely in a Neon PostgreSQL database hosted on AWS
            infrastructure. Access is restricted and encrypted in transit and at rest.
          </p>
          <p>
            We retain your information for as long as necessary to fulfill the purposes above.
            If you&apos;d like your information deleted, contact us at{" "}
            <a href="mailto:info@anovaco.ca">info@anovaco.ca</a> and we will remove it within
            30 days.
          </p>

          <h2>Third-party services</h2>
          <p>
            To operate our booking system and website, we use the following services. Each has
            its own privacy policy.
          </p>
          <ul>
            <li>
              <strong>Google Calendar &amp; Google Meet</strong> — to schedule your audit call
              and generate a video meeting link
            </li>
            <li>
              <strong>Resend</strong> — to send booking confirmation and reminder emails
            </li>
            <li>
              <strong>Vercel</strong> — to host our website
            </li>
            <li>
              <strong>Neon</strong> — to store booking data
            </li>
            <li>
              <strong>Upstash</strong> — for rate limiting (no personal data stored)
            </li>
          </ul>

          <h2>Your rights</h2>
          <p>
            If you are located in Canada, you have rights under PIPEDA (Personal Information
            Protection and Electronic Documents Act), including the right to:
          </p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:info@anovaco.ca">info@anovaco.ca</a>.
          </p>

          <h2>Cookies</h2>
          <p>
            Our website does not use tracking cookies or advertising cookies. We use only
            essential technical cookies required for the site to function.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The date at the top of this page will
            always reflect the most recent version.
          </p>

          <h2>Contact</h2>
          <p>
            If you have any questions about this policy or how we handle your information,
            contact us at <a href="mailto:info@anovaco.ca">info@anovaco.ca</a>.
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
