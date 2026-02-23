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
  SearchIcon,
  GripVertical,
  ArrowUpDown,
  Archive,
  Pencil,
  Copy,
  Ban,
  Plus,
} from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import FiltersPopover from '@/components/course-form/FiltersPopover';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import { TablePagination } from '@/components/custom-ui/custom-table/table-pagination';
import PageInfoBanner from '@/components/PageInfoBanner';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import { Input } from '@/components/ui/input';
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
import { MOCK_ACTIVE_CATEGORIES } from '@/lib/mock-articles';
import type { ActiveCategory } from '@/types/policies';
import { MobileDataCard, MobileSelectAllRow } from '@/components/custom-ui/mobile-data-card';

function getCategoryColumns(): ColumnDef<ActiveCategory>[] {
  return [
    {
      id: 'drag',
      header: () => null,
      cell: ({ row }) =>
        row.original.hasDragHandle ? (
          <div className="flex items-center justify-center w-full text-gray-400 cursor-grab">
            <GripVertical size={16} />
          </div>
        ) : null,
      enableSorting: false,
      meta: { width: '40px', headerClassName: '!px-0', cellClassName: '!px-0' },
    },
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
      meta: { width: '80px' },
      cell: ({ row }) => (
        <span className="text-[#4B5563]">
          {String(row.original.id).padStart(3, '0')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Category Name',
      enableSorting: true,
      cell: ({ row }) => (
        <span className={cn(
          'text-[#374151]',
          row.original.categoryType === 'Site' && 'text-gray-400'
        )}>
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: 'categoryType',
      header: 'Category Type',
      enableSorting: true,
      cell: ({ row }) => (
        <span className={cn(
          'text-sm',
          row.original.categoryType === 'Site' ? 'text-gray-400' : 'text-[#4B5563]'
        )}>
          {row.original.categoryType}
        </span>
      ),
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
              { label: 'Archive', icon: <Archive size={16} />, onClick: () => console.log('Archive:', row.original.id) },
            ]}
          />
        </div>
      ),
    },
  ];
}

export default function ActiveCategoriesPage() {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(() => getCategoryColumns(), []);

  const table = useReactTable({
    data: MOCK_ACTIVE_CATEGORIES,
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

  return (
    <>
      {/* Filter container — h-73, rounded-t 4px, border-b 1px #E5E7EB, py-4 px-6, gap-4 */}
      <div className="w-full h-[73px] flex flex-col justify-center py-4 px-6 border-b border-[#E5E7EB] rounded-tl-[4px] rounded-tr-[4px]">
        <div className="flex items-center gap-4 w-full">
          <FiltersPopover app={APPS.POLICIES_AND_PROCEDURES} />
          <div
            className={cn(
              'relative flex-1 rounded-md border border-[var(--table-border)] transition-all duration-200 ease-in-out',
              Glowing(APPS.POLICIES_AND_PROCEDURES).inputBox
            )}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon size={14} />
            </div>
            <Input
              placeholder="Search Category"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-white placeholder:text-gray-400 placeholder:text-sm border-none h-[36px] text-sm pl-9 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>

      {/* Content area — pt-10 (40px) gap at top, px-10 on desktop */}
      <div className="flex-1 flex flex-col gap-6 overflow-auto bg-[#F3F4F6]">
        <div className="flex flex-col gap-3 pt-10 px-4 md:px-10">
        <PageInfoBanner
          title="Active Categories"
          subtitle="List of categories currently available and in use."
        />

        {/* Controls row */}
        <div className="flex items-center justify-between mt-4 mb-4">
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
          </div>
          <CustomButton
            title="Add Category"
            type="button"
            app={APPS.POLICIES_AND_PROCEDURES}
            leadingIcon={<Plus size={14} />}
            buttonClass="h-[36px] text-sm rounded-md"
            width="px-4 py-2"
          />
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <CustomTable
            table={table}
            isLoading={false}
            noResultsMessage="No categories found."
            skeletonRows={pagination.pageSize}
            containerClassName="border border-[#D1D5DB] rounded-lg overflow-auto min-h-[600px]"
            headerRowClassName="bg-[#E5E7EB] border-b border-[#D1D5DB] h-[60px]"
            headerCellClassName="text-sm font-semibold text-[#374151] bg-[#E5E7EB] border-r border-[#D1D5DB] last:border-r-0 py-3 px-4 [&:has([role=checkbox])]:!p-0 [&>[role=checkbox]]:!translate-y-0 [&_.size-5]:rounded-[4px]"
            bodyRowClassName="text-sm group transition-colors h-[54px] border-b border-[#D1D5DB] hover:bg-[#f0f6e8] hover:[&_td]:text-[#6DA017]"
            bodyCellClassName="py-3 px-4 font-[var(--font-inter)] text-[14px] font-normal leading-[1.5] tracking-[0%] text-[#374151] border-r border-[#D1D5DB] last:border-r-0 group-hover:text-[#6DA017] group-hover:[&_*]:!text-[#6DA017] [&:has([role=checkbox])]:!p-0 [&>[role=checkbox]]:!translate-y-0"
            tableMinWidth="700px"
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
            const cat = row.original;
            return (
              <MobileDataCard
                key={cat.id}
                id={cat.id}
                selected={row.getIsSelected()}
                onSelect={(val) => row.toggleSelected(val)}
                app={APPS.POLICIES_AND_PROCEDURES}
                actions={[
                  { icon: <Pencil size={16} />, onClick: () => console.log('Edit:', cat.id), label: 'Edit' },
                  { icon: <Archive size={16} />, onClick: () => console.log('Archive:', cat.id), label: 'Archive' },
                ]}
                fields={[
                  { label: 'Category Name', value: cat.name },
                  { label: 'Category Type', value: cat.categoryType },
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
