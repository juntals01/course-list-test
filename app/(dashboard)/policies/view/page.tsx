'use client';

import React, { useState } from 'react';
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
  'Code of Conduct',
  'Onboarding',
  'Data Protection Measures',
  'Crisis Response Plan',
  'Onboarding Procedures',
  'Home Office Standards',
  'Sustainability Practices',
  'Accident Reporting Procedures',
  'Product Standards',
  'Equity Practices',
  'HR Policies',
  'Safety Compliance',
  'Workplace Safety',
  'Fleet Management',
  'Legal Compliance',
  'Emergency Response',
];

const POLICIES_CONTENT = {
  title: 'Company Policies & Procedures',
  sections: [
    {
      heading: 'Code of Conduct',
      paragraphs: [
        'Our Code of Conduct outlines the principles and standards that guide the behaviour of all employees. It reflects our commitment to maintaining a workplace built on integrity, respect, and accountability.',
        'All staff members are expected to familiarise themselves with these guidelines and adhere to them in their daily professional activities. Breaches of conduct may result in disciplinary action as outlined in the employee handbook.',
      ],
    },
    {
      heading: 'Workplace Health & Safety',
      paragraphs: [
        'The safety and wellbeing of our employees is our highest priority. This policy establishes the framework for maintaining a safe working environment across all company sites and operations.',
      ],
      keyComponents: [
        {
          title: 'Hazard Identification & Risk Assessment',
          description: 'Regular workplace inspections and risk assessments must be conducted to identify potential hazards. All staff are encouraged to report unsafe conditions immediately through the incident reporting system.',
          bullets: [
            'Monthly safety walkthroughs by site supervisors',
            'Quarterly risk assessment reviews',
            'Annual workplace safety audits',
            'Real-time hazard reporting via mobile app',
          ],
        },
        {
          title: 'Emergency Procedures',
          description: 'All employees must be familiar with emergency evacuation routes and assembly points. Emergency drills are conducted regularly to ensure preparedness.',
          bullets: [
            'Fire evacuation procedures and warden assignments',
            'First aid response protocols',
            'Chemical spill containment procedures',
            'Severe weather response plans',
          ],
        },
        {
          title: 'Personal Protective Equipment (PPE)',
          description: 'Appropriate PPE must be worn at all times in designated areas. The company provides all required PPE at no cost to employees.',
          bullets: [
            'Hard hats in construction zones',
            'Safety glasses in workshop areas',
            'High-visibility vests on active sites',
            'Hearing protection in high-noise environments',
          ],
        },
      ],
    },
    {
      heading: 'Data Protection & Privacy',
      paragraphs: [
        'We are committed to protecting the personal data of our employees, clients, and partners. This policy outlines our obligations under applicable privacy legislation and the measures we take to safeguard sensitive information.',
        'All employees who handle personal data must complete annual data protection training and adhere to the data handling procedures outlined in this document.',
      ],
    },
  ],
};

export default function ViewPoliciesPage() {
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
              placeholder="Search policies and procedures"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white placeholder:text-gray-400 placeholder:text-sm border-none h-[36px] text-sm pl-9 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Title + actions */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              {POLICIES_CONTENT.title}
            </h1>
            <div className="flex items-center gap-3 shrink-0">
              <CustomButton
                title="Download All"
                type="button"
                app={APPS.POLICIES_AND_PROCEDURES}
                variant={BUTTON_VARIANTS.OUTLINE}
                leadingIcon={<Download size={14} />}
                buttonClass="h-[36px] text-sm rounded-md bg-white"
                width="px-4 py-2"
              />
            </div>
          </div>

          {/* Policy sections */}
          <div className="space-y-8">
            {POLICIES_CONTENT.sections.map((section, sIdx) => (
              <div key={sIdx}>
                <div className="inline-block bg-[#4B5320] text-white text-sm font-medium px-4 py-2 rounded-sm mb-4">
                  {section.heading}
                </div>

                <div className="space-y-4">
                  {section.paragraphs.map((para, pIdx) => (
                    <p key={pIdx} className="text-sm text-[#374151] leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

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
