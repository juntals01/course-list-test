'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { APPS } from '@/types/courses';
import { getAppCssVar } from '@/lib/theme-utils';

export type CardAction = {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
};

export type CardField = {
  label: string;
  value: React.ReactNode;
};

type MobileDataCardProps = {
  id?: string | number;
  selected?: boolean;
  onSelect?: (val: boolean) => void;
  actions?: CardAction[];
  actionsPosition?: 'header' | 'below';
  fields: CardField[];
  headerRight?: React.ReactNode;
  headerContent?: React.ReactNode;
  app?: APPS;
};

export function MobileDataCard({
  id,
  selected,
  onSelect,
  actions,
  actionsPosition = 'header',
  fields,
  headerRight,
  headerContent,
  app = APPS.TRAINING,
}: MobileDataCardProps) {
  const actionsInHeader = actionsPosition === 'header';
  const cssVar = getAppCssVar(app);

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
      {/* Card header */}
      <div className={cn('flex items-center justify-between px-4 py-3', (actionsInHeader || !actions?.length) ? 'border-b border-gray-100' : '')}>
        <div className="flex items-center gap-3 min-w-0">
          {onSelect !== undefined && (
            <Checkbox
              checked={selected}
              onCheckedChange={(val) => onSelect(!!val)}
              className={`shrink-0 border-gray-300 data-[state=checked]:bg-[var(${cssVar})] data-[state=checked]:border-[var(${cssVar})]`}
            />
          )}
          {headerContent ? (
            <span className="truncate">{headerContent}</span>
          ) : id !== undefined ? (
            <span className="text-sm font-medium text-[#374151]">{id}</span>
          ) : null}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {headerRight}
          {actionsInHeader && actions?.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[var(${cssVar})] transition-colors rounded-md hover:bg-gray-50`}
              aria-label={action.label}
            >
              {action.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Actions row below header */}
      {!actionsInHeader && actions && actions.length > 0 && (
        <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[var(${cssVar})] transition-colors rounded-md hover:bg-gray-50`}
              aria-label={action.label}
            >
              {action.icon}
            </button>
          ))}
        </div>
      )}

      {/* Card body - stacked fields */}
      {fields.map((field, i) => (
        <div
          key={i}
          className={cn(
            'flex px-4 py-3 text-sm',
            i < fields.length - 1 && 'border-b border-gray-100'
          )}
        >
          <span className="w-[110px] shrink-0 text-gray-500">{field.label}</span>
          <span className="flex-1 text-[#374151]">{field.value}</span>
        </div>
      ))}
    </div>
  );
}

type MobileSelectAllRowProps = {
  checked: boolean | 'indeterminate';
  onCheckedChange: (val: boolean) => void;
  sortIcon?: React.ReactNode;
  app?: APPS;
};

export function MobileSelectAllRow({ checked, onCheckedChange, sortIcon, app = APPS.TRAINING }: MobileSelectAllRowProps) {
  const cssVar = getAppCssVar(app);

  return (
    <div className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md bg-white">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={(val) => onCheckedChange(!!val)}
          className={`border-gray-300 data-[state=checked]:bg-[var(${cssVar})] data-[state=checked]:border-[var(${cssVar})]`}
        />
        <span className="text-sm text-[#374151]">Select All</span>
      </div>
      {sortIcon && (
        <span className="text-gray-400">{sortIcon}</span>
      )}
    </div>
  );
}
