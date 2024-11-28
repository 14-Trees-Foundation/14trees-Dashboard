import { User } from "./user";

export type VisitType = 'family' | 'corporate'

export const VisitTypeList = [
  { id: 'family', label: 'Family' },
  { id: 'corporate', label: 'Corporate' },
]

export type Visit = {
  key: number,
  id: number;
  visit_name: string;
  visit_date: Date;
  visit_type: VisitType;
  group_id: number | null;
  site_id: number | null;
  user_count: number;
  visit_images: string[];
  group_name?: string;
  site_name?: string;
  created_at: Date;
  updated_at: Date;
};


export type BulkVisitUsersMappingResponse = {
  success: number,
  failed: number,
  failed_records: any[],
}

export type VisitUsersMappingState = Record<number, BulkVisitUsersMappingResponse>

export type VisitsDataState = {
  totalVisits: number,
  visits: Record<number, Visit>
}

export type VisitUsersDataState = {
  totalUsers: number,
  users: Record<number, User>
}