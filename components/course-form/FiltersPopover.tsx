'use client';

import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SlidersHorizontal } from 'lucide-react';
import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import CustomInput from '@/components/custom-ui/custom-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { APPS } from '@/types/courses';

const LAST_MODIFIED_OPTIONS = [
  'Today',
  'This Week',
  'This Month',
  'This Year',
  'Custom',
];

type FiltersPopoverProps = {
  onApply?: (filters: FilterValues) => void;
};

export type FilterValues = {
  minTotalUnits: string;
  maxTotalUnits: string;
  lastModified: string;
};

export default function FiltersPopover({ onApply }: FiltersPopoverProps) {
  const [open, setOpen] = useState(false);
  const [minUnits, setMinUnits] = useState('');
  const [maxUnits, setMaxUnits] = useState('');
  const [lastModified, setLastModified] = useState('Today');

  const handleReset = () => {
    setMinUnits('');
    setMaxUnits('');
    setLastModified('Today');
  };

  const handleApply = () => {
    onApply?.({ minTotalUnits: minUnits, maxTotalUnits: maxUnits, lastModified });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <CustomButton
            title="Filters"
            app={APPS.TRAINING}
            variant={BUTTON_VARIANTS.OUTLINE}
            leadingIcon={<SlidersHorizontal size={14} />}
            width="px-4 py-2"
            buttonClass="h-[36px] text-sm rounded-md bg-white"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[420px] p-0 shadow-lg" sideOffset={8}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-medium text-[var(--training-primary)] border border-[var(--training-primary)] rounded-md px-4 py-2 hover:bg-[#FFF7ED] transition-colors"
            >
              Reset All
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-[var(--training-primary)] border border-gray-200 rounded-md px-6 py-2 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="text-sm font-medium text-white bg-[var(--training-primary)] rounded-md px-6 py-2 hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </div>
          </div>

          <Separator className="mb-5" />

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-sm font-semibold text-[var(--text-primary)] block mb-2">
                Minimum Total Units
              </label>
              <CustomInput
                name="minUnits"
                placeholder="Enter Total Units"
                value={minUnits}
                onValueChange={setMinUnits}
                app={APPS.TRAINING}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[var(--text-primary)] block mb-2">
                Max Total Units
              </label>
              <CustomInput
                name="maxUnits"
                placeholder="Enter Total Units"
                value={maxUnits}
                onValueChange={setMaxUnits}
                app={APPS.TRAINING}
              />
            </div>
          </div>

          <Separator className="mb-5" />

          <div>
            <label className="text-sm font-semibold text-[var(--text-primary)] block mb-2">
              Last Modified
            </label>
            <Select value={lastModified} onValueChange={setLastModified}>
              <SelectTrigger className="h-10 bg-white border-gray-300 text-sm w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {LAST_MODIFIED_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
