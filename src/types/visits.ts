import { User } from "./user";

export type Visit = {
  key: number,
  id: number;
  visit_name: string | null;
  visit_date: Date|null;
  visit_type: string;
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