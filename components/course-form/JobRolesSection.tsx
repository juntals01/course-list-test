'use client';

import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table';
import { Plus, Trash2 } from 'lucide-react';

import CustomAccordion from '@/components/custom-ui/custom-accordion';
import CustomButton from '@/components/custom-ui/custom-button';
import { CustomTable } from '@/components/custom-ui/custom-table/custom-table';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { APPS, type CourseJobRole } from '@/types/courses';
import AddJobRoleDialog from './AddJobRoleDialog';

const INITIAL_JOB_ROLES: CourseJobRole[] = [
  { id: 1, name: 'Warehouse Manager' },
  { id: 2, name: 'Logistics Coordinator' },
  { id: 3, name: 'Shipping Clerk' },
  { id: 4, name: 'Inventory Specialist' },
  { id: 5, name: 'Supply Chain Analyst' },
];

function getJobRoleColumns(onRemove: (id: number) => void): ColumnDef<CourseJobRole>[] {
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
      accessorKey: 'name',
      header: 'Job Role',
      enableSorting: true,
      cell: ({ row }) => <span className="text-[#374151]">{row.original.name}</span>,
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
              { label: 'Remove', icon: <Trash2 size={16} />, onClick: () => onRemove(row.original.id) },
            ]}
          />
        </div>
      ),
    },
  ];
}

export default function JobRolesSection() {
  const [roles, setRoles] = useState<CourseJobRole[]>(INITIAL_JOB_ROLES);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedCount = Object.keys(rowSelection).length;

  const handleRemove = (id: number) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRemoveSelected = () => {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    setRoles((prev) => prev.filter((_, i) => !selectedIndices.includes(i)));
    setRowSelection({});
  };

  const handleAddRoles = (newRoles: CourseJobRole[]) => {
    setRoles((prev) => [...prev, ...newRoles]);
  };

  const columns = useMemo(() => getJobRoleColumns(handleRemove), []);

  const table = useReactTable({
    data: roles,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  return (
    <>
      <CustomAccordion
        title="Job Roles"
        description="List of Job Roles this course belongs to"
        defaultExpanded={true}
      >
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Job Roles List</span>
              <button
                onClick={handleRemoveSelected}
                disabled={selectedCount === 0}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  selectedCount > 0
                    ? 'text-[#4B5563] hover:text-red-500 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <Trash2 size={15} />
                Remove from Job Role
              </button>
            </div>
            <CustomButton
              title="Add Job Role"
              leadingIcon={<Plus size={16} />}
              app={APPS.TRAINING}
              buttonClass="h-[36px] text-sm rounded-md w-full md:w-auto"
              width="w-full md:w-auto px-4 py-2"
              onClick={() => setDialogOpen(true)}
            />
          </div>

          <div style={{ '--table-background-secondary': '#F7F7F5' } as React.CSSProperties}>
            <CustomTable
              table={table}
              isLoading={false}
              noResultsMessage="No job roles assigned."
              containerClassName="border border-[var(--table-border)] rounded-md overflow-auto"
              headerRowClassName="bg-[#EAECEF] border-b border-gray-300"
              headerCellClassName="text-sm font-semibold text-[#374151] bg-[#EAECEF] border-r border-gray-300 last:border-r-0 px-4 py-2.5 [&:has([role=checkbox])]:!px-0 [&>[role=checkbox]]:!translate-y-0"
              bodyRowClassName="text-sm group transition-colors hover:bg-[#FFF8EB] hover:[&_td]:text-[var(--training-primary)] hover:shadow-[inset_3px_0_0_var(--training-primary)]"
              bodyCellClassName="px-4 py-3 text-sm text-[#4B5563] border-r border-gray-200 last:border-r-0 border-b border-gray-100 [&:has([role=checkbox])]:!px-0 [&>[role=checkbox]]:!translate-y-0"
              tableMinWidth="500px"
              tableHeaderHeight="h-[44px]"
              tableRowHeight="h-[52px]"
            />
          </div>
        </div>
      </CustomAccordion>

      <AddJobRoleDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleAddRoles}
        existingRoleIds={roles.map((r) => r.id)}
      />
    </>
  );
}
