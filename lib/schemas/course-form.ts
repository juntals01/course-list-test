import { z } from 'zod';

const unitSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Unit name is required'),
  type: z.enum(['Assignment', 'License', 'Face to Face', 'Read and Acknowledge', 'Scorm Package']),
  description: z.string().optional().default(''),
  files: z.array(z.string()).default([]),
  enabled: z.boolean().default(true),
  hasLicenseExpiry: z.boolean().optional(),
  selectedArticle: z.string().optional(),
  scormFile: z.string().optional(),
});

export const freeCourseSchema = z.object({
  courseName: z.string().min(1, 'Course name is required'),
  summary: z.string().optional().default(''),
  enrollmentValidity: z.string().optional().default(''),
  refresherPeriod: z.string().optional().default(''),
  units: z.array(unitSchema).min(1, 'At least one unit is required'),
});

export const paidCourseSchema = z.object({
  monthlyPrice: z.string().min(1, 'Monthly price is required'),
  courseName: z.string().min(1, 'Course name is required'),
  summary: z.string().optional().default(''),
  enrollmentValidity: z.string().optional().default(''),
  completionValidity: z.string().optional().default(''),
  units: z.array(unitSchema).min(1, 'At least one unit is required'),
});

export type FreeCourseFormData = z.input<typeof freeCourseSchema>;
export type PaidCourseFormData = z.input<typeof paidCourseSchema>;
export type UnitFormData = z.input<typeof unitSchema>;
