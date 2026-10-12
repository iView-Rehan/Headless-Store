import { BRAND } from '@app/constants';

export function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M11 4 3 8.5 5.5 13 9 11.5V27h14V11.5l3.5 1.5L29 8.5 21 4q-5 5-10 0Z"
        fill="currentColor"
      />
      <circle cx="16" cy="18" r="3.2" fill="#e9a23b" />
    </svg>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-default text-xl font-semibold tracking-tight">
        {BRAND.name}
      </span>
    </span>
  );
}
