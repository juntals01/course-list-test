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
import { getAppCssVar, getAppHoverBg } from '@/lib/theme-utils';

const LAST_MODIFIED_OPTIONS = [
  'Today',
  'This Week',
  'This Month',
  'This Year',
  'Custom',
];

type FiltersPopoverProps = {
  onApply?: (filters: FilterValues) => void;
  app?: APPS;
};

export type FilterValues = {
  minTotalUnits: string;
  maxTotalUnits: string;
  lastModified: string;
};

export default function FiltersPopover({ onApply, app = APPS.TRAINING }: FiltersPopoverProps) {
  const [open, setOpen] = useState(false);
  const [minUnits, setMinUnits] = useState('');
  const [maxUnits, setMaxUnits] = useState('');
  const [lastModified, setLastModified] = useState('Today');

  const cssVar = getAppCssVar(app);
  const hoverBg = getAppHoverBg(app);

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
            app={app}
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
              className="text-sm font-medium rounded-md px-4 py-2 transition-colors"
              style={{ color: `var(${cssVar})`, border: `1px solid var(${cssVar})` }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
            >
              Reset All
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-medium border border-gray-200 rounded-md px-6 py-2 hover:bg-gray-50 transition-colors"
                style={{ color: `var(${cssVar})` }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="text-sm font-medium text-white rounded-md px-6 py-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: `var(${cssVar})` }}
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
                app={app}
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
                app={app}
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
