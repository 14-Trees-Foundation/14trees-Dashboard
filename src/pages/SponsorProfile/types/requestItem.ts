import { GiftCard } from "../../../types/gift_card";
import { Donation } from "../../../types/donation";

export type RequestType = 'Tree Gifts' | 'Direct Sponsorship' | 'Event Participation' | 'Donation' | 'Historical Sponsorships';

export interface RequestItem {
  id: string | number; // request_id or donation.id or 'miscellaneous'
  type: RequestType;
  eventName: string | null;
  date: Date;
  treeCount: number; // Total count only (no progress tracking)
  rawData: GiftCard | Donation | null; // Original object for reference
  thumbnailPhoto?: string; // URL of first tree's photo
}

/**
 * Converts backend request_type to user-friendly RequestType
 */
function getRequestType(type: string): RequestType {
  switch (type) {
    case 'Gift Cards':
      return 'Tree Gifts';
    case 'Normal Assignment':
      return 'Direct Sponsorship';
    case 'Visit':
      return 'Event Participation';
    default:
      return 'Tree Gifts'; // fallback
  }
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
    type: getRequestType(request.request_type),
    eventName: request.event_name,
    date: new Date(request.created_at),
    treeCount: request.no_of_cards || 0,
    rawData: request,
    thumbnailPhoto: (request as any).first_tree_photo_url || undefined
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
    rawData: donation,
    thumbnailPhoto: (donation as any).first_tree_photo_url || undefined
  };
}

/**
 * Creates a Miscellaneous RequestItem for historical trees
 */
export function createMiscellaneousRequestItem(treeCount: number): RequestItem {
  return {
    id: 'miscellaneous',
    type: 'Historical Sponsorships',
    eventName: 'Legacy Trees',
    date: new Date(), // Not displayed - can use current date for sorting
    treeCount: treeCount,
    rawData: null
  };
}
