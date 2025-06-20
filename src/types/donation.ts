
export type DonationSponsorshipType = 'Unverified' | 'Pledged' | 'Promotional' | 'Unsponsored Visit' | 'Donation Received'

export interface Donation {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  payment_id: number | null;
  category: 'Foundation' | 'Public';
  grove: string | null;
  grove_type_other: string | null;
  trees_count: number;
  pledged_area_acres: number | null;
  contribution_options: 'Planning visit' | 'CSR' | 'Volunteer' | 'Share' | null;
  names_for_plantation: string | null;
  comments: string | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  request_id: string;
  pledged: number | null;
  pledged_area: number | null;
  group_id: number | null;
  preference: string;
  event_name: string | null;
  alternate_email: string | null;
  tags?: string[] | null;
  booked?: number;
  assigned?: number;
  status: 'PendingPayment' |'Paid' | 'OrderFulfilled';
  mail_status: string[];
  mail_error: string | null;
  visit_date: Date | null;
  amount_donated: number | null; 
  amount_received: number; 
  donation_method: "amount" | "trees";
  sponsorship_type: DonationSponsorshipType;
  donation_receipt_number: string | null;
  processed_by: number | null;
  processed_by_name?: string;
}

export type DonationUser = {
  id: number;
  key: number;
  recipient: number;
  assignee: number;
  gifted_trees: number;
  trees_count?: number;
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


export type DonationTree = {
  id: number;
  sapling_id: string;
  plant_type: string;
  plot: string;
  site_name: string;
  scientific_name: string | null;
  assignee: number | null;
  recipient: number | null;
  assigned: number | null;
  recipient_name: string | null;
  recipient_email: string | null;
  recipient_phone: string | null;
  assignee_name: string | null;
  assignee_email: string | null;
  assignee_phone: string | null;
  relation: string | null;
}

export type DonationDataState = {
  loading: boolean,
  totalDonations: number,
  donations: Record<number, Donation>
  paginationMapping: Record<number, number>
}