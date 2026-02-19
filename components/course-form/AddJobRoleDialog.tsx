'use client';

import React, { useState } from 'react';
import { XIcon, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import { APPS, type CourseJobRole } from '@/types/courses';

const AVAILABLE_JOB_ROLES: CourseJobRole[] = [
  { id: 101, name: 'Quality Assurance Specialist' },
  { id: 102, name: 'User Experience Designer' },
  { id: 103, name: 'Product Manager' },
  { id: 104, name: 'Data Analyst' },
  { id: 105, name: 'Software Engineer' },
  { id: 106, name: 'Graphic Designer' },
];

type AddJobRoleDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roles: CourseJobRole[]) => void;
  existingRoleIds: number[];
};

export default function AddJobRoleDialog({ isOpen, onClose, onSave, existingRoleIds }: AddJobRoleDialogProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleRole = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    const selected = AVAILABLE_JOB_ROLES.filter((r) => selectedIds.has(r.id));
    onSave(selected);
    setSelectedIds(new Set());
    setDropdownOpen(false);
    onClose();
  };

  const handleCancel = () => {
    setSelectedIds(new Set());
    setDropdownOpen(false);
    onClose();
  };

  const availableRoles = AVAILABLE_JOB_ROLES.filter((r) => !existingRoleIds.includes(r.id));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[480px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-semibold text-[var(--text-primary)]">
            Add to Job Role
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
          <label className="text-sm font-semibold text-[var(--text-primary)] block mb-3">
            Select Job Role/s
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full h-10 px-3 bg-white border border-gray-300 rounded-md flex items-center justify-between text-sm text-gray-500 hover:border-gray-400 transition-colors"
            >
              <span>
                {selectedIds.size > 0
                  ? `${selectedIds.size} role(s) selected`
                  : 'Select Job Role/s'}
              </span>
              <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[240px] overflow-auto">
                {availableRoles.map((role) => {
                  const isSelected = selectedIds.has(role.id);
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => toggleRole(role.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Checkbox
                        checked={isSelected}
                        className="border-gray-300 data-[state=checked]:bg-[var(--training-primary)] data-[state=checked]:border-[var(--training-primary)]"
                        tabIndex={-1}
                      />
                      <span className={`text-sm ${isSelected ? 'text-[var(--training-primary)] font-medium' : 'text-[var(--text-primary)]'}`}>
                        {role.name}
                      </span>
                    </button>
                  );
                })}
                {availableRoles.length === 0 && (
                  <p className="text-sm text-gray-400 p-4 text-center">No more roles available</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 flex items-center gap-4">
          <CustomButton
            title="Cancel"
            variant={BUTTON_VARIANTS.OUTLINE}
            app={APPS.TRAINING}
            width="flex-1"
            onClick={handleCancel}
            buttonClass="h-[41px] text-sm rounded-md"
          />
          <CustomButton
            title="Save"
            app={APPS.TRAINING}
            width="flex-1"
            onClick={handleSave}
            disabled={selectedIds.size === 0}
            buttonClass="h-[41px] text-sm rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
