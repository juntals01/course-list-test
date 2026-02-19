'use client';

import React from 'react';
import { Upload, InfoIcon } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

import CustomInput from '@/components/custom-ui/custom-input';
import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { APPS, type UnitType } from '@/types/courses';

type FormRow = {
  label: string;
  optional?: boolean;
  tooltip?: string;
  children: React.ReactNode;
};

function FormRow({ label, optional, tooltip, children }: FormRow) {
  return (
    <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
      <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1.5">
        {label}
        {optional && <span className="text-gray-400 text-xs font-normal">(optional)</span>}
        {tooltip && (
          <span className="text-[var(--training-primary)] cursor-help" title={tooltip}>
            <InfoIcon size={14} />
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function FileUploadRow({ label, optional, message }: { label: string; optional?: boolean; message: string }) {
  return (
    <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
      <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1.5">
        {label}
        {optional && <span className="text-gray-400 text-xs font-normal">(optional)</span>}
        <span className="text-[var(--training-primary)] cursor-help">
          <InfoIcon size={14} />
        </span>
      </label>
      <div className="flex items-center gap-3">
        <CustomButton
          title="Upload File"
          app={APPS.TRAINING}
          variant={BUTTON_VARIANTS.OUTLINE}
          leadingIcon={<Upload size={14} />}
          buttonClass="h-[36px] text-sm rounded-md bg-white"
          width="px-4 py-2"
        />
        <span className="text-sm text-gray-400">{message}</span>
      </div>
    </div>
  );
}

const ARTICLE_OPTIONS = [
  'Safety Manual 2024',
  'Employee Handbook',
  'Code of Conduct',
  'Data Privacy Policy',
  'Emergency Procedures',
];

type UnitFieldsProps = {
  unitType: UnitType;
  unitIndex: number;
  unitId: number;
  nameValue: string;
  onNameChange: (val: string) => void;
  descriptionValue: string;
  onDescriptionChange: (val: string) => void;
  hasLicenseExpiry?: boolean;
  onLicenseExpiryChange?: (val: boolean) => void;
  selectedArticle?: string;
  onArticleChange?: (val: string) => void;
  nameError?: string;
};

export default function UnitFields({
  unitType,
  unitIndex,
  unitId,
  nameValue,
  onNameChange,
  descriptionValue,
  onDescriptionChange,
  hasLicenseExpiry,
  onLicenseExpiryChange,
  selectedArticle,
  onArticleChange,
  nameError,
}: UnitFieldsProps) {
  return (
    <div className="space-y-5">
      <FormRow label="Unit Name" tooltip="Name of the unit">
        <div>
          <CustomInput
            name={`unitName-${unitId}`}
            placeholder={`Unit ${unitIndex} - Name`}
            value={nameValue}
            onValueChange={onNameChange}
            app={APPS.TRAINING}
            validationError={nameError}
          />
        </div>
      </FormRow>

      {unitType !== 'Read and Acknowledge' && (
        <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-start md:gap-4">
          <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1.5 md:pt-2">
            Description
            <span className="text-[var(--training-primary)] cursor-help" title="Description of the unit content">
              <InfoIcon size={14} />
            </span>
          </label>
          <CustomInput
            name={`unitDesc-${unitId}`}
            placeholder="Enter Description"
            value={descriptionValue}
            onValueChange={onDescriptionChange}
            multiline
            rows={3}
            app={APPS.TRAINING}
          />
        </div>
      )}

      {unitType === 'License' && (
        <FormRow label="Does License Have Expiry?" tooltip="Whether this license expires">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={hasLicenseExpiry === true}
                onCheckedChange={() => onLicenseExpiryChange?.(true)}
                className="border-gray-300 data-[state=checked]:bg-[var(--training-primary)] data-[state=checked]:border-[var(--training-primary)]"
              />
              <span className="text-sm text-[var(--text-primary)]">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={hasLicenseExpiry === false}
                onCheckedChange={() => onLicenseExpiryChange?.(false)}
                className="border-gray-300 data-[state=checked]:bg-[var(--training-primary)] data-[state=checked]:border-[var(--training-primary)]"
              />
              <span className="text-sm text-[var(--text-primary)]">No</span>
            </label>
          </div>
        </FormRow>
      )}

      {unitType === 'Read and Acknowledge' && (
        <FormRow label="Select Article" tooltip="Article for learners to read">
          <Select value={selectedArticle} onValueChange={(val) => onArticleChange?.(val)}>
            <SelectTrigger className="h-10 bg-white border-gray-300 text-sm">
              <SelectValue placeholder="Select Article" />
            </SelectTrigger>
            <SelectContent>
              {ARTICLE_OPTIONS.map((article) => (
                <SelectItem key={article} value={article}>
                  {article}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormRow>
      )}

      {unitType === 'Scorm Package' && (
        <FileUploadRow label="Upload SCORM Package" message="No SCORM uploaded yet" />
      )}

      {(unitType === 'Assignment' || unitType === 'License' || unitType === 'Face to Face') && (
        <FileUploadRow label="Additional Files" optional message="No file uploaded yet" />
      )}
    </div>
  );
}
