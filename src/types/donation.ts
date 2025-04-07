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
    contribution_options:'Planning visit' | 'CSR' | 'Volunteer' | 'Share' | null;
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

export type DonationDataState = {
  totalDonations: number,
  donations: Record<number, Donation>
  paginationMapping: Record<number, number> 
}