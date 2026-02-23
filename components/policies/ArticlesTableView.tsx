'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  GripVertical,
  ArrowUpDown,
  Pencil,
  Copy,
  Ban,
  Archive as ArchiveIcon,
} from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import type { Article } from '@/types/policies';
import { MobileDataCard, MobileSelectAllRow } from '@/components/custom-ui/mobile-data-card';

function getArticleColumns(showArticleType: boolean, onEdit?: (id: number) => void): ColumnDef<Article>[] {
  const cols: ColumnDef<Article>[] = [
    {
      id: 'drag',
      header: () => null,
      cell: ({ row }) =>
        row.original.hasDragHandle ? (
          <div className="flex w-full items-center justify-center cursor-grab min-h-[54px]">
            <GripVertical size={24} className="shrink-0 text-[#6DA017]" />
          </div>
        ) : null,
      enableSorting: false,
      meta: { width: '80px', headerClassName: '!px-0', cellClassName: '!px-0' },
    },
    {
      id: 'select',
      header: ({ table }) => (
        <div className="w-full min-h-9 flex items-center justify-center gap-2 rounded-[4px] p-2">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="size-5 rounded-[4px] border border-[#D1D5DB] bg-[#F9FAFB] data-[state=checked]:bg-[var(--policiesAndProcedures-primary)] data-[state=checked]:border-[var(--policiesAndProcedures-primary)]"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-full min-h-9 flex items-center justify-center gap-2 rounded-[4px] p-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="size-5 rounded-[4px] border border-[#D1D5DB] bg-[#F9FAFB] data-[state=checked]:bg-[var(--policiesAndProcedures-primary)] data-[state=checked]:border-[var(--policiesAndProcedures-primary)]"
          />
        </div>
      ),
      enableSorting: false,
      meta: { width: '68px', headerClassName: '!pl-0 !pr-0', cellClassName: '!pl-0 !pr-0' },
    },
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
      meta: { width: '140px' },
      cell: ({ row }) => (
        <span className="text-[14px] font-normal leading-[1.5] text-[#374151]">
          {String(row.original.id).padStart(3, '0')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Article Name',
      enableSorting: true,
      meta: { cellClassName: 'group-hover:shadow-[inset_1px_0_0_0_#6DA017]' },
      cell: ({ row }) => (
        <span className="text-[14px] font-normal leading-[1.5] text-[#374151]">{row.original.name}</span>
      ),
    },
  ];

  if (showArticleType) {
    cols.push({
      accessorKey: 'articleType',
      header: 'Article Type',
      enableSorting: true,
      meta: { width: '150px', cellClassName: 'group-hover:shadow-[inset_1px_0_0_0_#6DA017]' },
      cell: ({ row }) => (
        <span className="text-[14px] font-normal leading-[1.5] text-[#374151]">{row.original.articleType}</span>
      ),
    });
  }

  cols.push(
    {
      accessorKey: 'category',
      header: 'Category',
      enableSorting: true,
      meta: { cellClassName: 'group-hover:shadow-[inset_1px_0_0_0_#6DA017]' },
      cell: ({ row }) => (
        <span className="text-[14px] font-normal leading-[1.5] text-[#374151]">{row.original.category}</span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      meta: { width: '80px', cellClassName: 'group-hover:shadow-[inset_1px_0_0_0_#6DA017]' },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <RowActionMenu
            app={APPS.POLICIES_AND_PROCEDURES}
            menuItems={[
              { label: 'Edit', icon: <Pencil size={16} />, onClick: () => onEdit?.(row.original.id) },
              { label: 'Duplicate', icon: <Copy size={16} />, onClick: () => console.log('Duplicate:', row.original.id) },
              { label: 'Suspend', icon: <Ban size={16} />, onClick: () => console.log('Suspend:', row.original.id) },
              { label: 'Archive', icon: <ArchiveIcon size={16} />, onClick: () => console.log('Archive:', row.original.id) },
            ]}
          />
        </div>
      ),
    },
  );

  return cols;
}

type ArticlesTableViewProps = {
  data: Article[];
  title: string;
  subtitle: string;
  showArticleType?: boolean;
  addButtonLabel?: string;
};

export default function ArticlesTableView({
  data,
  title,
  subtitle,
  showArticleType = true,
  addButtonLabel = 'Add Article',
}: ArticlesTableViewProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const handleEdit = useCallback((id: number) => router.push(`/policies/articles/${id}/edit`), [router]);
  const columns = useMemo(() => getArticleColumns(showArticleType, handleEdit), [showArticleType, handleEdit]);

  const table = useReactTable({
    data,
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

      {/* Content area — outer gap 24px, inner gap 12px; top gap above "All Master Articles" */}
      <div className="flex-1 flex flex-col gap-6 overflow-auto bg-[#F3F4F6]">
        <div className="flex flex-col gap-3 pt-10 px-4 md:px-10">
          <PageInfoBanner title={title} subtitle={subtitle} />

          {/* Add button - full width on mobile */}
          <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                <CustomButton
                  title={addButtonLabel}
                  leadingIcon={<Plus size={16} />}
                  app={APPS.POLICIES_AND_PROCEDURES}
                  buttonClass="h-[42px] text-sm rounded-md w-full"
                  width="w-full"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem className="text-sm cursor-pointer">Add Master Article</DropdownMenuItem>
              <DropdownMenuItem className="text-sm cursor-pointer">Add Company Article</DropdownMenuItem>
              <DropdownMenuItem className="text-sm cursor-pointer">Add Site Article</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>

          {/* Controls row — h-45 gap-2; show/results h-37 gap-2.5 border-r pr-6; dropdown 54x37; buttons Copy From Company + Add Master Article */}
          <div className="flex items-center justify-between h-[45px] gap-2 mb-4">
            <div className="flex items-center gap-2">
              {/* Show until results — w-218 h-37 gap-2.5 border-r pr-6 */}
              <div className="flex items-center gap-2.5 h-[37px] pr-6 border-r border-gray-200">
                <span className="text-[14px] font-normal leading-[1.5] text-[#374151]">Show</span>
                <Select
                  value={String(pagination.pageSize)}
                  onValueChange={(val) => table.setPageSize(Number(val))}
                >
                  <SelectTrigger className="h-[37px] w-[54px] rounded-[4px] p-2 border border-gray-300 bg-white text-[14px] font-medium leading-[1.5] [&>svg]:size-[14px]">
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
                <span className="text-[14px] font-normal leading-[1.5] text-[#374151]">of {table.getFilteredRowModel().rows.length} results</span>
              </div>

              {/* Archive — archive.png 14x14, text 14px 400 #374151 */}
              <button
                disabled={selectedCount === 0}
                className={cn(
                  'flex items-center gap-2 text-[14px] font-normal leading-[1.5] transition-colors',
                  selectedCount > 0
                    ? 'text-[#374151] hover:text-[var(--policiesAndProcedures-primary)] cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/archive.png" alt="" width={14} height={14} className="shrink-0 object-contain" />
                <span>Archive</span>
              </button>
            </div>

            {/* Copy From Company (secondary) + Add Master Article (primary) */}
            <div className="flex items-center gap-2">
              <Link
                href="/policies/articles/company"
                className="h-[41px] min-w-[196px] flex items-center justify-center gap-1 rounded-[6px] border border-[#6DA017] bg-white py-[10px] pl-4 pr-5 text-[14px] font-semibold leading-[1.5] text-[#6DA017] hover:bg-[#6DA0171A] transition-colors"
              >
                <Copy size={14} className="shrink-0" />
                <span>Copy From Company</span>
              </Link>
              <Link
                href="/policies/articles/add"
                className="h-[41px] flex items-center justify-center gap-1 rounded-[6px] bg-[#6DA017] py-[10px] pl-4 pr-5 text-[14px] font-semibold leading-[1.5] text-white hover:bg-[#5c8f15] transition-colors"
              >
                <Plus size={14} className="shrink-0" />
                <span>Add Master Article</span>
              </Link>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block" style={{ '--table-background-secondary': '#F7F7F5' } as React.CSSProperties}>
          <CustomTable
            table={table}
            isLoading={false}
            noResultsMessage="No articles found."
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
                key={`${article.id}-${article.name}-${article.articleType}`}
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
                  ...(showArticleType ? [{ label: 'Article Type', value: article.articleType }] : []),
                  { label: 'Category', value: article.category },
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
