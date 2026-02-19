'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Info, Upload, LinkIcon } from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import CustomAccordion from '@/components/custom-ui/custom-accordion';
import CustomInput from '@/components/custom-ui/custom-input';
import { APPS } from '@/types/courses';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const articleFormSchema = z.object({
  articleType: z.string().min(1, 'Article type is required'),
  site: z.string().optional(),
  articleName: z.string().min(1, 'Article name is required'),
  mainCategory: z.string().min(1, 'Main category is required'),
  sections: z
    .array(
      z.object({
        id: z.number(),
        title: z.string().min(1, 'Section title is required'),
        description: z.string().optional(),
      })
    )
    .min(1, 'At least one section is required'),
}).refine(
  (data) => data.articleType !== 'Site' || (data.site && data.site.length > 0),
  { message: 'Site selection is required for Site articles', path: ['site'] }
);

type ArticleFormData = z.input<typeof articleFormSchema>;

type SectionItem = {
  id: number;
  title: string;
  description: string;
  expanded: boolean;
};

const ARTICLE_TYPES = ['Master', 'Company', 'Site'] as const;
const CATEGORIES = [
  'WHS Policy',
  'Data Protection Policy',
  'Code of Conduct',
  'Remote Work Guidelines',
  'Harassment Prevention Policy',
  'Diversity and Inclusion Policy',
  'Health and Safety Procedures',
] as const;

const SITES = [
  'Sydney Office - 123 George Street, Sydney NSW 2000',
  'Melbourne Hub - 456 Collins Street, Melbourne VIC 3000',
  'Brisbane Branch - 789 Queen Street, Brisbane QLD 4000',
  'Perth Office - 321 St Georges Terrace, Perth WA 6000',
  'Adelaide Site - 654 King William Street, Adelaide SA 5000',
  'Hobart Office - 12 Macquarie Street, Hobart TAS 7000',
  'Darwin Branch - 88 Mitchell Street, Darwin NT 0800',
] as const;

let nextSectionId = 3;

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
          <p className="text-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id as string;

  const [sections, setSections] = useState<SectionItem[]>([
    { id: 1, title: 'Introduction', description: 'Overview of the article content.', expanded: true },
    { id: 2, title: 'Key Requirements', description: 'Essential compliance requirements.', expanded: false },
  ]);
  const [upperFile, setUpperFile] = useState<string | null>(null);
  const [lowerFile, setLowerFile] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      articleType: 'Company',
      site: '',
      articleName: 'WHS Policy',
      mainCategory: 'WHS Policy',
      sections: [
        { id: 1, title: 'Introduction', description: 'Overview of the article content.' },
        { id: 2, title: 'Key Requirements', description: 'Essential compliance requirements.' },
      ],
    },
  });

  const articleType = watch('articleType');
  const site = watch('site');
  const articleName = watch('articleName');
  const mainCategory = watch('mainCategory');

  const syncSectionsToForm = (updated: SectionItem[]) => {
    setSections(updated);
    setValue(
      'sections',
      updated.map(({ id, title, description }) => ({ id, title, description })),
      { shouldValidate: true }
    );
  };

  const addSection = () => {
    const newSection: SectionItem = {
      id: nextSectionId++,
      title: '',
      description: '',
      expanded: true,
    };
    syncSectionsToForm([...sections, newSection]);
  };

  const removeSection = (id: number) => {
    syncSectionsToForm(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: number, updates: Partial<SectionItem>) => {
    syncSectionsToForm(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const toggleSection = (id: number) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s)));
  };

  const handleFileUpload = (type: 'upper' | 'lower') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (type === 'upper') setUpperFile(file.name);
        else setLowerFile(file.name);
      }
    };
    input.click();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/policies/articles/${articleId}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const onSubmit = (data: ArticleFormData) => {
    console.log('Article updated:', { id: articleId, ...data });
  };

  const onSaveAndClose = () => {
    handleSubmit((data) => {
      console.log('Article saved & closed:', { id: articleId, ...data });
    })();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-4 md:px-6 py-4 flex flex-col">
      {/* Top row: Back + Copy Article Link */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/policies/articles"
          className="inline-flex items-center gap-1.5 text-[var(--policiesAndProcedures-primary)] text-sm font-medium hover:underline w-fit"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <CustomButton
          title={linkCopied ? 'Copied!' : 'Copy Article Link'}
          type="button"
          app={APPS.POLICIES_AND_PROCEDURES}
          variant={BUTTON_VARIANTS.OUTLINE}
          leadingIcon={<LinkIcon size={14} />}
          buttonClass="h-[36px] text-sm rounded-md bg-white"
          width="px-4 py-2"
          onClick={handleCopyLink}
        />
      </div>

      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Edit Article</h1>
        <p className="text-sm text-gray-500 mt-1">Update content and refine your article in one place</p>
      </div>

      <div className="space-y-6 flex-1">
        {/* Article Details */}
        <CustomAccordion title="Article Details" defaultExpanded={true}>
          <div className="space-y-5">
            {/* Article Type */}
            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                Article Type
                <InfoTooltip text="The type of article determines its visibility scope" />
              </label>
              <Select
                value={articleType}
                onValueChange={(val) => setValue('articleType', val, { shouldValidate: true })}
              >
                <SelectTrigger
                  className={cn(
                    'h-10 bg-white border border-gray-300 text-sm',
                    Glowing(APPS.POLICIES_AND_PROCEDURES).dropdown
                  )}
                >
                  <SelectValue placeholder="Select Article Type" />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="text-sm">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.articleType && (
                <span className="md:col-start-2 text-sm text-red-500">{errors.articleType.message}</span>
              )}
            </div>

            {/* Site/s — only shown when Article Type is "Site" */}
            {articleType === 'Site' && (
              <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                  Site/s
                  <InfoTooltip text="Select the site this article belongs to" />
                </label>
                <Select
                  value={site}
                  onValueChange={(val) => setValue('site', val, { shouldValidate: true })}
                >
                  <SelectTrigger
                    className={cn(
                      'h-10 bg-white border border-gray-300 text-sm',
                      Glowing(APPS.POLICIES_AND_PROCEDURES).dropdown
                    )}
                  >
                    <SelectValue placeholder="Select Site/s" />
                  </SelectTrigger>
                  <SelectContent>
                    {SITES.map((s) => (
                      <SelectItem key={s} value={s} className="text-sm">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.site && (
                  <span className="md:col-start-2 text-sm text-red-500">{errors.site.message}</span>
                )}
              </div>
            )}

            {/* Article Name */}
            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                Article Name
                <InfoTooltip text="The name of the article as it will appear to users" />
              </label>
              <CustomInput
                name="articleName"
                placeholder="Article Name"
                value={articleName}
                onValueChange={(val) => setValue('articleName', val, { shouldValidate: true })}
                app={APPS.POLICIES_AND_PROCEDURES}
                validationError={errors.articleName?.message}
              />
            </div>

            {/* Main Category */}
            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                Main Category
                <InfoTooltip text="Select the primary category for this article" />
              </label>
              <Select
                value={mainCategory}
                onValueChange={(val) => setValue('mainCategory', val, { shouldValidate: true })}
              >
                <SelectTrigger
                  className={cn(
                    'h-10 bg-white border border-gray-300 text-sm',
                    Glowing(APPS.POLICIES_AND_PROCEDURES).dropdown
                  )}
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-sm">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mainCategory && (
                <span className="md:col-start-2 text-sm text-red-500">{errors.mainCategory.message}</span>
              )}
            </div>

            {/* Upload Upper Image/Video */}
            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                Upload Upper Image/Video
                <InfoTooltip text="Upload an image or video to display at the top of the article" />
              </label>
              <div className="flex items-center gap-3">
                <CustomButton
                  title="Upload File"
                  type="button"
                  app={APPS.POLICIES_AND_PROCEDURES}
                  variant={BUTTON_VARIANTS.OUTLINE}
                  leadingIcon={<Upload size={14} />}
                  buttonClass="h-[36px] text-sm rounded-md bg-white"
                  width="px-4 py-2"
                  onClick={() => handleFileUpload('upper')}
                />
                <span className="text-sm text-gray-400 italic">
                  {upperFile || 'No file uploaded yet'}
                </span>
              </div>
            </div>

            {/* Upload Lower Image/Video */}
            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                Upload Lower Image/Video
                <InfoTooltip text="Upload an image or video to display at the bottom of the article" />
              </label>
              <div className="flex items-center gap-3">
                <CustomButton
                  title="Upload File"
                  type="button"
                  app={APPS.POLICIES_AND_PROCEDURES}
                  variant={BUTTON_VARIANTS.OUTLINE}
                  leadingIcon={<Upload size={14} />}
                  buttonClass="h-[36px] text-sm rounded-md bg-white"
                  width="px-4 py-2"
                  onClick={() => handleFileUpload('lower')}
                />
                <span className="text-sm text-gray-400 italic">
                  {lowerFile || 'No file uploaded yet'}
                </span>
              </div>
            </div>
          </div>
        </CustomAccordion>

        {/* Section Details */}
        <CustomAccordion title="Section Details" defaultExpanded={true}>
          <div className="space-y-4">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-white">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {section.title || 'Section Title'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {section.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                <div
                  className={cn(
                    'transition-all duration-300 ease-in-out overflow-hidden',
                    section.expanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
                    <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4 pt-4">
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                        Section Title
                      </label>
                      <CustomInput
                        name={`sections.${idx}.title`}
                        placeholder="Enter section title"
                        value={section.title}
                        onValueChange={(val) => updateSection(section.id, { title: val })}
                        app={APPS.POLICIES_AND_PROCEDURES}
                        validationError={errors.sections?.[idx]?.title?.message}
                      />
                    </div>

                    <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-start md:gap-4">
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                        Article Description
                        <InfoTooltip text="Write the content for this section of the article" />
                      </label>
                      <CustomInput
                        name={`sections.${idx}.description`}
                        placeholder="Enter article description"
                        value={section.description}
                        onValueChange={(val) => updateSection(section.id, { description: val })}
                        multiline
                        rows={4}
                        app={APPS.POLICIES_AND_PROCEDURES}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {errors.sections?.message && (
              <p className="text-sm text-red-500">{errors.sections.message}</p>
            )}

            <button
              type="button"
              onClick={addSection}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:border-[var(--policiesAndProcedures-primary)] hover:text-[var(--policiesAndProcedures-primary)] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add a Section
            </button>
          </div>
        </CustomAccordion>
      </div>

      {/* Footer buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:justify-end gap-3 py-6 border-t border-gray-200 mt-6">
        <CustomButton
          title="Save"
          type="submit"
          app={APPS.POLICIES_AND_PROCEDURES}
          variant={BUTTON_VARIANTS.OUTLINE}
          buttonClass="h-[36px] text-sm rounded-md bg-white"
          width="px-6 py-2"
        />
        <CustomButton
          title="Save and Close"
          type="button"
          onClick={onSaveAndClose}
          app={APPS.POLICIES_AND_PROCEDURES}
          buttonClass="h-[36px] text-sm rounded-md"
          width="px-6 py-2"
        />
      </div>
    </form>
  );
}
