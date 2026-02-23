'use client';

import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type RowSelectionState,
} from '@tanstack/react-table';
import {
  Plus,
  SearchIcon,
  Archive,
  ArrowUpDown,
  Pencil,
  Copy,
  Ban,
  Archive as ArchiveIcon,
} from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import FiltersPopover from '@/components/course-form/FiltersPopover';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import { TablePagination } from '@/components/custom-ui/custom-table/table-pagination';
import PageInfoBanner from '@/components/PageInfoBanner';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { APPS } from '@/types/courses';
import { MOCK_COMPANY_ARTICLES } from '@/lib/mock-articles';
import type { CompanyArticle } from '@/types/policies';
import { MobileDataCard, MobileSelectAllRow } from '@/components/custom-ui/mobile-data-card';

function getCompanyArticleColumns(): ColumnDef<CompanyArticle>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center w-full">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="border-gray-300 data-[state=checked]:bg-[var(--policiesAndProcedures-primary)] data-[state=checked]:border-[var(--policiesAndProcedures-primary)]"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-center w-full">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-gray-300 data-[state=checked]:bg-[var(--policiesAndProcedures-primary)] data-[state=checked]:border-[var(--policiesAndProcedures-primary)]"
          />
          {row.original.isActive && (
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--policiesAndProcedures-primary)] shrink-0" />
          )}
        </div>
      ),
      enableSorting: false,
      meta: { width: '70px', headerClassName: '!pl-0 !pr-0', cellClassName: '!pl-0 !pr-0' },
    },
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
      meta: { width: '70px' },
      cell: ({ row }) => (
        <span className="text-[#4B5563]">
          {String(row.original.id).padStart(3, '0')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Article Name',
      enableSorting: true,
      cell: ({ row }) => <span className="text-[#374151]">{row.original.name}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[#4B5563] uppercase tracking-wide text-xs font-medium">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: 'reviewDate',
      header: 'Review Date',
      enableSorting: true,
      cell: ({ row }) => <span className="text-[#4B5563]">{row.original.reviewDate}</span>,
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      meta: { width: '80px' },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <RowActionMenu
            app={APPS.POLICIES_AND_PROCEDURES}
            menuItems={[
              { label: 'Edit', icon: <Pencil size={16} />, onClick: () => console.log('Edit:', row.original.id) },
              { label: 'Duplicate', icon: <Copy size={16} />, onClick: () => console.log('Duplicate:', row.original.id) },
              { label: 'Suspend', icon: <Ban size={16} />, onClick: () => console.log('Suspend:', row.original.id) },
              { label: 'Archive', icon: <ArchiveIcon size={16} />, onClick: () => console.log('Archive:', row.original.id) },
            ]}
          />
        </div>
      ),
    },
  ];
}

export default function CompanyArticlesPage() {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(() => getCompanyArticleColumns(), []);

  const table = useReactTable({
    data: MOCK_COMPANY_ARTICLES,
    columns,
    state: { sorting, pagination, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <>
      {/* Filter container — h-73, rounded-t 4px, border-b 1px #E5E7EB, py-4 px-6, gap-4 */}
      <div className="w-full min-h-[73px] flex flex-col justify-center py-4 px-6 border-b border-[#E5E7EB] rounded-tl-[4px] rounded-tr-[4px]">
        <div className="flex items-center gap-4 w-full">
          <FiltersPopover app={APPS.POLICIES_AND_PROCEDURES} />
          <div
            className={cn(
              'relative flex-1 min-w-0 w-full rounded-md border border-[#E5E7EB] box-border transition-all duration-200 ease-in-out flex items-center overflow-hidden',
              Glowing(APPS.POLICIES_AND_PROCEDURES).inputBox
            )}
            style={{ height: 37 }}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
              <SearchIcon size={16} />
            </div>
            <Input
              placeholder="Search Article"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-white placeholder:text-[#9CA3AF] border-none h-full min-h-0 text-[14px] font-normal leading-[1.5] pl-9 pr-3 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Content area — pt-10 (40px) gap at top, px-10 on desktop */}
      <div className="flex-1 flex flex-col gap-6 overflow-auto bg-[#F3F4F6]">
        <div className="flex flex-col gap-3 pt-10 px-4 md:px-10">
        <PageInfoBanner
          title="Company Articles"
          subtitle="List of articles within the company."
        />

        {/* Add button - full width on mobile */}
        <div className="mt-4 md:hidden">
          <CustomButton
            title="Add Company Article"
            leadingIcon={<Plus size={16} />}
            app={APPS.POLICIES_AND_PROCEDURES}
            buttonClass="h-[42px] text-sm rounded-md w-full"
            width="w-full"
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between mt-4 md:mt-8 mb-4">
          <div className="flex items-center gap-3 text-sm text-[#4B5563]">
            <div className="flex items-center gap-2">
              <span className="hidden md:inline">Show</span>
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(val) => table.setPageSize(Number(val))}
              >
                <SelectTrigger className="h-8 w-[65px] bg-white border-gray-300 text-sm">
                  <SelectValue placeholder={pagination.pageSize} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="hidden md:inline">of {table.getFilteredRowModel().rows.length} results</span>
            </div>

            <div className="h-5 w-px bg-gray-300" />

            <button
              disabled={selectedCount === 0}
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium transition-colors',
                selectedCount > 0
                  ? 'text-[#4B5563] hover:text-[var(--policiesAndProcedures-primary)] cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed'
              )}
            >
              <Archive size={15} />
              <span>Archive</span>
            </button>
          </div>

          {/* Desktop-only add button */}
          <div className="hidden md:block">
            <CustomButton
              title="Add Company Article"
              leadingIcon={<Plus size={16} />}
              app={APPS.POLICIES_AND_PROCEDURES}
              buttonClass="h-[36px] text-sm rounded-md"
              width="px-4 py-2"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block" style={{ '--table-background-secondary': '#F7F7F5' } as React.CSSProperties}>
          <CustomTable
            table={table}
            isLoading={false}
            noResultsMessage="No company articles found."
            skeletonRows={pagination.pageSize}
            containerClassName="border border-[#D1D5DB] rounded-lg overflow-auto min-h-[600px]"
            headerRowClassName="bg-[#E5E7EB] border-b border-[#D1D5DB] h-[60px]"
            headerCellClassName="text-sm font-semibold text-[#374151] bg-[#E5E7EB] border-r border-[#D1D5DB] last:border-r-0 py-3 px-4 [&:has([role=checkbox])]:!p-0 [&>[role=checkbox]]:!translate-y-0 [&_.size-5]:rounded-[4px]"
            bodyRowClassName="text-sm group transition-colors h-[54px] border-b border-[#D1D5DB] hover:bg-[#f0f6e8] hover:[&_td]:text-[#6DA017]"
            bodyCellClassName="py-3 px-4 font-[var(--font-inter)] text-[14px] font-normal leading-[1.5] tracking-[0%] text-[#374151] border-r border-[#D1D5DB] last:border-r-0 group-hover:text-[#6DA017] group-hover:[&_*]:!text-[#6DA017] [&:has([role=checkbox])]:!p-0 [&>[role=checkbox]]:!translate-y-0"
            tableMinWidth="900px"
            tableHeaderHeight="h-[60px]"
            tableRowHeight="h-[54px]"
          />
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          <MobileSelectAllRow
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(val) => table.toggleAllPageRowsSelected(val)}
            sortIcon={<ArrowUpDown size={16} />}
            app={APPS.POLICIES_AND_PROCEDURES}
          />
          {table.getRowModel().rows.map((row) => {
            const article = row.original;
            return (
              <MobileDataCard
                key={article.id}
                id={article.id}
                selected={row.getIsSelected()}
                onSelect={(val) => row.toggleSelected(val)}
                app={APPS.POLICIES_AND_PROCEDURES}
                actions={[
                  { icon: <Pencil size={16} />, onClick: () => console.log('Edit:', article.id), label: 'Edit' },
                  { icon: <Copy size={16} />, onClick: () => console.log('Duplicate:', article.id), label: 'Duplicate' },
                  { icon: <Ban size={16} />, onClick: () => console.log('Suspend:', article.id), label: 'Suspend' },
                  { icon: <ArchiveIcon size={16} />, onClick: () => console.log('Archive:', article.id), label: 'Archive' },
                ]}
                fields={[
                  { label: 'Article Name', value: article.name },
                  { label: 'Category', value: article.category },
                  { label: 'Review Date', value: article.reviewDate },
                ]}
              />
            );
          })}
        </div>

          {table.getPageCount() > 1 && (
            <TablePagination table={table} app={APPS.POLICIES_AND_PROCEDURES} />
          )}
        </div>
      </div>
    </>
  );
}
