'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

import CustomButton from '@/components/custom-ui/custom-button';
import { BUTTON_VARIANTS } from '@/components/custom-ui/button-variants';
import CustomAccordion from '@/components/custom-ui/custom-accordion';
import CustomInput from '@/components/custom-ui/custom-input';
import { Switch } from '@/components/ui/switch';
import { APPS, type CourseUnit, type UnitType } from '@/types/courses';
import { paidCourseSchema, type PaidCourseFormData } from '@/lib/schemas/course-form';
import UnitFields from '@/components/course-form/UnitFields';
import AddActivityModal from '@/components/course-form/AddActivityModal';
import JobRolesSection from '@/components/course-form/JobRolesSection';

let nextUnitId = 2;

function createUnit(type: UnitType): CourseUnit {
  return {
    id: nextUnitId++,
    name: '',
    type,
    description: '',
    files: [],
    enabled: true,
    hasLicenseExpiry: undefined,
    selectedArticle: '',
    scormFile: '',
  };
}

export default function AddPaidCoursePage() {
  const [units, setUnits] = useState<CourseUnit[]>([
    { id: 1, name: '', type: 'Assignment', description: '', files: [], enabled: true },
  ]);
  const [activityModalOpen, setActivityModalOpen] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaidCourseFormData>({
    resolver: zodResolver(paidCourseSchema),
    defaultValues: {
      monthlyPrice: '',
      courseName: '',
      summary: '',
      enrollmentValidity: '',
      completionValidity: '',
      units: [{ id: 1, name: '', type: 'Assignment', description: '', files: [], enabled: true }],
    },
  });

  const monthlyPrice = watch('monthlyPrice');
  const courseName = watch('courseName');
  const summary = watch('summary');
  const enrollmentValidity = watch('enrollmentValidity');
  const completionValidity = watch('completionValidity');

  const syncUnitsToForm = (updated: CourseUnit[]) => {
    setUnits(updated);
    setValue('units', updated, { shouldValidate: true });
  };

  const toggleUnit = (id: number) => {
    syncUnitsToForm(units.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u)));
  };

  const removeUnit = (id: number) => {
    syncUnitsToForm(units.filter((u) => u.id !== id));
  };

  const addUnit = (type: UnitType) => {
    const newUnit = createUnit(type);
    syncUnitsToForm([...units, newUnit]);
  };

  const updateUnit = (id: number, updates: Partial<CourseUnit>) => {
    syncUnitsToForm(units.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const onSubmit = (data: PaidCourseFormData) => {
    console.log('Paid Course submitted:', data);
  };

  const onSaveAndClose = () => {
    handleSubmit((data) => {
      console.log('Paid Course saved & closed:', data);
    })();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-4 md:px-6 py-4 flex flex-col">
      <Link
        href="/courses/paid"
        className="inline-flex items-center gap-1.5 text-[var(--training-primary)] text-sm font-medium hover:underline mb-4"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">
          Add Paid Course
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create and publish paid course
        </p>
      </div>

      <div className="space-y-6 flex-1">
        <CustomAccordion title="Course Details" defaultExpanded={true}>
          <div className="space-y-5">
            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
              <label className="text-sm font-medium text-[var(--text-primary)]">Monthly Price</label>
              <CustomInput name="monthlyPrice" placeholder="Enter Amount" value={monthlyPrice} onValueChange={(val) => setValue('monthlyPrice', val, { shouldValidate: true })} app={APPS.TRAINING} tooltip="Monthly subscription price" validationError={errors.monthlyPrice?.message} />
            </div>
            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
              <label className="text-sm font-medium text-[var(--text-primary)]">Course Name</label>
              <CustomInput name="courseName" placeholder="Course Name" value={courseName} onValueChange={(val) => setValue('courseName', val, { shouldValidate: true })} app={APPS.TRAINING} validationError={errors.courseName?.message} />
            </div>
            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-start md:gap-4">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">Course Summary <span className="text-gray-400 text-xs">(optional)</span></label>
              <CustomInput name="summary" placeholder="Course Summary" value={summary} onValueChange={(val) => setValue('summary', val)} multiline rows={3} app={APPS.TRAINING} tooltip="Brief summary of the course content" />
            </div>
            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">Enrollment Validity <span className="text-gray-400 text-xs">(optional)</span></label>
              <CustomInput name="enrollmentValidity" placeholder="Enter No. of Days" value={enrollmentValidity} onValueChange={(val) => setValue('enrollmentValidity', val)} app={APPS.TRAINING} tooltip="Number of days the enrollment remains valid" />
            </div>
            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-[200px_1fr] md:items-center md:gap-4">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">Refresher Period <span className="text-gray-400 text-xs">(optional)</span></label>
              <CustomInput name="completionValidity" placeholder="Enter No. of Days" value={completionValidity} onValueChange={(val) => setValue('completionValidity', val)} app={APPS.TRAINING} tooltip="Number of days before the course needs to be retaken" />
            </div>
          </div>
        </CustomAccordion>

        {units.map((unit, idx) => (
          <CustomAccordion
            key={unit.id}
            title={`Unit ${idx + 1} Details (${unit.type})`}
            defaultExpanded={true}
            headerChildren={
              <div className="flex items-center gap-3">
                <Switch
                  checked={unit.enabled}
                  onCheckedChange={() => toggleUnit(unit.id)}
                  className="data-[state=checked]:bg-[var(--training-primary)]"
                />
                <button
                  type="button"
                  onClick={() => removeUnit(unit.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            }
          >
            <UnitFields
              unitType={unit.type}
              unitIndex={idx + 1}
              unitId={unit.id}
              nameValue={unit.name}
              onNameChange={(val) => updateUnit(unit.id, { name: val })}
              descriptionValue={unit.description}
              onDescriptionChange={(val) => updateUnit(unit.id, { description: val })}
              hasLicenseExpiry={unit.hasLicenseExpiry}
              onLicenseExpiryChange={(val) => updateUnit(unit.id, { hasLicenseExpiry: val })}
              selectedArticle={unit.selectedArticle}
              onArticleChange={(val) => updateUnit(unit.id, { selectedArticle: val })}
              nameError={errors.units?.[idx]?.name?.message}
            />
          </CustomAccordion>
        ))}

        {errors.units?.message && (
          <p className="text-sm text-red-500">{errors.units.message}</p>
        )}

        <button
          type="button"
          onClick={() => setActivityModalOpen(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:border-[var(--training-primary)] hover:text-[var(--training-primary)] transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add a Unit
        </button>

        <JobRolesSection />
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center md:justify-end gap-3 py-6 border-t border-gray-200 mt-6">
        <CustomButton
          title="Save"
          type="submit"
          app={APPS.TRAINING}
          variant={BUTTON_VARIANTS.OUTLINE}
          buttonClass="h-[36px] text-sm rounded-md bg-white"
          width="px-6 py-2"
        />
        <CustomButton
          title="Save and Close"
          type="button"
          onClick={onSaveAndClose}
          app={APPS.TRAINING}
          buttonClass="h-[36px] text-sm rounded-md"
          width="px-6 py-2"
        />
      </div>

      <AddActivityModal
        isOpen={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        onSelect={addUnit}
      />
    </form>
  );
}
