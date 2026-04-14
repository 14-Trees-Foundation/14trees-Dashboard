import React from 'react';
import StepLayout from '../../shared/StepLayout';
import FormField from '../../shared/FormField';
import FormSelect from '../../shared/FormSelect';
import FormAutocomplete from '../../shared/FormAutocomplete';
import {
	OWNER_OPTIONS,
	MAINTENANCE_TYPE_OPTIONS,
} from '../../shared/siteFormOptions';
import type { SiteFormValues, SiteFormErrors } from '../AddSiteForm';

interface PrimaryDetailsStepProps {
	values: SiteFormValues;
	errors: SiteFormErrors;
	onChange: (field: keyof SiteFormValues, value: unknown) => void;
}

const PrimaryDetailsStep: React.FC<PrimaryDetailsStepProps> = ({
	values,
	errors,
	onChange,
}) => {
	return (
		<StepLayout
			title="Primary Details"
			subtitle="Site name, owner and service type"
		>
			<FormField
				label="Name (English)"
				name="name_english"
				value={values.name_english}
				onChange={(v) => onChange('name_english', v)}
				required
				error={errors.name_english}
				placeholder="e.g. Khed Plantation Site"
			/>
			<FormField
				label="Name (Marathi)"
				name="name_marathi"
				value={values.name_marathi}
				onChange={(v) => onChange('name_marathi', v)}
				required
				error={errors.name_marathi}
				placeholder="e.g. खेड लागवड स्थळ"
			/>
			<FormAutocomplete
				label="Owner Type"
				name="owner"
				value={values.owner}
				onChange={(v) => onChange('owner', v)}
				options={OWNER_OPTIONS}
				required
				error={errors.owner}
				placeholder="Select owner"
			/>
			<FormSelect
				label="Service Type"
				name="maintenance_type"
				value={values.maintenance_type}
				onChange={(v) => onChange('maintenance_type', v)}
				options={MAINTENANCE_TYPE_OPTIONS}
				required
				error={errors.maintenance_type}
				placeholder="Select service type"
			/>
		</StepLayout>
	);
};

export default PrimaryDetailsStep;
