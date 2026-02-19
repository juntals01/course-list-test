import { APPS } from '@/types/courses';

const APP_CSS_VAR_MAP: Record<string, string> = {
  [APPS.TRAINING]: '--training-primary',
  [APPS.POLICIES_AND_PROCEDURES]: '--policiesAndProcedures-primary',
  [APPS.FORMS]: '--forms-primary',
  [APPS.INSPECTIONS]: '--inspections-primary',
  [APPS.PORTAL]: '--primary',
  [APPS.CONTRACTORS]: '--primary',
  [APPS.HAZARDS]: '--primary',
};

const APP_HOVER_BG_MAP: Record<string, string> = {
  [APPS.TRAINING]: '#FFF7ED',
  [APPS.POLICIES_AND_PROCEDURES]: '#F5F9EB',
  [APPS.FORMS]: '#E6F5EE',
  [APPS.INSPECTIONS]: '#EBF2FF',
  [APPS.PORTAL]: '#F3F4F6',
  [APPS.CONTRACTORS]: '#FFF7ED',
  [APPS.HAZARDS]: '#FEF2F2',
};

export function getAppCssVar(app: APPS): string {
  return APP_CSS_VAR_MAP[app] || '--primary';
}

export function getAppHoverBg(app: APPS): string {
  return APP_HOVER_BG_MAP[app] || '#F3F4F6';
}
