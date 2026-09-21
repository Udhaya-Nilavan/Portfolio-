import { useEffect, useRef, useState } from 'react';

/* ---------------------------------------------------------------------------
   useReducedMotion — respects the OS "reduce motion" setting, live.
--------------------------------------------------------------------------- */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/* ---------------------------------------------------------------------------
   useMediaQuery
--------------------------------------------------------------------------- */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/* ---------------------------------------------------------------------------
   useActiveSection

   Robust active-section detection. Deliberately NOT scroll-percentage based.

   How it stays stable:
   - One IntersectionObserver with a dense threshold ladder, so we always know
     how much of each section is on screen.
   - A ratio map is kept in a ref; the winner is the section with the greatest
     visible ratio, ties broken by document order. This removes the flicker you
     get from "last one to fire an entry wins".
   - rootMargin lifts the top edge below the floating nav so a section is not
     considered active while it is still hidden behind the nav.
   - Bottom-of-page clamp: the last section wins once the page is scrolled to
     the end, because short trailing sections can never win on ratio alone.
--------------------------------------------------------------------------- */
export function useActiveSection(ids: string[], navOffset = 96): string {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? '');
  const ratios = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const elements = ids
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const order = new Map(ids.map((id, i) => [id, i]));

    const pickWinner = () => {
      let bestId = '';
      let bestRatio = 0;
      ratios.current.forEach((ratio, id) => {
        if (ratio <= 0) return;
        if (
          ratio > bestRatio + 0.001 ||
          (Math.abs(ratio - bestRatio) <= 0.001 &&
            (order.get(id) ?? 0) < (order.get(bestId) ?? Infinity))
        ) {
          bestRatio = ratio;
          bestId = id;
        }
      });
      if (bestId) setActiveId(bestId);
    };

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          ratios.current.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        pickWinner();
      },
      {
        // Ignore the strip hidden behind the floating nav; ignore the last 35%
        // of the viewport so the next section does not steal focus too early.
        rootMargin: `-${navOffset}px 0px -35% 0px`,
        threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.65, 0.8, 1],
      },
    );

    elements.forEach(el => observer.observe(el));

    // Bottom clamp — a short final section would otherwise never win on ratio.
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (atBottom) setActiveId(ids[ids.length - 1]);
      else if (window.scrollY < 40) setActiveId(ids[0]);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      ratios.current.clear();
    };
  }, [ids, navOffset]);

  return activeId;
}

/* ---------------------------------------------------------------------------
   useScrollState — collapsed flag (hysteresis) + 0..1 page progress.

   Hysteresis matters: a single threshold makes the nav shudder open/closed
   when the user rests near the boundary. Collapse at 220px, expand at 120px.
--------------------------------------------------------------------------- */
export function useScrollState(collapseAt = 220, expandAt = 120) {
  const [collapsed, setCollapsed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      setCollapsed(prev => (prev ? y > expandAt : y > collapseAt));

      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    measure();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [collapseAt, expandAt]);

  return { collapsed, progress };
}

/* ---------------------------------------------------------------------------
   useScrollLock — freeze the page behind an open modal without layout shift.
--------------------------------------------------------------------------- */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [locked]);
}

export * from './useScrollBlur';

