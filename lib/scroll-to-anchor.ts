// Smooth-scroll handler for in-page anchor links. Accounts for the fixed nav
// height (72px) and honours prefers-reduced-motion by switching to "auto".
// Returns true if the target was found on the current page and the scroll
// was handled; false otherwise so callers can fall through to navigation.
const NAV_OFFSET = 72;

export function scrollToAnchor(href: string): boolean {
  if (typeof window === "undefined") return false;
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return false;
  const id = href.slice(hashIndex + 1);
  if (!id) return false;
  const element = document.getElementById(id);
  if (!element) return false;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = element.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  window.history.pushState(null, "", `/#${id}`);
  return true;
}
