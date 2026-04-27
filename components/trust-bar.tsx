export function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Platforms we use">
      <div className="section-container">
        <p className="trust-eyebrow">Platforms we use to grow your business</p>
        <ul className="trust-logos">
          <li className="trust-item" title="Google">
            <svg viewBox="0 0 120 24" height="20" aria-label="Google">
              <text x="0" y="18" fontFamily="serif" fontSize="20" fontWeight="500" fill="currentColor">
                Google
              </text>
            </svg>
          </li>
          <li className="trust-item" title="Meta">
            <svg viewBox="0 0 90 24" height="20" aria-label="Meta">
              <text x="0" y="18" fontFamily="sans-serif" fontSize="19" fontWeight="700" fill="currentColor">
                Meta
              </text>
            </svg>
          </li>
          <li className="trust-item" title="Instagram">
            <svg viewBox="0 0 24 24" height="22" aria-label="Instagram">
              <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
            </svg>
          </li>
          <li className="trust-item" title="WhatsApp">
            <svg viewBox="0 0 24 24" height="22" aria-label="WhatsApp">
              <path
                d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.6-5.6c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.5.1-.2.3-.6.8-.8 1-.1.1-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4a8.4 8.4 0 0 1-1.6-2c-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5l.2-.4c.1-.2 0-.3 0-.4 0-.1-.5-1.3-.7-1.8-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a2.7 2.7 0 0 0-.9 2c0 1.2.8 2.4.9 2.5.1.2 1.7 2.6 4.2 3.6.6.3 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1 .1-1.2-.1-.1-.2-.2-.4-.3Z"
                fill="currentColor"
              />
            </svg>
          </li>
          <li className="trust-item" title="TikTok">
            <svg viewBox="0 0 24 24" height="22" aria-label="TikTok">
              <path
                d="M14 3v9.5a2.5 2.5 0 1 1-2.5-2.5h.5V7a5.5 5.5 0 1 0 5.5 5.5V8a6.5 6.5 0 0 0 4 1.4V6.4A4.4 4.4 0 0 1 17 3h-3Z"
                fill="currentColor"
              />
            </svg>
          </li>
          <li className="trust-item" title="OpenAI">
            <svg viewBox="0 0 24 24" height="22" aria-label="OpenAI">
              <path
                d="M22 10a5 5 0 0 0-.6-2.4 5 5 0 0 0-5.4-2.5 5 5 0 0 0-3.7-1.6 5 5 0 0 0-4.8 3.5A5 5 0 0 0 4 9a5 5 0 0 0-.6 6 5 5 0 0 0 5.4 2.5 5 5 0 0 0 3.7 1.6 5 5 0 0 0 4.8-3.5A5 5 0 0 0 20 15a5 5 0 0 0 2-5Zm-9.7 11.2a3.7 3.7 0 0 1-2.4-.9l3.7-2.1V14l4 2.3a.1.1 0 0 1 0 .1l-3.5 2a3.7 3.7 0 0 1-1.8.8ZM5 14.5a3.7 3.7 0 0 1-.4-2.7l3.7 2.1 3.7-2.1v4.6L8 18.3a3.7 3.7 0 0 1-3-3.8Zm-1.1-7.7a3.7 3.7 0 0 1 1.9-1.6V9.5l3.7 2.1L5.7 14a.1.1 0 0 1-.2 0L3.9 13a3.7 3.7 0 0 1 0-6.2Zm12.7 3 -3.7-2.1L17 5.4a.1.1 0 0 1 .2 0l1.6.9a3.7 3.7 0 0 1 0 6.2 3.7 3.7 0 0 1-1.9 1.6V9.5Z"
                fill="currentColor"
              />
            </svg>
          </li>
        </ul>
      </div>
    </section>
  );
}
