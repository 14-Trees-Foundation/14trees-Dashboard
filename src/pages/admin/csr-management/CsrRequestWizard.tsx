import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Typography,
	Button,
	Stepper,
	Step,
	StepLabel,
	TextField,
	Autocomplete,
	CircularProgress,
	Paper,
	Divider,
} from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { toast } from 'react-toastify';
import { darkTheme, lightAnalyticsTheme } from '../../../theme';
import {
	analyticsPageSx,
	ANALYTICS_COLORS,
	LIGHT_ANALYTICS_COLORS,
	FORM_COLORS,
	formLabelSx,
	formSectionTitleSx,
	formHelperTextSx,
	csrWizardStepSx,
} from '../shared/adminTheme';
import ApiClient from '../../../api/apiClient/apiClient';

const THEME_KEY = 'csr_management_theme';

function deriveFinancialYear(dateStr: string): string {
	if (!dateStr) return '';
	const d = new Date(dateStr);
	const m = d.getMonth() + 1;
	const y = d.getFullYear();
	return m >= 4
		? `${y}-${String(y + 1).slice(2)}`
		: `${y - 1}-${String(y).slice(2)}`;
}

// ── Step 1: Corporate & Donation Details ──────────────────────────────────────
interface Step1Data {
	group: any | null;
	no_of_trees: string;
	donation_date: string;
	amount_received: string;
	amount_per_tree: string;
	contact_person: string;
	contact_email: string;
	notes: string;
}

const Step1: React.FC<{
	data: Step1Data;
	onChange: (d: Step1Data) => void;
	isLight: boolean;
}> = ({ data, onChange, isLight }) => {
	const theme = useTheme();
	const colors = isLight ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;
	const [groups, setGroups] = useState<any[]>([]);
	const [searching, setSearching] = useState(false);
	const fieldBg = isLight ? FORM_COLORS.fieldBg : '#1a2820';
	const borderColor = isLight ? FORM_COLORS.border : '#2a3832';

	const searchGroups = async (q: string) => {
		if (!q || q.length < 2) return;
		setSearching(true);
		const api = new ApiClient();
		const result = await api.getGroups(0, 20, [
			{ columnField: 'name', operatorValue: 'contains', value: q },
			{ columnField: 'type', operatorValue: 'equals', value: 'corporate' },
		]);
		setGroups(result.results ?? []);
		setSearching(false);
	};

	const fy = deriveFinancialYear(data.donation_date);
	const autoPerTree =
		data.amount_received && data.no_of_trees
			? (
					parseFloat(data.amount_received) / parseFloat(data.no_of_trees)
			  ).toFixed(2)
			: '';

	const fieldSx = {
		'& .MuiOutlinedInput-root': {
			backgroundColor: fieldBg,
			'& fieldset': { borderColor },
			'&:hover fieldset': { borderColor: FORM_COLORS.borderFocus },
			'&.Mui-focused fieldset': { borderColor: FORM_COLORS.borderFocus },
		},
	};

	const row = (label: string, content: React.ReactNode, helper?: string) => (
		<Box>
			<Typography component="label" sx={formLabelSx}>
				{label}
			</Typography>
			{content}
			{helper && <Typography sx={formHelperTextSx}>{helper}</Typography>}
		</Box>
	);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
			<Typography sx={formSectionTitleSx}>Corporate & Commitment</Typography>

			{row(
				'Corporate Group *',
				<Autocomplete
					options={groups}
					getOptionLabel={(o: any) => o.name}
					value={data.group}
					onChange={(_, v) => onChange({ ...data, group: v })}
					onInputChange={(_, q) => searchGroups(q)}
					loading={searching}
					renderInput={(params) => (
						<TextField
							{...params}
							size="small"
							placeholder="Search corporate…"
							sx={fieldSx}
						/>
					)}
				/>,
			)}

			<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
				{row(
					'No. of Trees *',
					<TextField
						fullWidth
						size="small"
						type="number"
						value={data.no_of_trees}
						onChange={(e) => onChange({ ...data, no_of_trees: e.target.value })}
						placeholder="10000"
						sx={fieldSx}
					/>,
				)}
				{row(
					'Donation Date',
					<TextField
						fullWidth
						size="small"
						type="date"
						value={data.donation_date}
						onChange={(e) =>
							onChange({ ...data, donation_date: e.target.value })
						}
						sx={fieldSx}
						InputLabelProps={{ shrink: true }}
					/>,
					fy ? `Financial Year: ${fy}` : '',
				)}
			</Box>

			<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
				{row(
					'Amount Received (₹)',
					<TextField
						fullWidth
						size="small"
						type="number"
						value={data.amount_received}
						onChange={(e) =>
							onChange({ ...data, amount_received: e.target.value })
						}
						placeholder="500000"
						sx={fieldSx}
					/>,
				)}
				{row(
					'Amount / Tree (₹)',
					<TextField
						fullWidth
						size="small"
						type="number"
						value={data.amount_per_tree || autoPerTree}
						onChange={(e) =>
							onChange({ ...data, amount_per_tree: e.target.value })
						}
						placeholder={autoPerTree || 'Auto-calculated'}
						sx={fieldSx}
					/>,
					autoPerTree && !data.amount_per_tree
						? `Auto-calculated: ₹${autoPerTree}`
						: '',
				)}
			</Box>

			<Divider sx={{ borderColor: isLight ? FORM_COLORS.border : '#2a3832' }} />
			<Typography sx={formSectionTitleSx}>Contact</Typography>
			<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
				{row(
					'Contact Person',
					<TextField
						fullWidth
						size="small"
						value={data.contact_person}
						onChange={(e) =>
							onChange({ ...data, contact_person: e.target.value })
						}
						sx={fieldSx}
					/>,
				)}
				{row(
					'Contact Email',
					<TextField
						fullWidth
						size="small"
						type="email"
						value={data.contact_email}
						onChange={(e) =>
							onChange({ ...data, contact_email: e.target.value })
						}
						sx={fieldSx}
					/>,
				)}
			</Box>
			{row(
				'Notes',
				<TextField
					fullWidth
					size="small"
					multiline
					rows={2}
					value={data.notes}
					onChange={(e) => onChange({ ...data, notes: e.target.value })}
					sx={fieldSx}
				/>,
			)}
		</Box>
	);
};

// ── Step 2: Allocation Type ───────────────────────────────────────────────────
interface Step2Data {
	allocation_type: 'plantation' | 'mixed';
	event_trees: string;
}

const Step2: React.FC<{
	data: Step2Data;
	onChange: (d: Step2Data) => void;
	noOfTrees: number;
	isLight: boolean;
}> = ({ data, onChange, noOfTrees, isLight }) => {
	const colors = isLight ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;
	const cardBase = {
		borderRadius: 2,
		p: 2,
		cursor: 'pointer',
		border: '2px solid',
		transition: 'all 0.15s',
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
			<Typography sx={formSectionTitleSx}>Allocation Type</Typography>
			<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
				{(['plantation', 'mixed'] as const).map((type) => (
					<Box
						key={type}
						sx={{
							...cardBase,
							backgroundColor:
								data.allocation_type === type
									? isLight
										? '#f0fdf4'
										: '#0d2b1a'
									: isLight
									? '#fafaf8'
									: '#1a2820',
							borderColor:
								data.allocation_type === type
									? FORM_COLORS.accent
									: isLight
									? FORM_COLORS.border
									: '#2a3832',
						}}
						onClick={() => onChange({ ...data, allocation_type: type })}
					>
						<Typography
							variant="subtitle2"
							sx={{
								fontWeight: 700,
								color:
									data.allocation_type === type
										? FORM_COLORS.accent
										: colors.textOnDark,
							}}
						>
							{type === 'plantation'
								? 'Plantation Only'
								: 'Plantation + Events'}
						</Typography>
						<Typography variant="caption" sx={{ color: colors.textMuted }}>
							{type === 'plantation'
								? 'All trees booked for plantation drive'
								: 'Split between plantation and corporate events'}
						</Typography>
					</Box>
				))}
			</Box>

			{data.allocation_type === 'mixed' && (
				<Box>
					<Typography component="label" sx={formLabelSx}>
						Event Tree Count
					</Typography>
					<TextField
						fullWidth
						size="small"
						type="number"
						value={data.event_trees}
						onChange={(e) => onChange({ ...data, event_trees: e.target.value })}
						helperText={
							data.event_trees
								? `Plantation trees: ${
										noOfTrees - parseInt(data.event_trees || '0')
								  }`
								: ''
						}
					/>
				</Box>
			)}
		</Box>
	);
};

// ── Step 3: Review & Submit ───────────────────────────────────────────────────
const Step3: React.FC<{ s1: Step1Data; s2: Step2Data; isLight: boolean }> = ({
	s1,
	s2,
	isLight,
}) => {
	const colors = isLight ? LIGHT_ANALYTICS_COLORS : ANALYTICS_COLORS;
	const fy = deriveFinancialYear(s1.donation_date);
	const autoPerTree =
		s1.amount_received && s1.no_of_trees
			? (parseFloat(s1.amount_received) / parseFloat(s1.no_of_trees)).toFixed(2)
			: '—';

	const rows = [
		{ label: 'Corporate', value: s1.group?.name ?? '—' },
		{ label: 'Financial Year', value: fy || '—' },
		{
			label: 'Trees Committed',
			value: s1.no_of_trees ? parseInt(s1.no_of_trees).toLocaleString() : '—',
		},
		{
			label: 'Donation Date',
			value: s1.donation_date
				? new Date(s1.donation_date).toLocaleDateString()
				: '—',
		},
		{
			label: 'Amount',
			value: s1.amount_received
				? `₹${parseInt(s1.amount_received).toLocaleString()}`
				: '—',
		},
		{
			label: 'Amount/Tree',
			value: s1.amount_per_tree
				? `₹${parseFloat(s1.amount_per_tree).toFixed(2)}`
				: `₹${autoPerTree}`,
		},
		{
			label: 'Allocation',
			value:
				s2.allocation_type === 'mixed'
					? `Plantation + ${s2.event_trees} event trees`
					: 'Plantation only',
		},
		{ label: 'Contact', value: s1.contact_person || '—' },
	];

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			<Typography sx={formSectionTitleSx}>Review before submitting</Typography>
			{rows.map((r) => (
				<Box
					key={r.label}
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						py: 0.75,
						borderBottom: `1px solid ${
							isLight ? FORM_COLORS.border : '#2a3832'
						}`,
					}}
				>
					<Typography variant="caption" sx={{ color: colors.textMuted }}>
						{r.label}
					</Typography>
					<Typography
						variant="caption"
						sx={{ fontWeight: 600, color: colors.textOnDark }}
					>
						{r.value}
					</Typography>
				</Box>
			))}
		</Box>
	);
};

// ── Wizard shell ──────────────────────────────────────────────────────────────
const STEPS = ['Details', 'Allocation', 'Review'];

const WizardContent: React.FC<{
	themeMode: 'dark' | 'light';
	onToggle: () => void;
}> = ({ themeMode, onToggle }) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const isLight = themeMode === 'light';
	const [step, setStep] = useState(0);
	const [submitting, setSubmitting] = useState(false);

	const [s1, setS1] = useState<Step1Data>({
		group: null,
		no_of_trees: '',
		donation_date: '',
		amount_received: '',
		amount_per_tree: '',
		contact_person: '',
		contact_email: '',
		notes: '',
	});
	const [s2, setS2] = useState<Step2Data>({
		allocation_type: 'plantation',
		event_trees: '',
	});

	const canNext =
		step === 0 ? !!(s1.group && s1.no_of_trees) : step === 1 ? true : true;

	const submit = async () => {
		setSubmitting(true);
		try {
			const api = new ApiClient();
			const payload: any = {
				group_id: s1.group?.id,
				no_of_trees: parseInt(s1.no_of_trees),
				donation_date: s1.donation_date || undefined,
				amount_received: s1.amount_received
					? parseFloat(s1.amount_received)
					: undefined,
				amount_per_tree: s1.amount_per_tree
					? parseFloat(s1.amount_per_tree)
					: undefined,
				contact_person: s1.contact_person || undefined,
				contact_email: s1.contact_email || undefined,
				notes: s1.notes || undefined,
			};
			const created = await api.createCsrRequest(payload);
			toast.success('CSR request created');
			navigate(`/admin/csr-management/requests/${created.id}`);
		} catch {
			setSubmitting(false);
		}
	};

	return (
		<Box
			sx={{
				...analyticsPageSx,
				m: -2,
				minHeight: '100vh',
				backgroundColor: theme.palette.background.default,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mb: 3,
				}}
			>
				<Button
					startIcon={<ArrowBackIcon />}
					size="small"
					sx={{ textTransform: 'none', color: theme.palette.text.secondary }}
					onClick={() => navigate('/admin/csr-management')}
				>
					Back
				</Button>
				<Typography
					variant="h6"
					sx={{ fontWeight: 700, color: theme.palette.text.primary }}
				>
					New CSR Request
				</Typography>
				<Button
					size="small"
					onClick={onToggle}
					sx={{ color: theme.palette.text.secondary, minWidth: 0, p: 1 }}
				>
					{isLight ? <Brightness4Icon /> : <Brightness7Icon />}
				</Button>
			</Box>

			<Paper
				elevation={0}
				sx={{
					maxWidth: 640,
					mx: 'auto',
					p: 3,
					borderRadius: 3,
					backgroundColor: isLight ? '#ffffff' : '#1a2820',
					border: `1px solid ${isLight ? FORM_COLORS.border : '#2a3832'}`,
				}}
			>
				<Stepper activeStep={step} sx={{ ...csrWizardStepSx, mb: 3 }}>
					{STEPS.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				<Box sx={{ minHeight: 320 }}>
					{step === 0 && <Step1 data={s1} onChange={setS1} isLight={isLight} />}
					{step === 1 && (
						<Step2
							data={s2}
							onChange={setS2}
							noOfTrees={parseInt(s1.no_of_trees) || 0}
							isLight={isLight}
						/>
					)}
					{step === 2 && <Step3 s1={s1} s2={s2} isLight={isLight} />}
				</Box>

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						mt: 3,
						pt: 2,
						borderTop: `1px solid ${isLight ? FORM_COLORS.border : '#2a3832'}`,
					}}
				>
					<Button
						disabled={step === 0}
						onClick={() => setStep((s) => s - 1)}
						sx={{ textTransform: 'none' }}
					>
						Back
					</Button>
					{step < STEPS.length - 1 ? (
						<Button
							variant="contained"
							disabled={!canNext}
							endIcon={<ArrowForwardIcon />}
							onClick={() => setStep((s) => s + 1)}
							sx={{ textTransform: 'none', fontWeight: 600 }}
						>
							Next
						</Button>
					) : (
						<Button
							variant="contained"
							disabled={submitting}
							startIcon={
								submitting ? <CircularProgress size={16} /> : <CheckIcon />
							}
							onClick={submit}
							sx={{
								textTransform: 'none',
								fontWeight: 600,
								backgroundColor: FORM_COLORS.accent,
							}}
						>
							Create Request
						</Button>
					)}
				</Box>
			</Paper>
		</Box>
	);
};

const CsrRequestWizard: React.FC = () => {
	const [themeMode, setThemeMode] = useState<'dark' | 'light'>(
		() => (localStorage.getItem(THEME_KEY) as 'dark' | 'light') ?? 'light',
	);
	const toggle = () => {
		const next = themeMode === 'dark' ? 'light' : 'dark';
		setThemeMode(next);
		localStorage.setItem(THEME_KEY, next);
	};
	return (
		<ThemeProvider
			theme={themeMode === 'dark' ? darkTheme : lightAnalyticsTheme}
		>
			<WizardContent themeMode={themeMode} onToggle={toggle} />
		</ThemeProvider>
	);
};

export default CsrRequestWizard;
