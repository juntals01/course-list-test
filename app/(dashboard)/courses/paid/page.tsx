'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type SortingState,
  type PaginationState,
  type RowSelectionState,
} from '@tanstack/react-table';
import {
  Plus,
  SearchIcon,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
} from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import FiltersPopover from '@/components/course-form/FiltersPopover';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import { TablePagination } from '@/components/custom-ui/custom-table/table-pagination';
import PageInfoBanner from '@/components/PageInfoBanner';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { APPS, type CourseWithDetails } from '@/types/courses';
import { MOCK_PAID_COURSES } from '@/lib/mock-data';
import { getCourseListColumns } from '@/components/course-list/course-list-columns';
import AddToCompanyDialog from '@/components/course-form/AddToCompanyDialog';
import LinkedJobRolesDialog from '@/components/course-form/LinkedJobRolesDialog';
import { MobileDataCard, MobileSelectAllRow } from '@/components/custom-ui/mobile-data-card';

export default function PaidCoursesPage() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [jobRolesDialogOpen, setJobRolesDialogOpen] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState('');

  const columns = useMemo(
    () =>
      getCourseListColumns({
        handleView: (course) => router.push(`/courses/${course.id}`),
        handleEdit: (course) => router.push(`/courses/paid/add`),
        handleDuplicate: (course) => console.log('Duplicate:', course.id),
        handleArchive: (course) => console.log('Archive:', course.id),
        handleAssign: (course) => {
          setSelectedCourseName(course.name);
          setAssignDialogOpen(true);
        },
        handleShowJobRoles: (course) => {
          setSelectedCourseName(course.name);
          setJobRolesDialogOpen(true);
        },
        showPrice: true,
      }),
    []
  );

  const table = useReactTable({
    data: MOCK_PAID_COURSES,
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
      <div className="px-4 md:px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3 md:gap-5">
          <FiltersPopover />
          <div className={cn('relative flex-1 rounded-md border border-[var(--table-border)] transition-all duration-200 ease-in-out', Glowing(APPS.TRAINING).inputBox)}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon size={14} /></div>
            <Input placeholder="Search Course" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="bg-white placeholder:text-gray-400 placeholder:text-sm border-none h-[36px] text-sm pl-9 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-6 py-4 bg-[#F3F4F6]">
        <PageInfoBanner title="Paid Courses List" subtitle="List of premium courses available on the platform." />

        <div className="mt-4 md:hidden">
          <CustomButton title="Add Paid Course" url="/courses/paid/add" leadingIcon={<Plus size={16} />} app={APPS.TRAINING} buttonClass="h-[42px] text-sm rounded-md w-full" width="w-full" />
        </div>

        <div className="flex items-center justify-between mt-4 md:mt-8 mb-4">
          <div className="flex items-center gap-3 text-sm text-[#4B5563]">
            <div className="flex items-center gap-2">
              <span className="hidden md:inline">Show</span>
              <Select value={String(pagination.pageSize)} onValueChange={(val) => table.setPageSize(Number(val))}>
                <SelectTrigger className="h-8 w-[65px] bg-white border-gray-300 text-sm"><SelectValue placeholder={pagination.pageSize} /></SelectTrigger>
                <SelectContent>{[10, 20, 30, 50].map((size) => (<SelectItem key={size} value={String(size)}>{size}</SelectItem>))}</SelectContent>
              </Select>
              <span className="hidden md:inline">of {table.getFilteredRowModel().rows.length} results</span>
            </div>
          </div>
          <div className="hidden md:block">
            <CustomButton title="Add Paid Course" url="/courses/paid/add" leadingIcon={<Plus size={16} />} app={APPS.TRAINING} buttonClass="h-[36px] text-sm rounded-md" width="px-4 py-2" />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block" style={{ '--table-background-secondary': '#F7F7F5' } as React.CSSProperties}>
          <CustomTable table={table} isLoading={false} noResultsMessage="No paid courses found." skeletonRows={pagination.pageSize} containerClassName="border border-[var(--table-border)] rounded-md overflow-auto" headerRowClassName="bg-[#EAECEF] border-b border-gray-300" headerCellClassName="text-sm font-semibold text-[#374151] bg-[#EAECEF] border-r border-gray-300 last:border-r-0 px-4 py-2.5 [&:has([role=checkbox])]:!px-0 [&>[role=checkbox]]:!translate-y-0" bodyRowClassName="text-sm group transition-colors hover:bg-[#FFF8EB] hover:[&_td]:text-[var(--training-primary)] hover:shadow-[inset_3px_0_0_var(--training-primary)]" bodyCellClassName="px-4 py-3 text-sm text-[#4B5563] border-r border-gray-200 last:border-r-0 border-b border-gray-100 [&:has([role=checkbox])]:!px-0 [&>[role=checkbox]]:!translate-y-0" tableMinWidth="900px" tableHeaderHeight="h-[44px]" tableRowHeight="h-[52px]" />
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {table.getRowModel().rows.map((row, idx) => {
            const course = row.original as CourseWithDetails;
            return (
              <MobileDataCard
                key={course.id}
                id={course.id}
                actions={[
                  { icon: <Eye size={16} />, onClick: () => router.push(`/courses/${course.id}`), label: 'View' },
                  { icon: <Pencil size={16} />, onClick: () => router.push('/courses/paid/add'), label: 'Edit' },
                  { icon: <Plus size={16} />, onClick: () => { setSelectedCourseName(course.name); setAssignDialogOpen(true); }, label: 'Add to Company' },
                  { icon: <Trash2 size={16} />, onClick: () => console.log('Delete:', course.id), label: 'Delete' },
                ]}
                fields={[
                  { label: 'Course Name', value: course.name },
                  { label: 'Company', value: course.assignedCompanies ? (
                    <span>{course.assignedCompanies.length > 35 ? course.assignedCompanies.slice(0, 35) + ', ...' : course.assignedCompanies}
                    {course.assignedCompanies.length > 35 && <button className="block text-[var(--training-primary)] text-sm">see more</button>}</span>
                  ) : '—' },
                  { label: 'Annual Price', value: course.price ? `$${course.price}` : '—' },
                  { label: 'Total Units', value: course.totalUnits },
                ]}
              />
            );
          })}
        </div>

        {table.getPageCount() > 1 && <TablePagination table={table} app={APPS.TRAINING} />}
      </div>

      <AddToCompanyDialog isOpen={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} courseName={selectedCourseName} />
      <LinkedJobRolesDialog isOpen={jobRolesDialogOpen} onClose={() => setJobRolesDialogOpen(false)} courseName={selectedCourseName} />
    </>
  );
}
