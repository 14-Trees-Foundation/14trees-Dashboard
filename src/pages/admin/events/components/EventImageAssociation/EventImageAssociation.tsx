import React from 'react';
import ImageManagerComponent from '../../../../../components/common/ImageManager/ImageManagerComponent';
import { createEventImageApiMethods } from '../../../../../components/common/ImageManager/adapters/eventImageAdapter';
import { EventImageAssociationProps } from './types';

const EventImageAssociation: React.FC<EventImageAssociationProps> = ({
  eventId,
  eventName,
  open,
  onClose,
}) => {
  const apiMethods = createEventImageApiMethods();

  return (
    <ImageManagerComponent
      entityId={eventId}
      entityName={eventName}
      open={open}
      onClose={onClose}
      apiMethods={apiMethods}
      title="Event Image Association"
    />
  );
};

export default EventImageAssociation;