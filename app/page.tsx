// app/page.tsx
'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Plus, SearchIcon, Archive, InfoIcon } from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import CustomDeleteDialog from '@/components/custom-ui/custom-delete-dialog';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import { TablePagination } from '@/components/custom-ui/custom-table/table-pagination';
import PageInfoBanner from '@/components/PageInfoBanner';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { APPS } from '@/types/courses';

// Assuming you migrate columns to a local component folder
import { getCourseListColumns } from '@/components/course-list/course-list-columns';
import { useCoursesTable, ActionType } from '@/hooks/useCoursesTable';

export default function CoursesPage() {
  // We pass an empty array initially; the hook will fetch mock data on mount
  const {
    state,
    dispatch,
    handleDeleteCourse,
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
    handlers
  } = useCoursesTable([]); 

  const {
    courses,
    isLoading,
    sorting,
    pagination,
    rowSelection,
    globalFilter,
    columnFilters,
    deleteDialogOpen,
    duplicateDialogOpen,
    archiveDialogOpen,
    bulkArchiveDialogOpen,
    selectedCourse,
    isProcessing,
  } = state;

  const columns = useMemo(
    () =>
      getCourseListColumns({
        handleEdit: (course) => {
           console.log('Edit course clicked:', course.id);
        },
        handleDelete: (course) => {
          dispatch({ type: ActionType.OPEN_DELETE_DIALOG, payload: course });
        },
        handleDuplicate: (course) => {
          dispatch({ type: ActionType.OPEN_DUPLICATE_DIALOG, payload: course });
        },
        handleArchive: handlers.handleOpenArchiveDialog,
        // We aren't testing assignment logic in this assessment, so these are no-ops or removed
        handleAssign: undefined,
        handleShowJobRoles: undefined,
        showPrice: false, // Default to free view
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

  return (
    <>
      <div className="p-4 md:p-6">
        <PageInfoBanner
          title="Free Courses List"
          subtitle="List of free courses available on the platform."
        />

        {/* Top Controls: Search & Add */}
        <div className="flex justify-between items-center mb-6 mt-6">
          <div
            className={cn(
              'relative flex-1 rounded-md border border-[var(--table-border)] transition-all duration-200 ease-in-out max-w-sm',
              Glowing(APPS.TRAINING).inputBox
            )}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--input-placeholder)]">
              <SearchIcon size={14} />
            </div>
            <Input
              placeholder="Search Courses"
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="bg-[var(--content-background)] placeholder:text-gray-400 placeholder:text-sm border-none h-9 text-sm pl-8 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <CustomButton
            title="Add Free Course"
            onClick={() => console.log('Add Course Clicked')}
            leadingIcon={<Plus size={18} />}
            app={APPS.TRAINING}
          />
        </div>

        {/* Middle Controls: Results Count & Bulk Actions */}
        <div className="flex flex-col md:flex-row justify-start items-center gap-4 bg-gray-50 p-2 rounded-md border border-gray-100 mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(val) => table.setPageSize(Number(val))}
              >
                <SelectTrigger className="h-8 w-[70px] bg-white">
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
              <span>of {table.getFilteredRowModel().rows.length} results</span>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-2" />

            <button
              onClick={handleBulkArchive}
              disabled={selectedCount === 0}
              className={cn(
                "flex items-center gap-2 transition-colors font-medium text-sm",
                selectedCount > 0
                  ? "text-gray-600 hover:text-[#CF9800] cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              )}
            >
              <Archive size={16} />
              <span>Archive</span>
            </button>
          </div>
        </div>

        <CustomTable
          table={table}
          isLoading={isLoading}
          noResultsMessage="No free courses found."
          skeletonRows={pagination.pageSize}
          headerRowClassName="bg-[#EAECEF] border-b border-gray-200"
          headerCellClassName="text-gray-700 font-semibold text-sm px-4 py-3 h-12"
          bodyRowClassName="hover:bg-gray-50 transition-colors"
          bodyCellClassName="px-4 py-3 text-sm text-gray-600 border-b border-gray-100"
        />

        {table.getPageCount() > 1 && (
          <TablePagination table={table} app={APPS.TRAINING} />
        )}
      </div>

      {/* Dialogs */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DELETE_DIALOG })}
        onDelete={handleDeleteCourse}
        title="Delete Course"
        message={`Are you sure you want to delete "${selectedCourse?.name}"?`}
        description="This action cannot be undone."
        isLoading={isProcessing}
        onDeleteTitle="Delete"
        app={APPS.TRAINING}
        confirmButtonVariant="destructive"
      />

      <CustomDeleteDialog
        isOpen={duplicateDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DIALOGS })}
        onDelete={handleDuplicateCourse}
        title="Duplicate Course"
        message="Are you sure you want to duplicate this course?"
        description="This will create an exact copy of the course."
        isLoading={isProcessing}
        onDeleteTitle="Confirm"
        cancelButtonText="Cancel"
        app={APPS.TRAINING}
        confirmButtonVariant="default"
        icon={<InfoIcon className="text-[#FFA600] h-5 w-5" />}
      />

      <CustomDeleteDialog
        isOpen={archiveDialogOpen}
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DIALOGS })}
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
        setIsOpen={() => dispatch({ type: ActionType.CLOSE_DIALOGS })}
        onDelete={onBulkArchiveConfirm}
        title="Archive Selected Courses?"
        message={`Are you sure you want to archive ${selectedCount} course(s)?`}
        description="These courses will be moved to the archive."
        isLoading={isProcessing}
        onDeleteTitle="Archive All"
        app={APPS.TRAINING}
        confirmButtonVariant="default"
      />
    </>
  );
}
