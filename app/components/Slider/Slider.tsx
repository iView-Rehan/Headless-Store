'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

export function Slider({
  header,
  children,
  label,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const move = (dir: 1 | -1) =>
    ref.current?.scrollBy({
      left: dir * ref.current.clientWidth * 0.8,
      behavior: 'smooth',
    });

  return (
    <div>
      <div className="flex items-end justify-between gap-6 mb-8 sm:mb-10">
        <div>{header}</div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            className="slider-btn"
            onClick={() => move(-1)}
            disabled={!canPrev}
            aria-label={`Previous ${label}`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 5l-7 7 7 7"
              />
            </svg>
          </button>
          <button
            type="button"
            className="slider-btn"
            onClick={() => move(1)}
            disabled={!canNext}
            aria-label={`Next ${label}`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      <ul
        ref={ref}
        onScroll={update}
        className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
      >
        {children}
      </ul>
    </div>
  );
}
