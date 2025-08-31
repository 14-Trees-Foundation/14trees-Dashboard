export interface EventTreeAssociationProps {
  eventId: number;
  eventName: string;
  open: boolean;
  onClose: () => void;
}