import { BRAND } from '@app/constants';

export function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M5 29V15a11 11 0 0 1 22 0v14z" fill="currentColor" />
      <circle cx="16" cy="17" r="4" fill="#e9a23b" />
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
