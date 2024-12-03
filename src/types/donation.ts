
export type Donation = {
  id: number;
  key: number;
  user_id: number;
  group_id: number | null;
  category: "Public" | "Foundation";
  grove: string | null;
  pledged: number | null;
  pledged_area: number | null;
  user_visit: boolean;
  payment_id: number | null;
  feedback: string;
  notes: string;
  associated_tag: string;
  request_id: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  group_name?: string;
  created_by_name?: string;
};

export type DonationDataState = {
  totalDonations: number,
  donations: Record<number, Donation>
  paginationMapping: Record<number, number> 
}