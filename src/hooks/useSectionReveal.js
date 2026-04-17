import { useEffect, useRef, useState } from "react";

export function useSectionReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return undefined;
    if (typeof window === "undefined") return undefined;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold ?? 0.18,
        rootMargin: options.rootMargin ?? "0px 0px -8% 0px"
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);

  return { ref, visible };
}
