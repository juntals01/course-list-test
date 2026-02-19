'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Eye, Copy, Plus, List, Archive } from 'lucide-react';
import RowActionMenu from '@/components/custom-ui/custom-table/row-action-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { APPS, type CourseWithDetails } from '@/types/courses';

const TRUNCATE_LENGTH = 45;

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
        style={{
          maxHeight: expanded ? `${height}px` : '1.5em',
        }}
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

type Handlers = {
  handleView?: (course: CourseWithDetails) => void;
  handleEdit: (course: CourseWithDetails) => void;
  handleDuplicate?: (course: CourseWithDetails) => void;
  handleAssign?: (course: CourseWithDetails) => void;
  handleShowJobRoles?: (course: CourseWithDetails) => void;
  handleArchive: (course: CourseWithDetails) => void;
  showPrice?: boolean;
};

export const getCourseListColumns = ({
  handleView,
  handleEdit,
  handleDuplicate,
  handleAssign,
  handleShowJobRoles,
  handleArchive,
  showPrice = false,
}: Handlers): ColumnDef<CourseWithDetails>[] => {
  const columns: ColumnDef<CourseWithDetails>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center w-full">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
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
      size: 50,
      meta: { width: '50px', headerClassName: '!pl-0 !pr-0', cellClassName: '!pl-0 !pr-0' },
    },
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
      meta: { width: '70px' },
      cell: ({ row }) => (
        <span className="text-[#4B5563]">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Course Name',
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
        if (!names || names === 'None') {
          return <span className="text-gray-400 italic text-sm">None</span>;
        }
        return <CompanyCell companies={names} />;
      },
    },
    {
      accessorKey: 'totalUnits',
      header: 'Total Units',
      enableSorting: true,
      meta: { width: '100px' },
      cell: ({ row }) => (
        <span className="text-[#4B5563]">{row.original.totalUnits}</span>
      ),
    },
  ];

  if (showPrice) {
    const totalUnitsIdx = columns.findIndex((c) => 'accessorKey' in c && c.accessorKey === 'totalUnits');
    columns.splice(totalUnitsIdx, 0, {
      accessorKey: 'price',
      header: 'Annual Price',
      enableSorting: true,
      meta: { width: '120px' },
      cell: ({ row }) => {
        const price = row.original.price;
        return (
          <span className="text-[#4B5563]">
            {price !== null ? `$${price}` : '—'}
          </span>
        );
      },
    });
  }

  columns.push({
    id: 'actions',
    header: () => <div className="text-center">Actions</div>,
    meta: { width: '80px' },
    cell: ({ row }) => {
      const menuItems = [];

      menuItems.push({
        label: 'View Course',
        icon: <Eye size={16} />,
        onClick: () => (handleView ?? handleEdit)(row.original),
      });

      menuItems.push({
        label: 'Edit Course',
        icon: <Pencil size={16} />,
        onClick: () => handleEdit(row.original),
      });

      if (handleDuplicate) {
        menuItems.push({
          label: 'Duplicate Course',
          icon: <Copy size={16} />,
          onClick: () => handleDuplicate(row.original),
        });
      }

      if (!showPrice && handleAssign) {
        menuItems.push({
          label: 'Add to Company or Job Role',
          icon: <Plus size={16} />,
          onClick: () => handleAssign(row.original),
        });
      }

      if (showPrice && handleAssign) {
        menuItems.push({
          label: 'Add to Company',
          icon: <Plus size={16} />,
          onClick: () => handleAssign(row.original),
        });
      }

      if (!showPrice && handleShowJobRoles) {
        menuItems.push({
          label: 'Show Job Roles',
          icon: <List size={16} />,
          onClick: () => handleShowJobRoles(row.original),
        });
      }

      menuItems.push({
        label: 'Archive Course',
        icon: <Archive size={16} />,
        onClick: () => handleArchive(row.original),
      });

      return (
        <div className="flex justify-center">
          <RowActionMenu
            app={APPS.TRAINING}
            menuItems={menuItems}
          />
        </div>
      );
    },
  });

  return columns;
};
