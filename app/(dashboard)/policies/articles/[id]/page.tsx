'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { SearchIcon, Download, FileText } from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import { APPS } from '@/types/courses';
import { Glowing } from '@/components/custom-ui/styling/glowing';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'Uncategorized Articles',
  'Policies',
  'Industry Trends',
  'Market Analysis',
  'Product Development',
  'Customer Insights',
  'Financial Strategies',
  'Human Resources',
  'Technology Innovations',
  'Regulatory Compliance',
  'Sustainability Practices',
  'Branding Strategies',
  'Digital Marketing',
  'Sales Techniques',
  'Corporate Social Responsibility',
  'Supply Chain Management',
  'Risk Management',
  'Quality Assurance',
];

const ARTICLE_CONTENT = {
  title: 'Psychological Health Management',
  sections: [
    {
      heading: 'The Importance of Mental Wellness in Modern Life',
      paragraphs: [
        'Mental wellness is an essential component of a balanced life. As the demands of modern living continue to increase—driven by fast-paced careers, social pressures, digital distractions, and global uncertainties—our emotional and psychological health often takes a back seat. However, mental well-being impacts every aspect of life, from productivity and creativity to relationships and physical health.',
        'Without proper care, chronic stress and emotional exhaustion can lead to serious conditions such as anxiety disorders, depression, or even physical ailments like heart disease and weakened immunity. That\'s why more individuals, institutions, and employers are beginning to prioritize mental health as an everyday necessity rather than a reactive measure.',
      ],
    },
    {
      heading: 'Psychological Health Management',
      paragraphs: [
        'Psychological Health Management+ is an evolved, proactive approach to supporting mental wellness. It blends traditional mental healthcare practices with modern innovations, focusing on preventive, responsive, and integrative strategies to foster long-term emotional health.',
      ],
      keyComponents: [
        {
          title: 'Preventive Mental Health Practices',
          description: 'These are habits and routines that build emotional resilience before problems escalate. Examples include:',
          bullets: [
            'Daily mindfulness and meditation routines',
            'Time management and digital detoxing',
            'Gratitude journaling and reflective exercises',
            'Regular physical activity and healthy sleep hygiene',
          ],
        },
        {
          title: 'Personalized Support and Coaching',
          description: 'Through access to licensed therapists, mental health coaches, or AI-powered emotional assistants, individuals can receive tailored guidance based on their needs, schedules, and comfort levels—whether in-person or online.',
          bullets: [],
        },
        {
          title: 'Technology-Driven Self-Care',
          description: 'Digital tools like mental health apps, mood trackers, and guided therapy platforms make mental care more accessible. They help users:',
          bullets: [
            'Monitor emotions and triggers',
            'Set wellness goals',
            'Access CBT (Cognitive Behavioral Therapy) techniques',
            'Join virtual support communities',
          ],
        },
      ],
    },
  ],
};

export default function ViewArticlePage() {
  const params = useParams();
  const [selectedCategory, setSelectedCategory] = useState('Policies');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewAsStaff, setViewAsStaff] = useState(true);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Category sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="px-4 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Select Category</h3>
        </div>
        <nav className="flex flex-col pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'text-left px-4 py-2 text-sm transition-colors',
                selectedCategory === cat
                  ? 'text-[var(--policiesAndProcedures-primary)] font-medium bg-[#F5F9EB] border-l-2 border-[var(--policiesAndProcedures-primary)]'
                  : 'text-[#4B5563] hover:bg-gray-50 hover:text-[var(--policiesAndProcedures-primary)] border-l-2 border-transparent'
              )}
            >
              {cat}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Toggle row */}
        <div className="flex items-center justify-end px-4 md:px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280]">View as Staff User</span>
            <Switch
              checked={viewAsStaff}
              onCheckedChange={setViewAsStaff}
              className="data-[state=checked]:bg-[var(--policiesAndProcedures-primary)]"
            />
          </div>
        </div>

        {/* Article area */}
        <div className="flex-1 px-4 md:px-8 py-5 bg-white">
          {/* Search */}
          <div
            className={cn(
              'relative rounded-md border border-[var(--table-border)] mb-6 transition-all duration-200 ease-in-out',
              Glowing(APPS.POLICIES_AND_PROCEDURES).inputBox
            )}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon size={14} />
            </div>
            <Input
              placeholder="Search in the article"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white placeholder:text-gray-400 placeholder:text-sm border-none h-[36px] text-sm pl-9 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Title + actions */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              {ARTICLE_CONTENT.title}
            </h1>
            <div className="flex items-center gap-3 shrink-0">
              <CustomButton
                title="Download Article"
                type="button"
                app={APPS.POLICIES_AND_PROCEDURES}
                variant={BUTTON_VARIANTS.OUTLINE}
                leadingIcon={<Download size={14} />}
                buttonClass="h-[36px] text-sm rounded-md bg-white"
                width="px-4 py-2"
              />
              <CustomButton
                title="Submit Form"
                type="button"
                app={APPS.POLICIES_AND_PROCEDURES}
                leadingIcon={<FileText size={14} />}
                buttonClass="h-[36px] text-sm rounded-md"
                width="px-4 py-2"
              />
            </div>
          </div>

          {/* Article sections */}
          <div className="space-y-8">
            {ARTICLE_CONTENT.sections.map((section, sIdx) => (
              <div key={sIdx}>
                {/* Section heading banner */}
                <div className="inline-block bg-[#4B5320] text-white text-sm font-medium px-4 py-2 rounded-sm mb-4">
                  {section.heading}
                </div>

                {/* Paragraphs */}
                <div className="space-y-4">
                  {section.paragraphs.map((para, pIdx) => (
                    <p key={pIdx} className="text-sm text-[#374151] leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Key Components */}
                {section.keyComponents && (
                  <div className="mt-5">
                    <p className="text-sm font-bold text-[#374151] mb-3">Key Components:</p>
                    <ol className="space-y-4">
                      {section.keyComponents.map((comp, cIdx) => (
                        <li key={cIdx} className="text-sm text-[#374151]">
                          <p>
                            <span className="font-semibold">{cIdx + 1}. {comp.title}</span>
                          </p>
                          <p className="leading-relaxed mt-1">{comp.description}</p>
                          {comp.bullets.length > 0 && (
                            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                              {comp.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="text-sm text-[#374151]">{bullet}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
