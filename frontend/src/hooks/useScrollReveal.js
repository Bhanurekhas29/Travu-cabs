import { useCallback, useEffect, useRef, useState } from "react";

function useScrollReveal(options) {
  const [node, setNode] = useState(null);
  const [visible, setVisible] = useState(false);

  // A callback ref (rather than useRef + an effect with an empty dependency
  // array) so the observer still attaches when the element mounts on a later
  // render - e.g. components that render null until their data has loaded.
  const ref = useCallback((el) => {
    setNode(el);
  }, []);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px", ...optionsRef.current }
    );
    observer.observe(node);

    // Safety net: never let the reveal animation permanently hide content.
    // If the observer hasn't fired shortly after mount (backgrounded tab,
    // already-scrolled page, timing edge cases), just show the section.
    const fallback = setTimeout(() => setVisible(true), 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [node]);

  return [ref, visible];
}

export default useScrollReveal;
