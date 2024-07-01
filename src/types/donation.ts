
export type Donation = {
  
  id: number;
  key: number;

  Date_Recieved: string;
  Name: string;
  Donor_type: string;
  Phone: string;
  Email: string;
  PAN: string;
  Pledged: string;
  Land_type: string;
  Zone: number | null;
  Grove: string;
  PlantationLandType: string;
  DashboardStatus: string;
  Assigned_plot: string;
  Tree_planted: string;
  Assigner_dashboard: string;
  Remarks_for_inventory: string;
};

export type DonationDataState = {
  totalDonations: number,
  donations: Record<number, Donation>
}