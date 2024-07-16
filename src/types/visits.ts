export type Visit = {
  id: number;
  
  visit_name: string | null;
  
 
  visit_date: Date|null;
  
 
  
};

export type VistsDataState = {
  totalVisits: number,
  visits: Record<number, Visit>
}