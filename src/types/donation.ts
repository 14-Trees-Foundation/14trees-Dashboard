
export type Donation = {
  id: number;
  key: number;
  date_received: string;
  name: string;
  donor_type: string;
  phone: string;
  email_address: string;
  pan: string;
  pledged: string;
  land_type: string;
  zone: number | null;
  grove: string;
  plantation_land_type: string;
  dashboard_status: string;
  assigned_plot: string;
  tree_planted: string;
  assigned_trees: string;
  assigner_dashboard: string;
  remarks_for_inventory: string;
  created_at: string;
  updated_at: string;
  associated_tag: string;
};

export type DonationDataState = {
  totalDonations: number,
  donations: Record<number, Donation>
}