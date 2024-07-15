import { User } from "./user";

export type Visit = {
  key: number,
  id: number;
  visit_name: string | null;
  visit_date: Date|null;
};


export type BulkVisitUsersMappingResponse = {
  success: number,
  failed: number,
  failed_records: any[],
}

export type VisitUsersMappingState = Record<number, BulkVisitUsersMappingResponse>

export type VistsDataState = {
  totalVisits: number,
  visits: Record<number, Visit>
}

export type VisitUsersDataState = {
  totalUsers: number,
  users: Record<number, User>
}