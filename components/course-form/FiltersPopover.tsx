'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import CustomInput from '@/components/custom-ui/custom-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { APPS } from '@/types/courses';
import { getAppCssVar, getAppHoverBg } from '@/lib/theme-utils';

const LAST_MODIFIED_OPTIONS = [
  'Today',
  'This Week',
  'This Month',
  'This Year',
  'Custom',
];

const MOCK_COMPANIES = [
  { id: '1', name: 'Company A' },
  { id: '2', name: 'Company B' },
  { id: '3', name: 'Company C' },
];

const MOCK_CATEGORIES = [
  { id: '1', name: 'Safety Compliance' },
  { id: '2', name: 'HR' },
  { id: '3', name: 'Finance' },
];

type FiltersPopoverProps = {
  onApply?: (filters: FilterValues | PoliciesFilterValues) => void;
  app?: APPS;
};

export type FilterValues = {
  minTotalUnits: string;
  maxTotalUnits: string;
  lastModified: string;
};

export type PoliciesFilterValues = {
  companyIds: string[];
  categoryIds: string[];
  isCopiedYes: boolean;
  isCopiedNo: boolean;
};

export default function FiltersPopover({ onApply, app = APPS.TRAINING }: FiltersPopoverProps) {
  const [open, setOpen] = useState(false);
  const [minUnits, setMinUnits] = useState('');
  const [maxUnits, setMaxUnits] = useState('');
  const [lastModified, setLastModified] = useState('Today');
  const [companyIds, setCompanyIds] = useState<string[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [isCopiedYes, setIsCopiedYes] = useState(false);
  const [isCopiedNo, setIsCopiedNo] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const isPolicies = app === APPS.POLICIES_AND_PROCEDURES;
  const cssVar = getAppCssVar(app);
  const hoverBg = getAppHoverBg(app);

  const handleReset = () => {
    if (isPolicies) {
      setCompanyIds([]);
      setCategoryIds([]);
      setIsCopiedYes(false);
      setIsCopiedNo(false);
    } else {
      setMinUnits('');
      setMaxUnits('');
      setLastModified('Today');
    }
  };

  const handleApply = () => {
    if (isPolicies) {
      onApply?.({
        companyIds,
        categoryIds,
        isCopiedYes,
        isCopiedNo,
      });
    } else {
      onApply?.({ minTotalUnits: minUnits, maxTotalUnits: maxUnits, lastModified });
    }
    setOpen(false);
  };

  const toggleCompany = (id: string) => {
    setCompanyIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const triggerButtonClass = open
    ? 'h-[41px] min-w-[89px] flex items-center justify-center gap-1 rounded-[6px] border border-[#6DA017] bg-[#6DA017] pt-[10px] pb-[10px] pl-4 pr-5 text-[14px] font-semibold leading-[1.5] text-white hover:opacity-90 transition-colors'
    : 'h-[41px] min-w-[89px] flex items-center justify-center gap-1 rounded-[6px] border border-[#6DA017] bg-white pt-[10px] pb-[10px] pl-4 pr-5 text-[14px] font-semibold leading-[1.5] text-[#6DA017] hover:bg-[#6DA0171A] transition-colors';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={triggerButtonClass}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/filter.png"
            alt=""
            width={14}
            height={14}
            className={`object-contain shrink-0 w-[14px] h-[14px] ${open ? 'brightness-0 invert' : ''}`}
          />
          <span>Filter</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[420px] p-0 shadow-lg" sideOffset={8}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-medium rounded-md px-4 py-2 border border-[#6DA017] bg-white text-[#6DA017] hover:bg-[#f0f6e8] transition-colors"
            >
              Reset All
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-medium border border-[#6DA017] bg-white text-[#6DA017] rounded-md px-6 py-2 hover:bg-[#f0f6e8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="text-sm font-medium text-white bg-[#6DA017] rounded-md px-6 py-2 hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </div>
          </div>

          <Separator className="mb-5" />

          {isPolicies ? (
            <>
              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-sm font-semibold text-[var(--text-primary)] block mb-2">
                    Company
                  </label>
                  <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full h-10 flex items-center justify-between rounded-md border border-[#D1D5DB] bg-white px-3 text-sm text-[#374151] hover:bg-gray-50"
                      >
                        <span>{companyIds.length === 0 ? 'Select' : `${companyIds.length} selected`}</span>
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-2">
                      {MOCK_COMPANIES.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[#f0f6e8]"
                        >
                          <Checkbox
                            checked={companyIds.includes(c.id)}
                            onCheckedChange={() => toggleCompany(c.id)}
                            className="border-[#D1D5DB] data-[state=checked]:bg-[#6DA017] data-[state=checked]:border-[#6DA017]"
                          />
                          <span className="text-sm">{c.name}</span>
                        </label>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--text-primary)] block mb-2">
                    Category
                  </label>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full h-10 flex items-center justify-between rounded-md border border-[#D1D5DB] bg-white px-3 text-sm text-[#374151] hover:bg-gray-50"
                      >
                        <span>{categoryIds.length === 0 ? 'Select' : `${categoryIds.length} selected`}</span>
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-2">
                      {MOCK_CATEGORIES.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[#f0f6e8]"
                        >
                          <Checkbox
                            checked={categoryIds.includes(c.id)}
                            onCheckedChange={() => toggleCategory(c.id)}
                            className="border-[#D1D5DB] data-[state=checked]:bg-[#6DA017] data-[state=checked]:border-[#6DA017]"
                          />
                          <span className="text-sm">{c.name}</span>
                        </label>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[var(--text-primary)] block mb-2">
                    Is Copied
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={isCopiedYes}
                        onCheckedChange={(v) => setIsCopiedYes(!!v)}
                        className="border-[#D1D5DB] data-[state=checked]:bg-[#6DA017] data-[state=checked]:border-[#6DA017]"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={isCopiedNo}
                        onCheckedChange={(v) => setIsCopiedNo(!!v)}
                        className="border-[#D1D5DB] data-[state=checked]:bg-[#6DA017] data-[state=checked]:border-[#6DA017]"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
