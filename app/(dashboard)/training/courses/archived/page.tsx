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
  RotateCcw,
  Trash2,
  ArrowUpDown,
} from 'lucide-react';
import { format } from 'date-fns';

import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import FiltersPopover from '@/components/course-form/FiltersPopover';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import { TablePagination } from '@/components/custom-ui/custom-table/table-pagination';
import PageInfoBanner from '@/components/PageInfoBanner';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import { cn } from '@/lib/utils';
import { APPS, type CourseWithDetails } from '@/types/courses';
import { MOCK_ARCHIVED_COURSES } from '@/lib/mock-data';
import { MobileDataCard, MobileSelectAllRow } from '@/components/custom-ui/mobile-data-card';

function getArchivedCourseColumns(): ColumnDef<CourseWithDetails>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center w-full">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="border-gray-300 data-[state=checked]:bg-[var(--training-primary)] data-[state=checked]:border-[var(--training-primary)]"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-full">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-gray-300 data-[state=checked]:bg-[var(--training-primary)] data-[state=checked]:border-[var(--training-primary)]"
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
      cell: ({ row }) => <span className="text-[#4B5563]">{row.original.id}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Course Name',
      enableSorting: true,
      cell: ({ row }) => <span className="text-[#374151]">{row.original.name}</span>,
    },
    {
      accessorKey: 'deletedAt',
      header: 'Date Archived',
      enableSorting: true,
      cell: ({ row }) => {
        const date = row.original.deletedAt;
        if (!date) return <span className="text-gray-400">—</span>;
        return <span className="text-[#4B5563]">{format(new Date(date), 'EEE, yyyy-MM-dd, h:mm a')}</span>;
      },
    },
    {
      accessorKey: 'totalUnits',
      header: 'Total Units',
      enableSorting: true,
      meta: { width: '100px' },
      cell: ({ row }) => <span className="text-[#4B5563]">{row.original.totalUnits}</span>,
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      meta: { width: '80px' },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <RowActionMenu
            app={APPS.TRAINING}
            menuItems={[
              { label: 'Restore', icon: <RotateCcw size={16} />, onClick: () => console.log('Restore:', row.original.id) },
              { label: 'Delete Permanently', icon: <Trash2 size={16} />, onClick: () => console.log('Delete:', row.original.id) },
            ]}
          />
        </div>
      ),
    },
  ];
}

export default function ArchivedCoursesPage() {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(() => getArchivedCourseColumns(), []);

  const table = useReactTable({
    data: MOCK_ARCHIVED_COURSES,
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
      <div className="px-4 md:px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3 md:gap-5">
          <div className={cn('relative flex-1 rounded-md border border-[var(--table-border)] transition-all duration-200 ease-in-out', Glowing(APPS.TRAINING).inputBox)}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon size={14} /></div>
            <Input placeholder="Search Course" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="bg-white placeholder:text-gray-400 placeholder:text-sm border-none h-[36px] text-sm pl-9 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-6 py-4 bg-[#F3F4F6]">
        <PageInfoBanner title="Archived Courses List" subtitle="List of archived courses hidden from the active list." />

        <div className="flex flex-wrap items-center justify-between mt-4 md:mt-8 mb-4 gap-2">
          <div className="flex items-center gap-3 text-sm text-[#4B5563]">
            <div className="flex items-center gap-2">
              <span className="hidden md:inline">Show</span>
              <Select value={String(pagination.pageSize)} onValueChange={(val) => table.setPageSize(Number(val))}>
                <SelectTrigger className="h-8 w-[65px] bg-white border-gray-300 text-sm"><SelectValue placeholder={pagination.pageSize} /></SelectTrigger>
                <SelectContent>{[10, 20, 30, 50].map((size) => (<SelectItem key={size} value={String(size)}>{size}</SelectItem>))}</SelectContent>
              </Select>
              <span className="hidden md:inline">of {table.getFilteredRowModel().rows.length} results</span>
            </div>

            <div className="h-5 w-px bg-gray-300" />

            <button disabled={selectedCount === 0} className={cn('flex items-center gap-1.5 text-sm font-medium transition-colors', selectedCount > 0 ? 'text-[#4B5563] hover:text-[var(--training-primary)] cursor-pointer' : 'text-gray-400 cursor-not-allowed')}>
              <RotateCcw size={15} /><span>Restore</span>
            </button>

            <button disabled={selectedCount === 0} className={cn('flex items-center gap-1.5 text-sm font-medium transition-colors', selectedCount > 0 ? 'text-red-500 hover:text-red-600 cursor-pointer' : 'text-gray-400 cursor-not-allowed')}>
              <Trash2 size={15} /><span>Delete Permanently</span>
            </button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block" style={{ '--table-background-secondary': '#F7F7F5' } as React.CSSProperties}>
          <CustomTable table={table} isLoading={false} noResultsMessage="No archived courses found." skeletonRows={pagination.pageSize} containerClassName="border border-[var(--table-border)] rounded-md overflow-auto" headerRowClassName="bg-[#EAECEF] border-b border-gray-300" headerCellClassName="text-sm font-semibold text-[#374151] bg-[#EAECEF] border-r border-gray-300 last:border-r-0 px-4 py-2.5 [&:has([role=checkbox])]:!px-0 [&>[role=checkbox]]:!translate-y-0" bodyRowClassName="text-sm group transition-colors hover:bg-[#FFF8EB] hover:[&_td]:text-[var(--training-primary)] hover:shadow-[inset_3px_0_0_var(--training-primary)]" bodyCellClassName="px-4 py-3 text-sm text-[#4B5563] border-r border-gray-200 last:border-r-0 border-b border-gray-100 [&:has([role=checkbox])]:!px-0 [&>[role=checkbox]]:!translate-y-0" tableMinWidth="900px" tableHeaderHeight="h-[44px]" tableRowHeight="h-[52px]" />
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          <MobileSelectAllRow
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(val) => table.toggleAllPageRowsSelected(val)}
            sortIcon={<ArrowUpDown size={16} />}
          />
          {table.getRowModel().rows.map((row, idx) => {
            const course = row.original as CourseWithDetails;
            return (
              <MobileDataCard
                key={course.id}
                id={course.id}
                selected={row.getIsSelected()}
                onSelect={(val) => row.toggleSelected(val)}
                actions={[
                  { icon: <RotateCcw size={16} />, onClick: () => console.log('Restore:', course.id), label: 'Restore' },
                  { icon: <Trash2 size={16} />, onClick: () => console.log('Delete:', course.id), label: 'Delete' },
                ]}
                fields={[
                  { label: 'Course Name', value: course.name },
                  { label: 'Total Units', value: course.totalUnits },
                ]}
              />
            );
          })}
        </div>

        {table.getPageCount() > 1 && <TablePagination table={table} app={APPS.TRAINING} />}
      </div>
    </>
  );
}
