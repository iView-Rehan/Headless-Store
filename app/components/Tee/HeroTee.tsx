'use client';
import { useState } from 'react';
import { TeeMockup, isDark } from './TeeMockup';

const COLORS = [
  { name: 'Bone', hex: '#f1f0ea' },
  { name: 'Pine', hex: '#2e4a40' },
  { name: 'Ink', hex: '#17231f' },
  { name: 'Marigold', hex: '#e9a23b' },
];

export function HeroTee() {
  const [index, setIndex] = useState(1);
  const color = COLORS[index];
  const ink = isDark(color.hex) ? '#f5f6f1' : '#2e4a40';
  const sun = color.name === 'Marigold' ? '#17231f' : '#e9a23b';

  return (
    <div className="rounded-[14px] bg-[#e3e7de] p-4 sm:p-8">
      <TeeMockup color={color.hex} className="w-full h-auto max-h-[520px]">
        <circle cx="300" cy="248" r="58" fill={sun} />
        <path d="M212 392 L270 296 L306 350 L338 306 L388 392 Z" fill={ink} />
        <rect x="212" y="402" width="176" height="4" fill={ink} />
      </TeeMockup>
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex gap-2.5" role="group" aria-label="Shirt colour">
          {COLORS.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={c.name}
              aria-pressed={i === index}
              className={`w-8 h-8 rounded-full border border-black/15 ring-offset-2 ring-offset-[#e3e7de] ${
                i === index ? 'ring-2 ring-[#2e4a40]' : ''
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <a
          href="/studio"
          className="text-sm font-medium underline underline-offset-4"
        >
          Print your own
        </a>
      </div>
    </div>
  );
}
