'use client';

import React, { useState } from 'react';
import { XIcon, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const INITIAL_LINKED_ROLES = [
  'Warehouse Supervisor',
  'Logistics Coordinator',
  'Inventory Manager',
  'Shipping Clerk',
  'Quality Control Inspector',
];

type LinkedJobRolesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  courseName?: string;
};

export default function LinkedJobRolesDialog({ isOpen, onClose, courseName }: LinkedJobRolesDialogProps) {
  const [roles, setRoles] = useState(INITIAL_LINKED_ROLES);

  const removeRole = (name: string) => {
    setRoles((prev) => prev.filter((r) => r !== name));
  };

  const handleClose = () => {
    setRoles(INITIAL_LINKED_ROLES);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[420px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-semibold text-[var(--text-primary)]">
            Linked Job Roles
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-1 text-muted-foreground rounded-sm cursor-pointer"
              aria-label="Close"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="px-6 pb-6">
          <p className="text-sm text-gray-500 mb-4">
            List of job roles this course belongs to.
          </p>

          <div className="space-y-2">
            {roles.map((role) => (
              <div
                key={role}
                className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md"
              >
                <span className="text-sm text-[var(--text-primary)]">{role}</span>
                <button
                  onClick={() => removeRole(role)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {roles.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No linked job roles</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
