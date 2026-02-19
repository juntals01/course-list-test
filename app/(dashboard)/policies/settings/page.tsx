'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Info, Copy, ImageIcon, Eye, Upload } from 'lucide-react';

import CustomAccordion from '@/components/custom-ui/custom-accordion';
import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import { APPS } from '@/types/courses';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type BrandColor = {
  label: string;
  value: string;
  swatch: string;
  tooltip: string;
};

const DEFAULT_COLORS: BrandColor[] = [
  { label: 'Primary Color', value: '#172554', swatch: '#172554', tooltip: 'The main brand color used for headings and primary elements' },
  { label: 'Accent Color', value: '#C95208', swatch: '#C95208', tooltip: 'Secondary color used for highlights and call-to-action elements' },
  { label: 'Section Label Font Color', value: '#1E40AF', swatch: '#1E40AF', tooltip: 'Color used for section label text' },
  { label: 'Sections Label Background Color', value: '#BFDBFE', swatch: '#BFDBFE', tooltip: 'Background color behind section labels' },
];

function InfoTooltip({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">
            <Info className="w-4 h-4 text-[var(--policiesAndProcedures-primary)]" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm max-w-[240px]">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ColorRow({
  color,
  onChange,
}: {
  color: BrandColor;
  onChange: (value: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5 w-[220px] shrink-0">
        {color.label}
        <InfoTooltip text={color.tooltip} />
      </label>
      <div className="flex items-center gap-3 flex-1">
        <div
          className="w-9 h-9 rounded-md border border-gray-200 shrink-0"
          style={{ backgroundColor: color.swatch }}
        />
        <div className="relative flex-1 max-w-[180px]">
          <input
            type="text"
            value={color.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[var(--policiesAndProcedures-primary)] focus:shadow-[0_0_8px_#6DA0174D] transition-all"
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopy}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[var(--policiesAndProcedures-primary)] hover:bg-[#F5F9EB] rounded-md transition-colors"
              >
                <Copy size={15} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{copied ? 'Copied!' : 'Copy hex code'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default function PoliciesSettingsPage() {
  const [colors, setColors] = useState<BrandColor[]>(DEFAULT_COLORS);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateColor = (index: number, value: string) => {
    setColors((prev) =>
      prev.map((c, i) =>
        i === index
          ? { ...c, value, swatch: /^#[0-9A-Fa-f]{6}$/.test(value) ? value : c.swatch }
          : c
      )
    );
  };

  const handleImageFile = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageFile(file);
    },
    [handleImageFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  return (
    <div className="flex-1 px-4 md:px-6 py-6 bg-[#F3F4F6]">
      <CustomAccordion
        title="Policies and Procedures Branding"
        defaultExpanded={true}
        footerContent={
          <div className="flex items-center gap-3">
            <CustomButton
              title="Preview"
              type="button"
              app={APPS.POLICIES_AND_PROCEDURES}
              variant={BUTTON_VARIANTS.OUTLINE}
              leadingIcon={<Eye size={14} />}
              buttonClass="h-[36px] text-sm rounded-md bg-white"
              width="px-5 py-2"
            />
            <CustomButton
              title="Save Changes"
              type="button"
              app={APPS.POLICIES_AND_PROCEDURES}
              buttonClass="h-[36px] text-sm rounded-md"
              width="px-5 py-2"
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Branding Colors */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              Branding Colors
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Set the colors that define your brand&apos;s look
            </p>
            <div className="space-y-5">
              {colors.map((color, idx) => (
                <ColorRow
                  key={color.label}
                  color={color}
                  onChange={(val) => updateColor(idx, val)}
                />
              ))}
            </div>
          </div>

          {/* Right: Website Image Preview */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              Website Image Preview
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Upload an image to help you align your website&apos;s color scheme and visual identity
            </p>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleUploadClick}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors min-h-[220px]',
                isDragOver
                  ? 'border-[var(--policiesAndProcedures-primary)] bg-[#F5F9EB]'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-h-[180px] max-w-full object-contain rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 py-6">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <ImageIcon size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    No image uploaded yet. Click or drag a file here to upload.
                  </p>
                  <CustomButton
                    title="Upload Image"
                    type="button"
                    app={APPS.POLICIES_AND_PROCEDURES}
                    variant={BUTTON_VARIANTS.OUTLINE}
                    buttonClass="h-[36px] text-sm rounded-md bg-white"
                    width="px-5 py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadClick();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CustomAccordion>
    </div>
  );
}
