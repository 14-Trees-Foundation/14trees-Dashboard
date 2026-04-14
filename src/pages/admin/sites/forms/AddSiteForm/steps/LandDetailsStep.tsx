import React from 'react';
import StepLayout from '../../shared/StepLayout';
import FormSelect from '../../shared/FormSelect';
import FormField from '../../shared/FormField';
import {
	LAND_TYPE_OPTIONS,
	LAND_STRATA_OPTIONS,
	isRoadsideLandType,
} from '../../shared/siteFormOptions';
import type { SiteFormValues, SiteFormErrors } from '../AddSiteForm';

interface LandDetailsStepProps {
	values: SiteFormValues;
	errors: SiteFormErrors;
	onChange: (field: keyof SiteFormValues, value: unknown) => void;
}

const LandDetailsStep: React.FC<LandDetailsStepProps> = ({
	values,
	errors,
	onChange,
}) => {
	const isRoadside = isRoadsideLandType(values.land_type);

	return (
		<StepLayout
			title="Land Details"
			subtitle="Classification and physical dimensions"
		>
			<FormSelect
				label="Land Type"
				name="land_type"
				value={values.land_type}
				onChange={(v) => {
					onChange('land_type', v);
					// Reset the measurement field when land type category switches
					if (isRoadsideLandType(v)) {
						onChange('area_acres', '');
					} else {
						onChange('length_km', '');
					}
				}}
				options={LAND_TYPE_OPTIONS}
				required
				error={errors.land_type}
				placeholder="Select land type"
			/>
			<FormSelect
				label="Land Strata"
				name="land_strata"
				value={values.land_strata}
				onChange={(v) => onChange('land_strata', v)}
				options={LAND_STRATA_OPTIONS}
				required
				error={errors.land_strata}
				placeholder="Select land strata"
			/>
			{values.land_type !== '' &&
				(isRoadside ? (
					<FormField
						label="Length (km)"
						name="length_km"
						value={values.length_km}
						onChange={(v) => onChange('length_km', v)}
						type="number"
						placeholder="0.0"
						helperText="Total road length covered by this site"
					/>
				) : (
					<FormField
						label="Area (acres)"
						name="area_acres"
						value={values.area_acres}
						onChange={(v) => onChange('area_acres', v)}
						type="number"
						placeholder="0.0"
						helperText="Total land area in acres"
					/>
				))}
		</StepLayout>
	);
};

export default LandDetailsStep;
