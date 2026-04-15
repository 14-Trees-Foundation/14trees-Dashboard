import React, { useMemo } from 'react';
import StepLayout from '../../shared/StepLayout';
import FormAutocomplete from '../../shared/FormAutocomplete';
import {
	getDistrictOptions,
	getTalukaOptions,
	getVillageOptions,
} from '../../shared/locationData';
import type { SiteFormValues, SiteFormErrors } from '../AddSiteForm';

interface LocationStepProps {
	values: SiteFormValues;
	errors: SiteFormErrors;
	onChange: (field: keyof SiteFormValues, value: unknown) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({
	values,
	errors,
	onChange,
}) => {
	const districtOptions = useMemo(() => getDistrictOptions(), []);
	const talukaOptions = useMemo(
		() => getTalukaOptions(values.district),
		[values.district],
	);
	const villageOptions = useMemo(
		() => getVillageOptions(values.district, values.taluka),
		[values.district, values.taluka],
	);

	const handleDistrictChange = (v: string | null) => {
		onChange('district', v);
		onChange('taluka', null);
		onChange('village', null);
	};

	const handleTalukaChange = (v: string | null) => {
		onChange('taluka', v);
		onChange('village', null);
	};

	return (
		<StepLayout title="Location" subtitle="District, taluka and village / city">
			<FormAutocomplete
				label="District"
				name="district"
				value={values.district}
				onChange={handleDistrictChange}
				options={districtOptions}
				required
				error={errors.district}
				placeholder="Select district"
			/>
			<FormAutocomplete
				label="Taluka"
				name="taluka"
				value={values.taluka}
				onChange={handleTalukaChange}
				options={talukaOptions}
				required
				disabled={!values.district}
				error={errors.taluka}
				placeholder={
					values.district ? 'Select taluka' : 'Select a district first'
				}
			/>
			<FormAutocomplete
				label="Village / City"
				name="village"
				value={values.village}
				onChange={(v) => onChange('village', v)}
				options={villageOptions}
				freeSolo
				required
				disabled={!values.taluka}
				error={errors.village}
				placeholder={
					values.taluka
						? 'Select or type village name'
						: 'Select a taluka first'
				}
				helperText="Choose from the list or type a custom name"
			/>
		</StepLayout>
	);
};

export default LocationStep;
