import type { CourseDetail, JobRoleCourse } from '@/types/courses';

export const MOCK_COURSE_DETAIL: CourseDetail = {
  id: 151,
  name: 'Safety Operations Guideline',
  description: 'Establishes and enforces safety procedures to ensure compliance, risk prevention, and operational readiness.',
  is_paid: false,
  price: null,
  enrollmentValidityDays: 365,
  completionValidityDays: null,
  refresherPeriodDays: 90,
  units: [
    {
      id: 1,
      name: 'Unit 1',
      type: 'Assignment',
      description: 'Apply safety guidelines by identifying risks, ensuring compliance, and responding to operational safety issues.',
      files: ['Guidelines.pdf'],
      enabled: true,
    },
    {
      id: 2,
      name: 'Unit 2',
      type: 'License',
      description: 'Review licensing requirements, track expirations, and ensure adherence to legal standards.',
      files: ['Guidelines.pdf', 'verify.pdf'],
      enabled: true,
    },
  ],
};

export const MOCK_JOB_ROLE_COURSES: JobRoleCourse[] = [
  { id: 150, name: 'Diversity and Inclusion Training', totalUnits: 1 },
  { id: 151, name: 'Cybersecurity Awareness Seminar', totalUnits: 3 },
  { id: 152, name: 'Leadership Development Workshop', totalUnits: 4 },
  { id: 153, name: 'Project Management Essentials', totalUnits: 5 },
  { id: 154, name: 'Effective Communication Skills', totalUnits: 2 },
];
