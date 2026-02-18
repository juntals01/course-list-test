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
        'flex items-start gap-1 rounded-l text-sm flex-col mb-6',
        className
      )}
    >
      <p className="font-semibold text-[var(--text-primary)] text-lg">
        {title}
      </p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}

