// types/courses.ts

export enum APPS {
  PORTAL = 'Portal',
  TRAINING = 'Training',
  POLICIES_AND_PROCEDURES = 'Policies and Procedures',
  INSPECTIONS = 'Inspections',
  CONTRACTORS = 'Contractors',
  HAZARDS = 'Hazards',
  FORMS = 'Forms',
}

export type CourseWithDetails = {
  id: number;
  name: string;
  is_paid: boolean;
  price: number | null;
  totalUnits: number;
  companyCount: number;
  assignedCompanies: string;
  updatedAt: Date | null;
  deletedAt?: Date | null;
  description: string | null;
  enrollmentValidityDays: number | null;
  completionValidityDays: number | null;
};

export type JobRole = {
  id: number;
  name: string;
  assignedCompanies: string;
  status: boolean;
  archivedAt?: Date | null;
};

export const UNIT_TYPES = [
  'Assignment',
  'License',
  'Face to Face',
  'Read and Acknowledge',
  'Scorm Package',
] as const;

export type UnitType = (typeof UNIT_TYPES)[number];

export type CourseUnit = {
  id: number;
  name: string;
  type: UnitType;
  description: string;
  files: string[];
  enabled: boolean;
  hasLicenseExpiry?: boolean;
  selectedArticle?: string;
  scormFile?: string;
};

export type CourseJobRole = {
  id: number;
  name: string;
};

export type CourseDetail = {
  id: number;
  name: string;
  description: string;
  is_paid: boolean;
  price: number | null;
  enrollmentValidityDays: number | null;
  completionValidityDays: number | null;
  refresherPeriodDays: number | null;
  units: CourseUnit[];
};

export type JobRoleCourse = {
  id: number;
  name: string;
  totalUnits: number;
  selected?: boolean;
};
