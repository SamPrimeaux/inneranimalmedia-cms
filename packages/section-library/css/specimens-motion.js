/** Optional viewport reveal activation for .iam-specimens.
 * Without JS the content is always visible. Repeat activation is idempotent.
 */
export function enhanceDesignSpecimens(root = document) {
  const elements = root.querySelectorAll?.(".iam-specimens [data-meaux-reveal]") ?? [];
  if (typeof IntersectionObserver === "undefined" ||
      typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.remove("meaux-reveal-pending");
      observer.unobserve(entry.target);
    }
  }, { threshold: .12 });
  const observed = [];
  for (const el of elements) {
    if (el.dataset.meauxObserved === "true") continue;
    el.dataset.meauxObserved = "true";
    // Never hide an element already visible; only animate arrivals below the fold.
    if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add("meaux-reveal-pending");
    observer.observe(el);
    observed.push(el);
  }
  return () => {
    observer.disconnect();
    for (const el of observed) {
      el.classList.remove("meaux-reveal-pending");
      delete el.dataset.meauxObserved;
    }
  };
}