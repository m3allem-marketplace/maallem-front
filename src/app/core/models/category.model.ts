// ─── TASK 1.7 ── Category Model (extended from shared) ───────────────────────
// Engineer 1 created the base Category in shared/models/category.model.ts
// Engineer 3 extends it with API-level fields here in core/models/

import { Category } from '../../../app/shared/models/category.model';

export interface ServiceCategory extends Category {
  nameAr:       string;        // Arabic name — platform is bilingual
  slug:         string;        // URL-friendly identifier
  isActive:     boolean;
  serviceCount: number;
}

export interface ServiceType {
  id:          string;
  categoryId:  string;
  name:        string;
  nameAr:      string;
  basePrice:   number;
  unit:        'per_hour' | 'per_job' | 'per_sqm';
  description: string;
}
