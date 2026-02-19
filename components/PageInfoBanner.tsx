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
        'flex items-start gap-0.5 flex-col mt-4 mb-3',
        className
      )}
    >
      <p className="font-bold text-[var(--text-primary)] text-base">
        {title}
      </p>
      <p className="text-gray-500 text-[13px]">{subtitle}</p>
    </div>
  );
}

