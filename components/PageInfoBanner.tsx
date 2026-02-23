// File: components/PageInfoBanner.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
interface PageInfoBannerProps {
  title: string;
  subtitle: string;
  className?: string;
}
export default function PageInfoBanner({
  title,
  subtitle,
  className,
}: PageInfoBannerProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 pb-4 w-full',
        className
      )}
    >
      <p className="font-semibold text-[18px] leading-[1] text-[var(--text-primary)]">
        {title}
      </p>
      <p className="text-[#6B7280] text-[14px] font-normal leading-[1.5]">
        {subtitle}
      </p>
    </div>
  );
}

