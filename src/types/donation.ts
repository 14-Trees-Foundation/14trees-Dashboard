
export type Donation = {
  id: number;
  key: number;
  user_id: number;
  group_id: number | null;
  category: "Public" | "Foundation";
  grove: string | null;
  pledged: number | null;
  pledged_area: number | null;
  preference: string;
  payment_id: number | null;
  feedback: string | null;
  source_info: string | null;
  event_name: string | null;
  alternate_email: string | null;
  notes: string;
  associated_tag: string;
  request_id: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  group_name?: string;
  created_by_name?: string;
  booked: number 
};

export type DonationUser = {
  id: number;
  key: number;
  recipient: number;
  assignee: number;
  gifted_trees: number;
  donation_id: number;
  mail_sent: boolean | null;
  mail_error: string | null;
  profile_image_url: string | null;
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  assignee_name: string;
  assignee_email: string;
  assignee_phone: string;
  relation?: string;
  created_at: string;
  updated_at: string;
}

export type DonationDataState = {
  totalDonations: number,
  donations: Record<number, Donation>
  paginationMapping: Record<number, number> 
}