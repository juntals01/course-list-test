'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table';
import { ArrowLeft, Plus, Trash2, Search, ArrowUpDown, InfoIcon } from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import CustomAccordion from '@/components/custom-ui/custom-accordion';
import CustomInput from '@/components/custom-ui/custom-input';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { APPS, type JobRoleCourse } from '@/types/courses';
import { MOCK_JOB_ROLE_COURSES } from '@/lib/mock-course-detail';
import { MobileDataCard, MobileSelectAllRow } from '@/components/custom-ui/mobile-data-card';

function getEditJobRoleCourseColumns(onRemove: (id: number) => void): ColumnDef<JobRoleCourse>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center w-full">
          <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" className="border-gray-300 data-[state=checked]:bg-[var(--training-primary)] data-[state=checked]:border-[var(--training-primary)]" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-full">
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" className="border-gray-300 data-[state=checked]:bg-[var(--training-primary)] data-[state=checked]:border-[var(--training-primary)]" />
        </div>
      ),
      enableSorting: false,
      meta: { width: '50px', headerClassName: '!pl-0 !pr-0', cellClassName: '!pl-0 !pr-0' },
    },
    { accessorKey: 'id', header: 'ID', enableSorting: true, meta: { width: '80px' }, cell: ({ row }) => <span className="text-[#4B5563]">{row.original.id}</span> },
    { accessorKey: 'name', header: 'Course Name', enableSorting: true, cell: ({ row }) => <span className="text-[#374151]">{row.original.name}</span> },
    { accessorKey: 'totalUnits', header: 'Total Units', enableSorting: true, meta: { width: '120px' }, cell: ({ row }) => <span className="text-[#4B5563]">{row.original.totalUnits}</span> },
    {
      id: 'actions', header: () => <div className="text-center">Actions</div>, meta: { width: '80px' },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <RowActionMenu app={APPS.TRAINING} menuItems={[{ label: 'Remove', icon: <Trash2 size={16} />, onClick: () => onRemove(row.original.id) }]} />
        </div>
      ),
    },
  ];
}

export default function EditJobRolePage() {
  const [jobRoleName, setJobRoleName] = useState('Forklift Operator');
  const [courses, setCourses] = useState<JobRoleCourse[]>(MOCK_JOB_ROLE_COURSES);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedCount = Object.keys(rowSelection).length;

  const handleRemoveCourse = (id: number) => setCourses((prev) => prev.filter((c) => c.id !== id));

  const handleRemoveSelected = () => {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    setCourses((prev) => prev.filter((_, i) => !selectedIndices.includes(i)));
    setRowSelection({});
  };

  const columns = useMemo(() => getEditJobRoleCourseColumns(handleRemoveCourse), []);

  const table = useReactTable({
    data: courses,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  return (
    <div className="flex-1 px-4 md:px-6 py-4 flex flex-col">
      <Link href="/job-roles" className="inline-flex items-center gap-1.5 text-[var(--training-primary)] text-sm font-medium hover:underline mb-4">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Edit Job Role</h1>
        <p className="text-sm text-gray-500 mt-1">Modify job role and course details</p>
      </div>

      <div className="space-y-6 flex-1">
        <CustomAccordion title="Job Role Details" defaultExpanded={true}>
          <div className="space-y-5">
            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
              <label className="text-sm font-medium text-[var(--text-primary)]">Job Role Name</label>
              <CustomInput name="jobRoleName" placeholder="Enter Job Role Name" value={jobRoleName} onValueChange={setJobRoleName} app={APPS.TRAINING} tooltip="Name of the job role" />
            </div>
          </div>
        </CustomAccordion>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Courses List</h3>
            <InfoIcon size={14} className="text-[var(--training-primary)]" />
          </div>

          <CustomButton title="Add Course" leadingIcon={<Plus size={16} />} app={APPS.TRAINING} buttonClass="h-[42px] text-sm rounded-md w-full mb-3" width="w-full" />

          <div className="flex items-center justify-between mb-3">
            <button onClick={handleRemoveSelected} disabled={selectedCount === 0} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${selectedCount > 0 ? 'text-[#4B5563] hover:text-red-500 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}>
              <Trash2 size={15} /> Remove Course
            </button>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block" style={{ '--table-background-secondary': '#F7F7F5' } as React.CSSProperties}>
            <CustomTable table={table} isLoading={false} noResultsMessage="No courses assigned." containerClassName="border border-[var(--table-border)] rounded-md overflow-auto" headerRowClassName="bg-[#EAECEF] border-b border-gray-300" headerCellClassName="text-sm font-semibold text-[#374151] bg-[#EAECEF] border-r border-gray-300 last:border-r-0 px-4 py-2.5 [&:has([role=checkbox])]:!px-0 [&>[role=checkbox]]:!translate-y-0" bodyRowClassName="text-sm group transition-colors hover:bg-[#FFF8EB] hover:[&_td]:text-[var(--training-primary)] hover:shadow-[inset_3px_0_0_var(--training-primary)]" bodyCellClassName="px-4 py-3 text-sm text-[#4B5563] border-r border-gray-200 last:border-r-0 border-b border-gray-100 [&:has([role=checkbox])]:!px-0 [&>[role=checkbox]]:!translate-y-0" tableMinWidth="700px" tableHeaderHeight="h-[44px]" tableRowHeight="h-[52px]" />
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            <MobileSelectAllRow
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
              onCheckedChange={(val) => table.toggleAllPageRowsSelected(val)}
              sortIcon={<ArrowUpDown size={16} />}
            />
            {table.getRowModel().rows.map((row, idx) => {
              const course = row.original;
              return (
                <MobileDataCard
                  key={course.id}
                  id={course.id}
                  selected={row.getIsSelected()}
                  onSelect={(val) => row.toggleSelected(val)}
                  actions={[
                    { icon: <Search size={16} />, onClick: () => {}, label: 'View' },
                    { icon: <Trash2 size={16} />, onClick: () => handleRemoveCourse(course.id), label: 'Remove' },
                  ]}
                  fields={[
                    { label: 'Course Name', value: course.name },
                    { label: 'Total Units', value: course.totalUnits },
                  ]}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center md:justify-end gap-3 py-6 border-t border-gray-200 mt-6">
        <CustomButton title="Save" app={APPS.TRAINING} variant={BUTTON_VARIANTS.OUTLINE} buttonClass="h-[36px] text-sm rounded-md bg-white" width="px-6 py-2" />
        <CustomButton title="Save and Close" app={APPS.TRAINING} buttonClass="h-[36px] text-sm rounded-md" width="px-6 py-2" />
      </div>
    </div>
  );
}
