/**
 * Event-specific types for EventImageAssociation component
 * Most image management types have been moved to /components/common/ImageManager/types.ts
 */

export interface EventImageAssociationProps {
  eventId: number;
  eventName: string;
  open: boolean;
  onClose: () => void;
}