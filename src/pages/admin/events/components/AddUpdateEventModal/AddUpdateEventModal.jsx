import React, { useMemo } from 'react';
import EventUpsertDialog from '../shared/EventUpsertDialog';

const AddUpdateEventModal = ({
	open,
	handleClose,
	mode = 'add',
	existingEvent = null,
	onSubmit,
}) => {
	const initialValues = useMemo(() => ({}), []);

	return (
		<EventUpsertDialog
			open={open}
			onClose={handleClose}
			onSubmit={onSubmit}
			mode={mode}
			existingEvent={existingEvent}
			themeMode="light"
			initialValues={initialValues}
		/>
	);
};

export default AddUpdateEventModal;
