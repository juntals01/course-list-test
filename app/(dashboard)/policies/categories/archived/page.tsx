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
  RotateCcw,
  Info,
} from 'lucide-react';

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
import { MOCK_ARCHIVED_CATEGORIES } from '@/lib/mock-articles';
import type { ArchivedCategory } from '@/types/policies';
import { MobileDataCard, MobileSelectAllRow } from '@/components/custom-ui/mobile-data-card';

function getArchivedCategoryColumns(): ColumnDef<ArchivedCategory>[] {
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
      id: 'status',
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-full">
          {row.original.isActive ? (
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--policiesAndProcedures-primary)] shrink-0" />
          ) : null}
        </div>
      ),
      enableSorting: false,
      meta: { width: '30px', headerClassName: '!px-0', cellClassName: '!px-0' },
    },
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
        <div className="flex items-center justify-center w-full">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-gray-300 data-[state=checked]:bg-[var(--policiesAndProcedures-primary)] data-[state=checked]:border-[var(--policiesAndProcedures-primary)]"
          />
        </div>
      ),
      enableSorting: false,
      meta: { width: '50px', headerClassName: '!pl-0 !pr-0', cellClassName: '!pl-0 !pr-0' },
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
      header: 'Category Name',
      enableSorting: true,
      cell: ({ row }) => <span className="text-[#374151]">{row.original.name}</span>,
    },
    {
      accessorKey: 'dateDeleted',
      header: 'Date Deleted',
      enableSorting: true,
      cell: ({ row }) => <span className="text-[#4B5563]">{row.original.dateDeleted}</span>,
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
              {
                label: 'Restore Category',
                icon: <RotateCcw size={16} />,
                onClick: () => console.log('Restore:', row.original.id),
              },
            ]}
          />
        </div>
      ),
    },
  ];
}

export default function ArchivedCategoriesPage() {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(() => getArchivedCategoryColumns(), []);

  const table = useReactTable({
    data: MOCK_ARCHIVED_CATEGORIES,
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
      {/* Search row — no Filters button for archived view */}
      <div className="px-4 md:px-6 py-3 border-b border-gray-200">
        <div
          className={cn(
            'relative rounded-md border border-[var(--table-border)] transition-all duration-200 ease-in-out',
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

      {/* Content area */}
      <div className="flex-1 px-4 md:px-6 py-4 bg-[#F3F4F6]">
        <PageInfoBanner
          title="Archived Categories"
          subtitle="Categories stored for record-keeping but no longer active."
        />

        {/* Info banner */}
        <div className="mt-3 mb-4 flex items-start gap-3 rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
          <Info size={18} className="text-[#D97706] shrink-0 mt-0.5" />
          <p className="text-sm text-[#92400E]">
            You&apos;re viewing archived categories. You can choose to restore them at any time to make them visible and usable again within your workspace.
          </p>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between mt-2 mb-4">
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
              <RotateCcw size={15} />
              <span>Restore</span>
            </button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block" style={{ '--table-background-secondary': '#F7F7F5' } as React.CSSProperties}>
          <CustomTable
            table={table}
            isLoading={false}
            noResultsMessage="No archived categories found."
            skeletonRows={pagination.pageSize}
            containerClassName="border border-[var(--table-border)] rounded-md overflow-auto"
            headerRowClassName="bg-[#EAECEF] border-b border-gray-300"
            headerCellClassName="text-sm font-semibold text-[#374151] bg-[#EAECEF] border-r border-gray-300 last:border-r-0 px-4 py-2.5 [&:has([role=checkbox])]:!px-0 [&>[role=checkbox]]:!translate-y-0"
            bodyRowClassName="text-sm group transition-colors hover:bg-[#F5F9EB] hover:[&_td]:text-[var(--policiesAndProcedures-primary)] hover:shadow-[inset_3px_0_0_var(--policiesAndProcedures-primary)]"
            bodyCellClassName="px-4 py-3 text-sm text-[#4B5563] border-r border-gray-200 last:border-r-0 border-b border-gray-100 [&:has([role=checkbox])]:!px-0 [&>[role=checkbox]]:!translate-y-0"
            tableMinWidth="900px"
            tableHeaderHeight="h-[44px]"
            tableRowHeight="h-[52px]"
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
                  { icon: <RotateCcw size={16} />, onClick: () => console.log('Restore:', cat.id), label: 'Restore' },
                ]}
                fields={[
                  { label: 'Category Name', value: cat.name },
                  { label: 'Date Deleted', value: cat.dateDeleted },
                ]}
              />
            );
          })}
        </div>

        {table.getPageCount() > 1 && (
          <TablePagination table={table} app={APPS.POLICIES_AND_PROCEDURES} />
        )}
      </div>
    </>
  );
}
