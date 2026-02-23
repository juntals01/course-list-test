// File: ./components/custom-ui/custom-table/table-pagination.tsx
'use client';
// components/custom-ui/custom-table/table-pagination.tsx
import type { Table as TanstackTable } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { APPS } from '#types/ENUMS';
import Themes from '../styling/Themes';
import { cn } from '@/lib/utils';

type TablePaginationProps<TData> = {
  table: TanstackTable<TData>;
  app?: APPS;
};

export function TablePagination<TData>({
  table,
  app = APPS.PORTAL,
}: TablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const theme = Themes(app);

  // Function to generate page numbers with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    if (totalPages <= 5) {
      // Show all if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Always show first page
      if (currentPage <= 3) {
        // Near the start
        pageNumbers.push(2, 3);
        pageNumbers.push('...');
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push('...');
        pageNumbers.push(totalPages - 2, totalPages - 1);
      } else {
        // In the middle
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages); // Always show last page
    }
    // Remove duplicate ellipsis and ensure correct order
    const uniquePages: (number | string)[] = [];
    let lastItem: number | string | null = null;
    for (const item of pageNumbers) {
      if (item === '...' && lastItem === '...') continue;
      uniquePages.push(item);
      lastItem = item;
    }
    return uniquePages;
  };

  const pageItems = getPageNumbers();
  const isPolicies = app === APPS.POLICIES_AND_PROCEDURES;
  const containerClass = isPolicies
    ? 'flex items-center justify-center gap-2.5 p-2.5 w-[348px] h-[61px] mx-auto'
    : 'flex items-center justify-center space-x-1 py-4 text-sm';
  const labelClass = isPolicies
    ? 'font-[var(--font-inter)] font-normal text-[14px] leading-[1.5] tracking-[0%] text-[#6DA017]'
    : '';

  return (
    <div className={containerClass}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        aria-label="Go to previous page"
        className={cn(theme.button.ghost, 'gap-1', labelClass, isPolicies && 'text-[14px] font-[var(--font-inter)]')}
      >
        <ChevronLeft size={14} />
        Previous
      </Button>

      <div className={cn('flex items-center', isPolicies ? 'gap-1' : 'gap-0.5')}>
        {pageItems.map((pageNumber, idx) => {
          if (pageNumber === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className={cn('px-2', isPolicies ? 'text-[#6DA017]' : 'text-gray-400')}
              >
                ...
              </span>
            );
          }
          const pageIndex = Number(pageNumber) - 1;
          const isCurrentPage =
            pageIndex === table.getState().pagination.pageIndex;
          return (
            <Button
              key={`page-${pageNumber}`}
              variant="ghost"
              size="sm"
              className={cn(
                'w-8 h-8 p-0',
                theme.button.ghost,
                labelClass,
                isCurrentPage &&
                  `pointer-events-none font-bold ${theme.button.secondary}`
              )}
              onClick={() => table.setPageIndex(pageIndex)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        aria-label="Go to next page"
        className={cn(theme.button.ghost, 'gap-1', labelClass, isPolicies && 'text-[14px] font-[var(--font-inter)]')}
      >
        Next
        <ChevronRight size={14} />
      </Button>
    </div>
  );
}
