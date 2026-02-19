'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Ban, Archive, Trash2 } from 'lucide-react';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { APPS, type JobRole } from '@/types/courses';
import { format } from 'date-fns';

const TRUNCATE_LENGTH = 55;

function CompanyCell({ companies }: { companies: string }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const needsTruncation = companies.length > TRUNCATE_LENGTH;

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [expanded]);

  if (!needsTruncation) {
    return <span className="text-sm text-[#4B5563]">{companies}</span>;
  }

  return (
    <div className="text-sm text-[#4B5563]">
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out origin-top"
        style={{ maxHeight: expanded ? `${height}px` : '1.5em' }}
      >
        <span className="break-words">{companies}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((prev) => !prev);
        }}
        className="text-[var(--training-primary)] font-medium hover:underline whitespace-nowrap text-sm mt-0.5"
      >
        {expanded ? 'see less' : 'see more'}
      </button>
    </div>
  );
}

type ActiveHandlers = {
  handleEdit: (role: JobRole) => void;
  handleAddToCompany?: (role: JobRole) => void;
  handleSuspend: (role: JobRole) => void;
  handleArchive: (role: JobRole) => void;
  handleToggleStatus: (role: JobRole) => void;
};

export function getActiveJobRoleColumns(handlers: ActiveHandlers): ColumnDef<JobRole>[] {
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
      enableHiding: false,
      meta: { width: '50px', headerClassName: '!pl-0 !pr-0', cellClassName: '!pl-0 !pr-0' },
    },
    {
      accessorKey: 'name',
      header: 'Job Role Name',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[#374151]">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'assignedCompanies',
      header: 'Company',
      enableSorting: true,
      cell: ({ row }) => {
        const names = row.original.assignedCompanies;
        if (!names) return <span className="text-gray-400 italic text-sm">None</span>;
        return <CompanyCell companies={names} />;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      meta: { width: '100px' },
      cell: ({ row }) => (
        <Switch
          checked={row.original.status}
          onCheckedChange={() => handlers.handleToggleStatus(row.original)}
          className="data-[state=checked]:bg-[var(--training-primary)]"
        />
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      meta: { width: '80px' },
      cell: ({ row }) => {
        const menuItems = [
          { label: 'Edit Job Role', icon: <Pencil size={16} />, onClick: () => handlers.handleEdit(row.original) },
          { label: 'Add to Company', icon: <Plus size={16} />, onClick: () => handlers.handleAddToCompany?.(row.original) },
          { label: 'Suspend Job Role', icon: <Ban size={16} />, onClick: () => handlers.handleSuspend(row.original) },
          { label: 'Archive Job Role', icon: <Archive size={16} />, onClick: () => handlers.handleArchive(row.original) },
        ];
        return (
          <div className="flex justify-center">
            <RowActionMenu app={APPS.TRAINING} menuItems={menuItems} />
          </div>
        );
      },
    },
  ];
}

type ArchivedHandlers = {
  handleRestore: (role: JobRole) => void;
  handleDeletePermanently: (role: JobRole) => void;
};

export function getArchivedJobRoleColumns(handlers: ArchivedHandlers): ColumnDef<JobRole>[] {
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
      enableHiding: false,
      meta: { width: '50px', headerClassName: '!pl-0 !pr-0', cellClassName: '!pl-0 !pr-0' },
    },
    {
      accessorKey: 'name',
      header: 'Job Role Name',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[#374151]">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'archivedAt',
      header: 'Date Archived',
      enableSorting: true,
      cell: ({ row }) => {
        const date = row.original.archivedAt;
        if (!date) return <span className="text-gray-400">—</span>;
        return (
          <span className="text-[#4B5563]">
            {format(new Date(date), 'EEE, yyyy-MM-dd, h:mm a')}
          </span>
        );
      },
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
              { label: 'Restore', icon: <Archive size={16} />, onClick: () => handlers.handleRestore(row.original) },
              { label: 'Delete Permanently', icon: <Trash2 size={16} />, onClick: () => handlers.handleDeletePermanently(row.original) },
            ]}
          />
        </div>
      ),
    },
  ];
}
