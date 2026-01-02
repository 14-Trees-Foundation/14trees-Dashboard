import { GiftCard } from "../../../types/gift_card";
import { Donation } from "../../../types/donation";

export type RequestType = 'Gift Cards' | 'Normal Assignment' | 'Visit' | 'Donation' | 'Miscellaneous';

export interface RequestItem {
  id: string | number; // request_id or donation.id or 'miscellaneous'
  type: RequestType;
  eventName: string | null;
  date: Date;
  treeCount: number; // Total count only (no progress tracking)
  rawData: GiftCard | Donation | null; // Original object for reference
}

/**
 * Maps a Gift Card Request to RequestItem
 * Filters out 'Test' and 'Promotion' types
 */
export function mapGiftRequestToRequestItem(request: GiftCard): RequestItem | null {
  // Filter out 'Test' and 'Promotion' types - they should not appear in sponsor view
  if (request.request_type === 'Test' || request.request_type === 'Promotion') {
    return null; // Skip these request types
  }

  return {
    id: request.id,
    type: request.request_type as RequestType,
    eventName: request.event_name,
    date: new Date(request.created_at),
    treeCount: request.no_of_cards || 0,
    rawData: request
  };
}

/**
 * Maps a Donation to RequestItem
 */
export function mapDonationToRequestItem(donation: Donation): RequestItem {
  return {
    id: donation.id,
    type: 'Donation',
    eventName: donation.event_name || 'General Donation',
    date: new Date(donation.donation_date || donation.created_at),
    treeCount: donation.trees_count || 0,
    rawData: donation
  };
}

/**
 * Creates a Miscellaneous RequestItem for historical trees
 */
export function createMiscellaneousRequestItem(treeCount: number): RequestItem {
  return {
    id: 'miscellaneous',
    type: 'Miscellaneous',
    eventName: 'Miscellaneous',
    date: new Date(), // Not displayed - can use current date for sorting
    treeCount: treeCount,
    rawData: null
  };
}
