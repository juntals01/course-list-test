'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Plus,
  SearchIcon,
  Archive,
  InfoIcon,
  Eye,
  Pencil,
  Copy,
  List,
  ArrowUpDown,
} from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import FiltersPopover from '@/components/course-form/FiltersPopover';
import CustomDeleteDialog from '@/components/custom-ui/custom-delete-dialog';
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
import { APPS } from '@/types/courses';

import { getCourseListColumns } from '@/components/course-list/course-list-columns';
import { useCoursesTable, ActionType } from '@/hooks/useCoursesTable';
import AddToCompanyDialog from '@/components/course-form/AddToCompanyDialog';
import LinkedJobRolesDialog from '@/components/course-form/LinkedJobRolesDialog';
import { MobileDataCard, MobileSelectAllRow } from '@/components/custom-ui/mobile-data-card';
import type { CourseWithDetails } from '@/types/courses';

export default function CoursesPage() {
  const router = useRouter();
  const {
    state,
    dispatch,
    handleDuplicateCourse,
    handleArchiveCourse,
    handleBulkArchive,
    onBulkArchiveConfirm,
    setSorting,
    setPagination,
    setGlobalFilter,
    setRowSelection,
    setColumnFilters,
    selectedCount,
    handlers,
  } = useCoursesTable([], false);

  const {
    courses,
    isLoading,
    sorting,
    pagination,
    rowSelection,
    globalFilter,
    columnFilters,
    duplicateDialogOpen,
    archiveDialogOpen,
    bulkArchiveDialogOpen,
    selectedCourse,
    isProcessing,
  } = state;

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [jobRolesDialogOpen, setJobRolesDialogOpen] = useState(false);
  const [assignCourseName, setAssignCourseName] = useState('');

  const columns = useMemo(
    () =>
      getCourseListColumns({
        handleView: (course) => router.push(`/courses/${course.id}`),
        handleEdit: (course) => router.push(`/courses/add`),
        handleDuplicate: (course) =>
          dispatch({ type: ActionType.OPEN_DUPLICATE_DIALOG, payload: course }),
        handleArchive: handlers.handleOpenArchiveDialog,
        handleAssign: (course) => {
          setAssignCourseName(course.name);
          setAssignDialogOpen(true);
        },
        handleShowJobRoles: (course) => {
          setAssignCourseName(course.name);
          setJobRolesDialogOpen(true);
        },
        showPrice: false,
      }),
    [dispatch, handlers.handleOpenArchiveDialog]
  );

  const table = useReactTable({
    data: courses,
    columns,
    state: { sorting, pagination, globalFilter, rowSelection, columnFilters },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  });

  const closeAllDialogs = useCallback(
    () => dispatch({ type: ActionType.CLOSE_DIALOGS }),
    [dispatch]
  );

  return (
    <>
      {/* Filter + Search row */}
      <div className="px-4 md:px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3 md:gap-5">
          <FiltersPopover />
          <div
            className={cn(
              'relative flex-1 rounded-md border border-[var(--table-border)] transition-all duration-200 ease-in-out',
              Glowing(APPS.TRAINING).inputBox
            )}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon size={14} />
            </div>
            <Input
              placeholder="Search Course"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-white placeholder:text-gray-400 placeholder:text-sm border-none h-[36px] text-sm pl-9 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 px-4 md:px-6 py-4 bg-[#F3F4F6]">
        <PageInfoBanner
          title="Free Courses List"
          subtitle="List of free courses available on the platform."
        />

        {/* Add button - full width on mobile */}
        <div className="mt-4 md:hidden">
          <CustomButton
            title="Add Free Course"
            url="/courses/add"
            leadingIcon={<Plus size={16} />}
            app={APPS.TRAINING}
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
              onClick={handleBulkArchive}
              disabled={selectedCount === 0}
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium transition-colors',
                selectedCount > 0
                  ? 'text-[#4B5563] hover:text-[var(--training-primary)] cursor-pointer'
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
              title="Add Free Course"
              url="/courses/add"
              leadingIcon={<Plus size={16} />}
              app={APPS.TRAINING}
              buttonClass="h-[36px] text-sm rounded-md"
              width="px-4 py-2"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block" style={{ '--table-background-secondary': '#F7F7F5' } as React.CSSProperties}>
          <CustomTable
            table={table}
            isLoading={isLoading}
            noResultsMessage="No free courses found."
            skeletonRows={pagination.pageSize}
            containerClassName="border border-[var(--table-border)] rounded-md overflow-auto"
            headerRowClassName="bg-[#EAECEF] border-b border-gray-300"
            headerCellClassName="text-sm font-semibold text-[#374151] bg-[#EAECEF] border-r border-gray-300 last:border-r-0 px-4 py-2.5 [&:has([role=checkbox])]:!px-0 [&>[role=checkbox]]:!translate-y-0"
            bodyRowClassName="text-sm group transition-colors hover:bg-[#FFF8EB] hover:[&_td]:text-[var(--training-primary)] hover:shadow-[inset_3px_0_0_var(--training-primary)]"
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
                  { icon: <Eye size={16} />, onClick: () => router.push(`/courses/${course.id}`), label: 'View' },
                  { icon: <Pencil size={16} />, onClick: () => router.push('/courses/add'), label: 'Edit' },
                  { icon: <Copy size={16} />, onClick: () => dispatch({ type: ActionType.OPEN_DUPLICATE_DIALOG, payload: course }), label: 'Duplicate' },
                  { icon: <Plus size={16} />, onClick: () => { setAssignCourseName(course.name); setAssignDialogOpen(true); }, label: 'Add to Company' },
                  { icon: <List size={16} />, onClick: () => { setAssignCourseName(course.name); setJobRolesDialogOpen(true); }, label: 'Show Job Roles' },
                  { icon: <Archive size={16} />, onClick: () => handlers.handleOpenArchiveDialog(course), label: 'Archive' },
                ]}
                fields={[
                  { label: 'Course Name', value: course.name },
                  { label: 'Company', value: course.assignedCompanies ? (
                    <span>
                      {course.assignedCompanies.length > 40
                        ? course.assignedCompanies.slice(0, 40) + '...'
                        : course.assignedCompanies}
                      {course.assignedCompanies.length > 40 && (
                        <button className="text-[var(--training-primary)] ml-1 text-sm">see more</button>
                      )}
                    </span>
                  ) : '—' },
                  { label: 'Total Units', value: course.totalUnits },
                ]}
              />
            );
          })}
        </div>

        {table.getPageCount() > 1 && (
          <TablePagination table={table} app={APPS.TRAINING} />
        )}
      </div>

      {/* Dialogs */}
      <CustomDeleteDialog
        isOpen={duplicateDialogOpen}
        setIsOpen={closeAllDialogs}
        onDelete={handleDuplicateCourse}
        title="Duplicate Course"
        message="Are you sure you want to duplicate this course?"
        description="This will create an exact copy of the course."
        isLoading={isProcessing}
        onDeleteTitle="Confirm"
        cancelButtonText="Cancel"
        app={APPS.TRAINING}
        confirmButtonVariant="default"
        icon={<InfoIcon className="text-[var(--training-primary)] h-5 w-5" />}
      />
      <CustomDeleteDialog
        isOpen={archiveDialogOpen}
        setIsOpen={closeAllDialogs}
        onDelete={handleArchiveCourse}
        title="Archive Course?"
        message={`Are you sure you want to archive "${selectedCourse?.name}"?`}
        description="This course will be moved to the archive."
        isLoading={isProcessing}
        onDeleteTitle="Archive"
        app={APPS.TRAINING}
        confirmButtonVariant="default"
      />
      <CustomDeleteDialog
        isOpen={bulkArchiveDialogOpen}
        setIsOpen={closeAllDialogs}
        onDelete={onBulkArchiveConfirm}
        title="Archive Selected Courses?"
        message={`Are you sure you want to archive ${selectedCount} course(s)?`}
        description="These courses will be moved to the archive."
        isLoading={isProcessing}
        onDeleteTitle="Archive All"
        app={APPS.TRAINING}
        confirmButtonVariant="default"
      />

      <AddToCompanyDialog
        isOpen={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        courseName={assignCourseName}
      />
      <LinkedJobRolesDialog
        isOpen={jobRolesDialogOpen}
        onClose={() => setJobRolesDialogOpen(false)}
        courseName={assignCourseName}
      />
    </>
  );
}
