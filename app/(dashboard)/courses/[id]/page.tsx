'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import CustomAccordion from '@/components/custom-ui/custom-accordion';
import { APPS } from '@/types/courses';
import { MOCK_COURSE_DETAIL } from '@/lib/mock-course-detail';

export default function ViewCoursePage() {
  const course = MOCK_COURSE_DETAIL;

  return (
    <div className="flex-1 px-4 md:px-6 py-4">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-[var(--training-primary)] text-sm font-medium hover:underline mb-4"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">
          {course.name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{course.description}</p>
      </div>

      <CustomButton
        title="Edit Course"
        leadingIcon={<Pencil size={14} />}
        app={APPS.TRAINING}
        buttonClass="h-[42px] text-sm rounded-md w-full md:w-auto mb-6"
        width="w-full md:w-auto px-4 py-2"
      />

      <div className="space-y-6">
        {course.units.map((unit) => (
          <CustomAccordion
            key={unit.id}
            title={`${unit.name} Details (${unit.type})`}
            defaultExpanded={true}
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-600">{unit.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Additional Files
                </h4>
                <div className="flex flex-wrap items-center gap-4">
                  {unit.files.map((file) => (
                    <button
                      key={file}
                      className="text-sm text-[var(--training-primary)] font-medium hover:underline"
                    >
                      {file}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CustomAccordion>
        ))}
      </div>
    </div>
  );
}
