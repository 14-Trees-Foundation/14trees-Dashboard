import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Box,
	Alert,
	Tabs,
	Tab,
	IconButton,
	OutlinedInput,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Editor from '@monaco-editor/react';
import type { SurveyConfig } from '../../../../types/surveys';
import VisualBuilder from './formBuilder/VisualBuilder';

interface FormEditorDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: (payload: any) => Promise<void>;
	editingConfig?: SurveyConfig | null;
	mode: 'create' | 'edit';
}

const EMPTY_FORM_TEMPLATE = {
	fields: [
		{
			type: 'text',
			name: 'sample_field',
			label: { en: 'Sample Field', mr: 'नमुना फील्ड' },
			hint: { en: 'Enter text here', mr: 'येथे मजकूर प्रविष्ट करा' },
			required: true,
			readOnly: false,
		},
	],
	choiceLists: {},
};

const AVAILABLE_PERMISSIONS = [
	'admin',
	'fieldstaff',
	'supervisor',
	'field_worker',
];

const inputSx = {
	'& .MuiOutlinedInput-root': {
		bgcolor: '#0f1219',
		color: '#e8eaf0',
		'& fieldset': { borderColor: '#2a3832' },
		'&:hover fieldset': { borderColor: '#9bc53d' },
		'&.Mui-focused fieldset': { borderColor: '#9bc53d' },
	},
	'& .MuiInputLabel-root': { color: '#9ba39d' },
	'& .MuiInputLabel-root.Mui-focused': { color: '#9bc53d' },
	'& .MuiFormHelperText-root': { color: '#9ba39d' },
};

const selectSx = {
	bgcolor: '#0f1219',
	color: '#e8eaf0',
	'& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a3832' },
	'&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9bc53d' },
	'&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#9bc53d' },
	'& .MuiSvgIcon-root': { color: '#9ba39d' },
};

// tab indices
const TAB_BASIC = 0;
const TAB_VISUAL = 1;
const TAB_JSON = 2;

const FormEditorDialog: React.FC<FormEditorDialogProps> = ({
	open,
	onClose,
	onSave,
	editingConfig,
	mode,
}) => {
	const [tab, setTab] = useState(TAB_BASIC);
	const [formTitle, setFormTitle] = useState('');
	const [surveyId, setSurveyId] = useState('');
	const [autoGenerateId, setAutoGenerateId] = useState(true);
	const [permissions, setPermissions] = useState<string[]>(['admin']);
	const [status, setStatus] = useState<'draft' | 'active'>('draft');
	// Source of truth for form structure (object form)
	const [formStructure, setFormStructure] = useState<any>(EMPTY_FORM_TEMPLATE);
	// JSON text kept in sync — only authoritative when JSON tab is active
	const [formStructureJson, setFormStructureJson] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [validationErrors, setValidationErrors] = useState<
		Array<{ field: string; message: string }>
	>([]);
	const [saving, setSaving] = useState(false);

	// Reset state whenever dialog opens
	useEffect(() => {
		if (!open) return;
		const structure =
			mode === 'edit' && editingConfig
				? editingConfig.formStructure
				: EMPTY_FORM_TEMPLATE;

		if (mode === 'edit' && editingConfig) {
			setFormTitle(editingConfig.formTitle);
			setSurveyId(editingConfig.surveyId);
			setAutoGenerateId(false);
			setPermissions(editingConfig.permissions);
			setStatus(
				editingConfig.status === 'archived' ? 'draft' : editingConfig.status,
			);
		} else {
			setFormTitle('');
			setSurveyId('');
			setAutoGenerateId(true);
			setPermissions(['admin']);
			setStatus('draft');
		}

		setFormStructure(structure);
		setFormStructureJson(JSON.stringify(structure, null, 2));
		setError(null);
		setValidationErrors([]);
		setTab(TAB_BASIC);
	}, [open, mode, editingConfig]);

	// When switching TO the JSON tab, serialise the current structure
	const handleTabChange = (_: any, newTab: number) => {
		if (newTab === TAB_JSON) {
			setFormStructureJson(JSON.stringify(formStructure, null, 2));
		}
		setTab(newTab);
	};

	// Visual Builder → update both object and JSON string
	const handleVisualBuilderChange = (updated: any) => {
		setFormStructure(updated);
		setFormStructureJson(JSON.stringify(updated, null, 2));
	};

	// JSON editor → update both JSON string and object (if valid)
	const handleJsonEditorChange = (value: string | undefined) => {
		const text = value || '';
		setFormStructureJson(text);
		try {
			const parsed = JSON.parse(text);
			setFormStructure(parsed);
		} catch {
			// Let the user keep typing; we'll validate on Save
		}
	};

	const handleSave = async () => {
		setError(null);
		setValidationErrors([]);
		setSaving(true);

		try {
			// If we're on the JSON tab, re-parse to catch syntax errors explicitly
			let parsedStructure = formStructure;
			if (tab === TAB_JSON) {
				try {
					parsedStructure = JSON.parse(formStructureJson);
				} catch {
					setError('Invalid JSON syntax in form structure');
					setSaving(false);
					return;
				}
			}

			const payload: any = {
				formTitle,
				permissions,
				formStructure: parsedStructure,
				status,
			};

			if (mode === 'create') {
				payload.autoGenerateId = autoGenerateId;
				if (!autoGenerateId && surveyId) {
					payload.surveyId = surveyId;
				}
			}

			await onSave(payload);
			onClose();
		} catch (err: any) {
			setError(
				err.response?.data?.error || err.message || 'Failed to save form',
			);
			if (err.response?.data?.validationErrors) {
				setValidationErrors(err.response.data.validationErrors);
			}
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="xl"
			fullWidth
			PaperProps={{
				sx: {
					bgcolor: '#1a2820',
					color: '#e8eaf0',
					height: '92vh',
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			<DialogTitle
				sx={{
					display: 'flex',
					alignItems: 'center',
					borderBottom: '1px solid #2a3832',
					py: 1.5,
				}}
			>
				<Box sx={{ flex: 1, fontSize: '1.05rem', fontWeight: 600 }}>
					{mode === 'create'
						? 'Create New Survey Form'
						: `Edit: ${editingConfig?.formTitle}`}
				</Box>
				<IconButton onClick={onClose} size="small" sx={{ color: '#9ba39d' }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<Tabs
				value={tab}
				onChange={handleTabChange}
				sx={{
					borderBottom: '1px solid #2a3832',
					flexShrink: 0,
					'& .MuiTab-root': {
						color: '#9ba39d',
						textTransform: 'none',
						fontSize: '0.85rem',
						'&.Mui-selected': { color: '#9bc53d' },
					},
					'& .MuiTabs-indicator': { backgroundColor: '#9bc53d' },
				}}
			>
				<Tab label="Basic Info" />
				<Tab label="Visual Builder" />
				<Tab label="JSON Editor" />
			</Tabs>

			<DialogContent
				sx={{
					flex: 1,
					overflow: 'auto',
					p: tab === TAB_VISUAL ? 2 : 3,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{(error || validationErrors.length > 0) && (
					<Box sx={{ mb: 2, flexShrink: 0 }}>
						{error && (
							<Alert
								severity="error"
								sx={{ mb: validationErrors.length > 0 ? 1 : 0 }}
							>
								{error}
							</Alert>
						)}
						{validationErrors.length > 0 && (
							<Alert severity="error">
								<strong>Validation Errors:</strong>
								<ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
									{validationErrors.map((ve, idx) => (
										<li key={idx}>
											<strong>{ve.field}:</strong> {ve.message}
										</li>
									))}
								</ul>
							</Alert>
						)}
					</Box>
				)}

				{/* Tab 0: Basic Info */}
				{tab === TAB_BASIC && (
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
						<TextField
							label="Form Title"
							value={formTitle}
							onChange={(e) => setFormTitle(e.target.value)}
							required
							fullWidth
							sx={inputSx}
						/>

						{mode === 'create' && (
							<>
								<Box sx={{ display: 'flex', gap: 2 }}>
									<Button
										variant={autoGenerateId ? 'contained' : 'outlined'}
										onClick={() => setAutoGenerateId(true)}
										sx={{
											bgcolor: autoGenerateId ? '#9bc53d' : 'transparent',
											color: autoGenerateId ? '#0f1912' : '#9bc53d',
											borderColor: '#9bc53d',
											textTransform: 'none',
											'&:hover': {
												bgcolor: autoGenerateId
													? '#8ab02d'
													: 'rgba(155,197,61,0.1)',
											},
										}}
									>
										Auto-generate ID
									</Button>
									<Button
										variant={!autoGenerateId ? 'contained' : 'outlined'}
										onClick={() => setAutoGenerateId(false)}
										sx={{
											bgcolor: !autoGenerateId ? '#9bc53d' : 'transparent',
											color: !autoGenerateId ? '#0f1912' : '#9bc53d',
											borderColor: '#9bc53d',
											textTransform: 'none',
											'&:hover': {
												bgcolor: !autoGenerateId
													? '#8ab02d'
													: 'rgba(155,197,61,0.1)',
											},
										}}
									>
										Custom ID
									</Button>
								</Box>

								{!autoGenerateId && (
									<TextField
										label="Survey ID"
										value={surveyId}
										onChange={(e) => setSurveyId(e.target.value)}
										required
										fullWidth
										helperText="Lowercase alphanumeric with underscores only (e.g., plant_survey_v3)"
										sx={inputSx}
									/>
								)}
							</>
						)}

						<FormControl fullWidth>
							<InputLabel
								sx={{ color: '#9ba39d', '&.Mui-focused': { color: '#9bc53d' } }}
							>
								Permissions
							</InputLabel>
							<Select
								multiple
								value={permissions}
								onChange={(e) => setPermissions(e.target.value as string[])}
								input={<OutlinedInput label="Permissions" />}
								renderValue={(selected) => (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
										{selected.map((v) => (
											<Chip
												key={v}
												label={v}
												size="small"
												sx={{ bgcolor: '#2a3832', color: '#9bc53d' }}
											/>
										))}
									</Box>
								)}
								sx={selectSx}
							>
								{AVAILABLE_PERMISSIONS.map((perm) => (
									<MenuItem key={perm} value={perm}>
										{perm}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel
								sx={{ color: '#9ba39d', '&.Mui-focused': { color: '#9bc53d' } }}
							>
								Status
							</InputLabel>
							<Select
								value={status}
								label="Status"
								onChange={(e) =>
									setStatus(e.target.value as 'draft' | 'active')
								}
								sx={selectSx}
							>
								<MenuItem value="draft">Draft</MenuItem>
								<MenuItem value="active">Active</MenuItem>
							</Select>
						</FormControl>
					</Box>
				)}

				{/* Tab 1: Visual Builder */}
				{tab === TAB_VISUAL && (
					<Box sx={{ flex: 1, minHeight: 0 }}>
						<VisualBuilder
							formStructure={formStructure}
							onChange={handleVisualBuilderChange}
						/>
					</Box>
				)}

				{/* Tab 2: JSON Editor */}
				{tab === TAB_JSON && (
					<Box
						sx={{
							flex: 1,
							minHeight: 420,
							border: '1px solid #2a3832',
							borderRadius: 1,
							overflow: 'hidden',
						}}
					>
						<Editor
							height="100%"
							defaultLanguage="json"
							value={formStructureJson}
							onChange={handleJsonEditorChange}
							theme="vs-dark"
							options={{
								minimap: { enabled: false },
								fontSize: 13,
								scrollBeyondLastLine: false,
								formatOnPaste: true,
								formatOnType: true,
								tabSize: 2,
							}}
						/>
					</Box>
				)}
			</DialogContent>

			<DialogActions
				sx={{ borderTop: '1px solid #2a3832', px: 3, py: 2, flexShrink: 0 }}
			>
				<Button
					onClick={onClose}
					sx={{ color: '#9ba39d', textTransform: 'none' }}
				>
					Cancel
				</Button>
				<Button
					onClick={handleSave}
					disabled={saving || !formTitle}
					variant="contained"
					sx={{
						bgcolor: '#9bc53d',
						color: '#0f1912',
						textTransform: 'none',
						'&:hover': { bgcolor: '#8ab02d' },
						'&:disabled': { bgcolor: '#2a3832', color: '#6b7a6e' },
					}}
				>
					{saving
						? 'Saving...'
						: mode === 'create'
						? 'Create Form'
						: 'Save Changes'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default FormEditorDialog;
