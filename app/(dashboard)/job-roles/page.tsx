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
  Eye,
  Pencil,
  Plus,
  Ban,
  Archive as ArchiveIcon,
  ArrowUpDown,
  SearchIcon,
  Archive,
} from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import { MobileDataCard, MobileSelectAllRow } from '@/components/custom-ui/mobile-data-card';
import { Switch } from '@/components/ui/switch';
import FiltersPopover from '@/components/course-form/FiltersPopover';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
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
import { APPS, type JobRole } from '@/types/courses';
import { MOCK_JOB_ROLES } from '@/lib/mock-job-roles';
import { getActiveJobRoleColumns } from '@/components/job-role-list/job-role-columns';

export default function ActiveJobRolesPage() {
  const router = useRouter();
  const [data, setData] = useState<JobRole[]>(MOCK_JOB_ROLES);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const handleToggleStatus = (role: JobRole) => {
    setData((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, status: !r.status } : r))
    );
  };

  const columns = useMemo(
    () =>
      getActiveJobRoleColumns({
        handleEdit: (role) => router.push(`/job-roles/${role.id}/edit`),
        handleAddToCompany: (role) => console.log('Add to company:', role.id),
        handleSuspend: (role) => {
          setData((prev) =>
            prev.map((r) => (r.id === role.id ? { ...r, status: false } : r))
          );
        },
        handleArchive: (role) => {
          setData((prev) => prev.filter((r) => r.id !== role.id));
        },
        handleToggleStatus,
      }),
    []
  );

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
              placeholder="Search Job Role"
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
          title="Master Job Roles"
          subtitle="List of active job roles made up of curated courses for structured learning."
        />

        <div className="mt-4 md:hidden">
          <CustomButton
            title="Add Job Role"
            url="/job-roles/add"
            leadingIcon={<Plus size={16} />}
            app={APPS.TRAINING}
            buttonClass="h-[36px] text-sm rounded-md w-full"
            width="w-full"
          />
        </div>

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
                  ? 'text-[#4B5563] hover:text-[var(--training-primary)] cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed'
              )}
            >
              <Archive size={15} />
              <span>Archive</span>
            </button>
          </div>

          <div className="hidden md:block">
            <CustomButton
              title="Add Job Role"
              url="/job-roles/add"
              leadingIcon={<Plus size={16} />}
              app={APPS.TRAINING}
              buttonClass="h-[36px] text-sm rounded-md"
              width="px-4 py-2"
            />
          </div>
        </div>

        <div className="hidden md:block" style={{ '--table-background-secondary': '#F7F7F5' } as React.CSSProperties}>
          <CustomTable
            table={table}
            isLoading={false}
            noResultsMessage="No job roles found."
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

        <div className="md:hidden space-y-3">
          {table.getRowModel().rows.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#4B5563]">
              No job roles found.
            </div>
          ) : (
            <>
              <MobileSelectAllRow
                checked={
                  table.getIsAllPageRowsSelected()
                    ? true
                    : table.getIsSomePageRowsSelected()
                      ? 'indeterminate'
                      : false
                }
                onCheckedChange={(val) => table.toggleAllPageRowsSelected(val)}
                sortIcon={<ArrowUpDown size={16} />}
              />
              {table.getRowModel().rows.map((row, index) => {
            const role = row.original;
                return (
                  <MobileDataCard
                    key={role.id}
                    selected={row.getIsSelected()}
                    onSelect={(val) => row.toggleSelected(val)}
                    headerContent={
                      <span className="text-sm font-medium text-[#374151]">{role.name}</span>
                    }
                    headerRight={
                      <Switch
                        checked={role.status}
                        onCheckedChange={() => handleToggleStatus(role)}
                      />
                    }
                    actionsPosition="below"
                    actions={[
                      { icon: <Pencil size={16} />, onClick: () => router.push(`/job-roles/${role.id}/edit`), label: 'Edit' },
                      { icon: <Plus size={16} />, onClick: () => console.log('Add to company:', role.id), label: 'Add to Company' },
                      { icon: <Ban size={16} />, onClick: () => setData((prev) => prev.map((r) => (r.id === role.id ? { ...r, status: false } : r))), label: 'Suspend' },
                      { icon: <ArchiveIcon size={16} />, onClick: () => setData((prev) => prev.filter((r) => r.id !== role.id)), label: 'Archive' },
                    ]}
                    fields={[{
                      label: 'Company',
                      value: role.assignedCompanies ? (
                        <span>
                          {role.assignedCompanies.length > 35
                            ? role.assignedCompanies.slice(0, 35) + ', ...'
                            : role.assignedCompanies}
                          {role.assignedCompanies.length > 35 && (
                            <button className="block text-[var(--training-primary)] text-sm">see more</button>
                          )}
                        </span>
                      ) : '—'
                    }]}
                  />
                );
              })}
            </>
          )}
        </div>

        {table.getPageCount() > 1 && (
          <TablePagination table={table} app={APPS.TRAINING} />
        )}
      </div>
    </>
  );
}
