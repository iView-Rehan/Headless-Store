import { forwardRef, ReactNode, useId } from 'react';

export const PRINT = { x: 180, y: 165, w: 240, h: 240 };

const BODY =
  'M215 42 L130 74 L28 168 L84 236 L134 200 L134 586 Q134 608 156 608 L444 608 Q466 608 466 586 L466 200 L516 236 L572 168 L470 74 L385 42 Q300 118 215 42 Z';
const HOLE = 'M215 42 Q300 118 385 42 Q300 20 215 42 Z';
const COLLAR = 'M215 42 Q300 118 385 42';
const FOLDS =
  'M178 250 Q194 400 172 570 M422 250 Q406 400 428 570 M240 575 Q300 548 360 575 M134 200 Q168 262 154 340 M466 200 Q432 262 446 340';

const DEFAULT_HEX = '#f1f0ea';

export function safeHex(color?: string) {
  return color && /^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(color)
    ? '#' + color.replace('#', '')
    : DEFAULT_HEX;
}

function rgb(hex: string) {
  const h = safeHex(hex).slice(1);
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function shade(hex: string, amount: number) {
  const [r, g, b] = rgb(hex);
  const target = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const mix = (v: number) => Math.round(v + (target - v) * p);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

export function isDark(hex: string) {
  const [r, g, b] = rgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}

type TeeProps = {
  color: string;
  guide?: boolean;
  className?: string;
  children?: ReactNode;
};

export const TeeMockup = forwardRef<SVGSVGElement, TeeProps>(function TeeMockup(
  { color, guide = false, className, children },
  ref
) {
  const uid = useId().replace(/:/g, '');
  const base = safeHex(color);
  const dark = isDark(base);
  const edge = shade(base, dark ? 0.2 : -0.18);
  const inner = shade(base, dark ? -0.4 : -0.3);

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 640"
      className={className}
      role="img"
      aria-label="T-shirt preview"
    >
      <defs>
        <clipPath id={`${uid}-body`}>
          <path d={BODY} />
        </clipPath>
        <clipPath id={`${uid}-print`}>
          <rect x={PRINT.x} y={PRINT.y} width={PRINT.w} height={PRINT.h} />
        </clipPath>
        <filter id={`${uid}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <linearGradient id={`${uid}-light`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.16" />
          <stop offset="0.28" stopColor="#000" stopOpacity="0" />
          <stop
            offset="0.62"
            stopColor="#fff"
            stopOpacity={dark ? 0.08 : 0.14}
          />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <ellipse
        cx="300"
        cy="622"
        rx="190"
        ry="12"
        fill="#000"
        opacity="0.16"
        filter={`url(#${uid}-blur)`}
      />
      <path d={BODY} fill={base} />
      <g clipPath={`url(#${uid}-print)`}>{children}</g>
      <g clipPath={`url(#${uid}-body)`}>
        <path
          d={FOLDS}
          fill="none"
          stroke="#000"
          strokeOpacity="0.08"
          strokeWidth="14"
          strokeLinecap="round"
          filter={`url(#${uid}-blur)`}
        />
        <rect width="600" height="640" fill={`url(#${uid}-light)`} />
        <path
          d="M134 200 Q175 160 215 44 M466 200 Q425 160 385 44"
          fill="none"
          stroke={edge}
          strokeWidth="1.5"
          opacity="0.7"
        />
      </g>
      <path d={HOLE} fill={inner} />
      <path
        d={COLLAR}
        fill="none"
        stroke={edge}
        strokeWidth="11"
        strokeLinecap="round"
      />
      {guide ? (
        <rect
          data-guide="true"
          x={PRINT.x}
          y={PRINT.y}
          width={PRINT.w}
          height={PRINT.h}
          rx="4"
          fill="none"
          stroke={dark ? '#ffffff' : '#17231f'}
          strokeOpacity="0.35"
          strokeDasharray="6 6"
        />
      ) : null}
    </svg>
  );
});
