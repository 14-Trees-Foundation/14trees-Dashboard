import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { lightAnalyticsTheme } from '../../../../../theme';
import { FORM_COLORS } from '../../../shared/adminTheme';
import PrimaryDetailsStep from './steps/PrimaryDetailsStep';
import LandDetailsStep from './steps/LandDetailsStep';
import LocationStep from './steps/LocationStep';
import MiscStep from './steps/MiscStep';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteFormValues {
	name_english: string;
	name_marathi: string;
	owner: string | null;
	maintenance_type: string;
	land_type: string;
	land_strata: string;
	area_acres: string | number;
	length_km: string | number;
	district: string | null;
	taluka: string | null;
	village: string | null;
	consent_letter: string;
	consent_document_link: string;
	google_earth_link: string[];
	account: string;
	tags: string[];
}

export type SiteFormErrors = Partial<Record<keyof SiteFormValues, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_VALUES: SiteFormValues = {
	name_english: '',
	name_marathi: '',
	owner: null,
	maintenance_type: '',
	land_type: '',
	land_strata: '',
	area_acres: '',
	length_km: '',
	district: null,
	taluka: null,
	village: null,
	consent_letter: '',
	consent_document_link: '',
	google_earth_link: [],
	account: '',
	tags: [],
};

const STEPS = [
	{ label: 'Primary', description: 'Name & ownership' },
	{ label: 'Land', description: 'Type & area' },
	{ label: 'Location', description: 'District & village' },
	{ label: 'Documents', description: 'Consent & tags' },
];

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep(step: number, values: SiteFormValues): SiteFormErrors {
	const errors: SiteFormErrors = {};

	if (step === 0) {
		if (!values.name_english.trim())
			errors.name_english = 'Site name (English) is required';
		if (!values.name_marathi.trim())
			errors.name_marathi = 'Site name (Marathi) is required';
		// if (!values.owner) errors.owner = 'Owner type is required';
		// if (!values.maintenance_type)
		// errors.maintenance_type = 'Service type is required';
	}

	// if (step === 1) {
	// 	if (!values.land_type) errors.land_type = 'Land type is required';
	// 	if (!values.land_strata) errors.land_strata = 'Land strata is required';
	// }

	if (step === 2) {
		if (!values.district) errors.district = 'District is required';
		if (!values.taluka) errors.taluka = 'Taluka is required';
		if (!values.village) errors.village = 'Village / city is required';
	}

	return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AddSiteFormProps {
	open: boolean;
	onClose: () => void;
	/** Called with the form payload on successful submit. */
	onSubmit: (data: Record<string, unknown>) => void;
}

const AddSiteForm: React.FC<AddSiteFormProps> = ({
	open,
	onClose,
	onSubmit,
}) => {
	const [activeStep, setActiveStep] = useState(0);
	const [values, setValues] = useState<SiteFormValues>(INITIAL_VALUES);
	const [errors, setErrors] = useState<SiteFormErrors>({});

	const handleChange = (field: keyof SiteFormValues, value: unknown) => {
		setValues((prev) => ({ ...prev, [field]: value }));
		// Clear the error for the changed field
		if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const handleNext = () => {
		const stepErrors = validateStep(activeStep, values);
		if (Object.keys(stepErrors).length > 0) {
			setErrors(stepErrors);
			return;
		}
		setErrors({});
		setActiveStep((s) => s + 1);
	};

	const handleBack = () => {
		setErrors({});
		setActiveStep((s) => s - 1);
	};

	const handleClose = () => {
		setValues(INITIAL_VALUES);
		setErrors({});
		setActiveStep(0);
		onClose();
	};

	const handleSubmit = () => {
		const stepErrors = validateStep(activeStep, values);
		if (Object.keys(stepErrors).length > 0) {
			setErrors(stepErrors);
			return;
		}

		const payload: Record<string, unknown> = {
			name_english: values.name_english.trim(),
			name_marathi: values.name_marathi.trim(),
			owner: values.owner,
			maintenance_type: values.maintenance_type,
			land_type: values.land_type,
			land_strata: values.land_strata,
			district: values.district,
			taluka: values.taluka,
			village: values.village,
			// Empty strings are fine — apiClient skips '' values
			consent_letter: values.consent_letter,
			consent_document_link: values.consent_document_link,
			google_earth_link: values.google_earth_link,
			account: values.account,
			tags: values.tags,
		};

		// Include whichever measurement field applies
		if (values.area_acres !== '')
			payload.area_acres = Number(values.area_acres);
		if (values.length_km !== '') payload.length_km = Number(values.length_km);

		onSubmit(payload);
		handleClose();
	};

	const stepProps = { values, errors, onChange: handleChange };

	const stepContent = [
		<PrimaryDetailsStep key="primary" {...stepProps} />,
		<LandDetailsStep key="land" {...stepProps} />,
		<LocationStep key="location" {...stepProps} />,
		<MiscStep key="misc" {...stepProps} />,
	];

	const isLastStep = activeStep === STEPS.length - 1;

	return (
		<ThemeProvider theme={lightAnalyticsTheme}>
			<Dialog
				open={open}
				onClose={handleClose}
				fullWidth
				maxWidth="sm"
				PaperProps={{
					sx: {
						borderRadius: '16px',
						backgroundColor: FORM_COLORS.dialogBg,
						border: `1px solid ${FORM_COLORS.border}`,
						boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
					},
				}}
			>
				{/* Header */}
				<DialogTitle
					sx={{
						px: 3,
						pt: 3,
						pb: 0,
						fontWeight: 600,
						fontSize: '1rem',
						color: FORM_COLORS.textPrimary,
						letterSpacing: '-0.01em',
					}}
				>
					Add New Site
				</DialogTitle>

				{/* Stepper */}
				<Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
					<Stepper activeStep={activeStep} alternativeLabel>
						{STEPS.map((step, index) => (
							<Step key={step.label} completed={index < activeStep}>
								<StepLabel
									sx={{
										'& .MuiStepLabel-label': {
											fontSize: '0.68rem',
											fontWeight: activeStep === index ? 600 : 400,
											color:
												activeStep === index
													? FORM_COLORS.stepActive
													: index < activeStep
													? FORM_COLORS.accentLight
													: FORM_COLORS.textMuted,
											mt: 0.5,
										},
										'& .MuiStepIcon-root': {
											color:
												index < activeStep
													? FORM_COLORS.accentLight
													: activeStep === index
													? FORM_COLORS.stepActive
													: FORM_COLORS.stepInactive,
										},
										'& .MuiStepIcon-root.Mui-active': {
											color: FORM_COLORS.stepActive,
										},
										'& .MuiStepIcon-root.Mui-completed': {
											color: FORM_COLORS.accentLight,
										},
										'& .MuiStepIcon-text': {
											fill: '#fff',
											fontSize: '0.65rem',
											fontWeight: 700,
										},
									}}
								>
									<Box>
										<Typography
											sx={{
												fontSize: '0.68rem',
												fontWeight: activeStep === index ? 600 : 400,
												color:
													activeStep === index
														? FORM_COLORS.stepActive
														: index < activeStep
														? FORM_COLORS.accentLight
														: FORM_COLORS.textMuted,
											}}
										>
											{step.label}
										</Typography>
										<Typography
											sx={{
												fontSize: '0.62rem',
												color: FORM_COLORS.textMuted,
												display: { xs: 'none', sm: 'block' },
											}}
										>
											{step.description}
										</Typography>
									</Box>
								</StepLabel>
							</Step>
						))}
					</Stepper>
				</Box>

				{/* Step content */}
				<DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
					{stepContent[activeStep]}
				</DialogContent>

				{/* Actions */}
				<DialogActions
					sx={{
						px: 3,
						pb: 3,
						pt: 1,
						gap: 1,
						justifyContent: 'space-between',
					}}
				>
					<Button
						variant="outlined"
						size="small"
						onClick={handleClose}
						sx={{
							borderColor: FORM_COLORS.border,
							color: FORM_COLORS.textSecondary,
							borderRadius: '8px',
							textTransform: 'none',
							fontSize: '0.8rem',
							'&:hover': {
								borderColor: FORM_COLORS.textMuted,
								backgroundColor: FORM_COLORS.sectionBg,
							},
						}}
					>
						Cancel
					</Button>

					<Box sx={{ display: 'flex', gap: 1 }}>
						{activeStep > 0 && (
							<Button
								variant="outlined"
								size="small"
								onClick={handleBack}
								sx={{
									borderColor: FORM_COLORS.border,
									color: FORM_COLORS.textSecondary,
									borderRadius: '8px',
									textTransform: 'none',
									fontSize: '0.8rem',
									'&:hover': {
										borderColor: FORM_COLORS.accent,
										color: FORM_COLORS.accent,
										backgroundColor: '#f0fdf4',
									},
								}}
							>
								Back
							</Button>
						)}
						<Button
							variant="contained"
							size="small"
							onClick={isLastStep ? handleSubmit : handleNext}
							sx={{
								backgroundColor: FORM_COLORS.accent,
								color: '#fff',
								borderRadius: '8px',
								textTransform: 'none',
								fontSize: '0.8rem',
								fontWeight: 600,
								px: 2.5,
								'&:hover': { backgroundColor: '#1c3a1c' },
							}}
						>
							{isLastStep ? 'Create Site' : 'Next'}
						</Button>
					</Box>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
};

export default AddSiteForm;
