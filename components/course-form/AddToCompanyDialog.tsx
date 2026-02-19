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
import { Separator } from '@/components/ui/separator';
import { APPS } from '@/types/courses';

const AVAILABLE_COMPANIES = [
  'Innovative Solutions Inc.',
  'NextGen Technologies LLC',
  'Synergy Systems Co.',
  'Quantum Leap Innovations',
  'Apex Digital Services',
  'Visionary Tech Partners',
  'BrightPath Consulting',
  'CoreLogic Enterprises',
];

type AddToCompanyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  courseName?: string;
};

export default function AddToCompanyDialog({ isOpen, onClose, courseName }: AddToCompanyDialogProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [addToMasterJobRole, setAddToMasterJobRole] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleCompany = (name: string) => {
    setSelectedCompanies((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleConfirm = () => {
    console.log('Add to companies:', Array.from(selectedCompanies), 'Master Job Role:', addToMasterJobRole);
    handleCancel();
  };

  const handleCancel = () => {
    setSelectedCompanies(new Set());
    setAddToMasterJobRole(false);
    setDropdownOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[520px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-semibold text-[var(--text-primary)]">
            Add to Company
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

        <Separator />

        <div className="px-6 py-5">
          <label className="text-sm font-semibold text-[var(--text-primary)] block mb-3">
            Select Company
          </label>

          <div className="relative mb-5">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full h-10 px-3 bg-white border border-gray-300 rounded-md flex items-center justify-between text-sm text-gray-500 hover:border-gray-400 transition-colors"
            >
              <span>
                {selectedCompanies.size > 0
                  ? `${selectedCompanies.size} selected`
                  : 'Select Company'}
              </span>
              <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[240px] overflow-auto">
                {AVAILABLE_COMPANIES.map((company) => {
                  const isSelected = selectedCompanies.has(company);
                  return (
                    <div
                      key={company}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => toggleCompany(company)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      <Checkbox
                        checked={isSelected}
                        className="border-gray-300 data-[state=checked]:bg-[var(--training-primary)] data-[state=checked]:border-[var(--training-primary)]"
                        tabIndex={-1}
                      />
                      <span className="text-sm text-[var(--text-primary)]">{company}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[var(--text-primary)]">Add to Master Job Role?</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={addToMasterJobRole}
                onCheckedChange={(val) => setAddToMasterJobRole(!!val)}
                className="border-gray-300 data-[state=checked]:bg-[var(--training-primary)] data-[state=checked]:border-[var(--training-primary)]"
              />
              <span className="text-sm text-[var(--text-primary)]">Check for Yes</span>
            </label>
          </div>
        </div>

        <Separator />

        <div className="px-6 py-5 flex items-center gap-4">
          <CustomButton
            title="Cancel"
            variant={BUTTON_VARIANTS.OUTLINE}
            app={APPS.TRAINING}
            width="flex-1"
            onClick={handleCancel}
            buttonClass="h-[41px] text-sm rounded-md"
          />
          <CustomButton
            title="Confirm"
            app={APPS.TRAINING}
            width="flex-1"
            onClick={handleConfirm}
            disabled={selectedCompanies.size === 0}
            buttonClass="h-[41px] text-sm rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
