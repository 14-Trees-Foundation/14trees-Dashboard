import React, { useEffect, useMemo, useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	MenuItem,
	TextField,
	Typography,
	Stack,
} from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import ApiClient from '../../../../../api/apiClient/apiClient';
import { EVENT_TYPE_MAP } from '../../../../../utils/eventTypes';
import { buildEventFormTheme } from '../../../../../theme';
import { useEventForm } from '../AddUpdateEventModal/hooks/useEventForm';
import { useEventValidation } from '../AddUpdateEventModal/hooks/useEventValidation';
import FileUploadSection from '../AddUpdateEventModal/components/FileUploadSection';
import UserLookupComponent from '../../../../../components/common/UserLookup/UserLookupComponent';
import { USER_LOOKUP_PRESETS } from '../../../../../components/common/UserLookup/types';
import { getUserByIdApi } from '../../../../../components/common/UserLookup/utils/userApi';
import LocationPicker from '../../../../../components/LocationPicker';

const locationOptions = [
	{ value: 'onsite', label: 'Onsite' },
	{ value: 'offsite', label: 'Offsite' },
];

const SectionCard = ({ title, subtitle, children }) => {
	const theme = useTheme();
	return (
		<Card>
			<CardContent sx={{ p: 2.5 }}>
				<Stack spacing={0.5} sx={{ mb: 2 }}>
					<Typography
						variant="subtitle1"
						sx={{ fontWeight: 700, color: theme.palette.text.primary }}
					>
						{title}
					</Typography>
					{subtitle && (
						<Typography
							variant="body2"
							sx={{ color: theme.palette.text.secondary }}
						>
							{subtitle}
						</Typography>
					)}
				</Stack>
				{children}
			</CardContent>
		</Card>
	);
};

const EventUpsertDialog = ({
	open,
	onClose,
	onSubmit,
	mode = 'add',
	existingEvent = null,
	themeMode = 'light',
	title,
	submitLabel,
	initialValues = {},
}) => {
	const [campaigns, setCampaigns] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const formTheme = useMemo(() => buildEventFormTheme(themeMode), [themeMode]);

	const mergedInitialValues = useMemo(
		() => ({
			...initialValues,
			assigned_by:
				initialValues.assigned_by ?? existingEvent?.assigned_by ?? '',
			group_id: initialValues.group_id ?? existingEvent?.group_id ?? '',
			site_id: initialValues.site_id ?? existingEvent?.site_id ?? '',
			show_blessings:
				initialValues.show_blessings ?? existingEvent?.show_blessings ?? true,
			default_tree_view_mode:
				initialValues.default_tree_view_mode ??
				existingEvent?.default_tree_view_mode ??
				'profile',
		}),
		[existingEvent, initialValues],
	);

	const {
		formData,
		isSubmitting,
		setIsSubmitting,
		handleChange,
		updateFormData,
		resetForm,
	} = useEventForm(mode, existingEvent, mergedInitialValues);

	const { validateForm } = useEventValidation();

	useEffect(() => {
		if (!open) return;
		const client = new ApiClient();
		client
			.getCampaigns(0, 100)
			.then((res) => setCampaigns(res.results ?? []))
			.catch(() => {});
	}, [open]);

	useEffect(() => {
		const loadInitialOrganizer = async () => {
			if (!open) return;
			const initialOrganizerId = mergedInitialValues.assigned_by;
			if (!initialOrganizerId) {
				setSelectedUser(null);
				return;
			}
			try {
				const user = await getUserByIdApi(initialOrganizerId);
				setSelectedUser(
					user || {
						id: initialOrganizerId,
						name: `User ${initialOrganizerId}`,
						email: '',
					},
				);
			} catch {
				setSelectedUser({
					id: initialOrganizerId,
					name: `User ${initialOrganizerId}`,
					email: '',
				});
			}
		};
		loadInitialOrganizer();
	}, [open, mergedInitialValues.assigned_by]);

	const eventTypes = Object.entries(EVENT_TYPE_MAP).map(([value, label]) => ({
		value,
		label,
	}));

	const handleSubmit = async (event) => {
		event.preventDefault();

		const validation = validateForm(formData, mode);
		if (!validation.isValid) {
			alert(validation.error);
			return;
		}

		setIsSubmitting(true);
		try {
			const normalizeTags = (tagsVal) => {
				if (!tagsVal) return [];
				if (Array.isArray(tagsVal)) {
					return Array.from(
						new Set(tagsVal.map((t) => String(t).trim()).filter(Boolean)),
					);
				}
				const cleaned = String(tagsVal)
					.replace(/[\{\}\[\]\"\']/g, '')
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean);
				return Array.from(new Set(cleaned));
			};

			const submissionData = {
				...formData,
				site_id: formData.site_id === '' ? null : formData.site_id,
				group_id: formData.group_id === '' ? null : formData.group_id,
				tags: normalizeTags(formData.tags),
			};

			await onSubmit(submissionData);
			onClose();
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		resetForm();
		setSelectedUser(null);
		onClose();
	};

	const dialogTitle =
		title ?? (mode === 'edit' ? 'Edit Event' : 'Create Event');
	const resolvedSubmitLabel =
		submitLabel ?? (mode === 'edit' ? 'Update Event' : 'Create Event');

	return (
		<ThemeProvider theme={formTheme}>
			<Dialog
				open={open}
				onClose={isSubmitting ? undefined : handleClose}
				fullWidth
				maxWidth="lg"
				scroll="paper"
				PaperProps={{
					sx: {
						overflow: 'hidden',
						borderRadius: 1,
						backgroundColor: formTheme.palette.background.paper,
					},
				}}
			>
				<DialogTitle sx={{ p: 0 }}>
					<Box
						sx={{
							p: 3,
							borderBottom: `1px solid ${formTheme.palette.divider}`,
							backgroundColor: formTheme.palette.background.paper,
						}}
					>
						<Stack spacing={0.75}>
							<Typography variant="h5" sx={{ fontWeight: 700 }}>
								{dialogTitle}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Build the event once, then use the Events module for trees,
								messages, and media associations.
							</Typography>
							{formData.group_id ? (
								<Typography variant="caption" color="text.secondary">
									CSR group: <strong>{formData.group_id}</strong>
								</Typography>
							) : null}
						</Stack>
					</Box>
				</DialogTitle>

				<DialogContent
					sx={{
						backgroundColor: formTheme.palette.background.default,
						px: 3,
						py: 3,
					}}
				>
					<Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
						<Stack spacing={2.5}>
							<SectionCard
								title="Event Basics"
								subtitle="Core identity and where the event lives."
							>
								<Grid container spacing={2} alignItems="stretch">
									<Grid item xs={12} md={6}>
										<TextField
											name="name"
											label="Event Name"
											value={formData.name}
											onChange={handleChange}
											fullWidth
											required={mode === 'add'}
											placeholder="e.g., Infosys CSR Event - April 2026"
										/>
									</Grid>
									<Grid item xs={12} md={3}>
										<TextField
											name="type"
											label="Event Type"
											select
											value={formData.type}
											onChange={handleChange}
											fullWidth
											required={mode === 'add'}
										>
											{eventTypes.map((type) => (
												<MenuItem key={type.value} value={type.value}>
													{type.label}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item xs={12} md={3}>
										<TextField
											name="event_date"
											label="Event Date"
											type="date"
											value={formData.event_date}
											onChange={handleChange}
											fullWidth
											required={mode === 'add'}
											InputLabelProps={{ shrink: true }}
										/>
									</Grid>
									<Grid item xs={12} md={4}>
										<TextField
											name="event_location"
											label="Location Type"
											select
											value={formData.event_location}
											onChange={handleChange}
											fullWidth
											required={mode === 'add'}
										>
											{locationOptions.map((location) => (
												<MenuItem key={location.value} value={location.value}>
													{location.label}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item xs={12} md={8}>
										<TextField
											name="site_id"
											label="Site ID"
											value={formData.site_id}
											onChange={handleChange}
											fullWidth
											placeholder="Optional site identifier"
										/>
									</Grid>
									<Grid item xs={12}>
										<LocationPicker
											value={formData.location ? [formData.location] : []}
											onChange={(locations) => {
												const locationObj =
													Array.isArray(locations) && locations.length > 0
														? locations[0]
														: null;
												handleChange({
													target: {
														name: 'location',
														value: locationObj,
													},
												});
											}}
											label="Location (optional)"
											helperText="Search and pin a precise event location on the map."
											required={false}
											maxLocations={1}
										/>
									</Grid>
								</Grid>
							</SectionCard>

							<SectionCard
								title="Organizer and Links"
								subtitle="Who owns the event and what it is attached to."
							>
								<Grid container spacing={2} alignItems="stretch">
									<Grid item xs={12} md={6}>
										<UserLookupComponent
											{...USER_LOOKUP_PRESETS.EVENT_ORGANIZER}
											value={selectedUser}
											onChange={(user) => {
												setSelectedUser(user);
												updateFormData({
													assigned_by: user ? user.id : '',
												});
											}}
											mode={mode}
											required={mode === 'add'}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										{campaigns.length > 0 ? (
											<TextField
												name="campaign_c_key"
												label="Linked Campaign"
												select
												value={formData.campaign_c_key || ''}
												onChange={handleChange}
												fullWidth
												helperText="Optional: attribute the event to a campaign."
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{campaigns.map((c) => (
													<MenuItem key={c.c_key} value={c.c_key}>
														{c.name}
													</MenuItem>
												))}
											</TextField>
										) : (
											<TextField
												name="group_id"
												label="Group ID"
												value={formData.group_id}
												onChange={handleChange}
												fullWidth
												placeholder="Optional CSR group id"
											/>
										)}
									</Grid>
								</Grid>
							</SectionCard>

							<SectionCard
								title="Content and Media"
								subtitle="Message copy, tags, and landing images."
							>
								<Grid container spacing={2.5} alignItems="stretch">
									<Grid item xs={12} md={6}>
										<TextField
											name="message"
											label="Event Message"
											value={formData.message}
											onChange={handleChange}
											fullWidth
											multiline
											minRows={4}
											placeholder="Welcome message or event details for participants"
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											name="tags"
											label="Tags"
											value={formData.tags}
											onChange={handleChange}
											fullWidth
											multiline
											minRows={4}
											placeholder="Comma-separated tags (e.g., memorial, family, corporate)"
										/>
									</Grid>
									<FileUploadSection
										formData={formData}
										updateFormData={updateFormData}
										isSubmitting={isSubmitting}
										showPoster={false}
										showLandingImage
										showLandingMobile
										showDescriptiveImages={false}
									/>
								</Grid>
							</SectionCard>
						</Stack>
					</Box>
				</DialogContent>

				<DialogActions
					sx={{
						borderTop: `1px solid ${formTheme.palette.divider}`,
						backgroundColor: formTheme.palette.background.paper,
						px: 3,
						py: 2.5,
						gap: 2,
					}}
				>
					<Button onClick={handleClose} disabled={isSubmitting} size="large">
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						onClick={handleSubmit}
						disabled={isSubmitting}
						startIcon={isSubmitting && <CircularProgress size={18} />}
						size="large"
						sx={{ minWidth: 170 }}
					>
						{isSubmitting ? 'Saving...' : resolvedSubmitLabel}
					</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
};

export default EventUpsertDialog;
