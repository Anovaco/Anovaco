"use client";

import Script from "next/script";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { "agent-id": string },
        HTMLElement
      >;
    }
  }
}

export default function VoiceWidget() {
  return (
    <>
      <elevenlabs-convai agent-id="agent_2801ks5jq9v6fmn9z6302jt4fzc7" />
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
        async
      />
    </>
  );
}
