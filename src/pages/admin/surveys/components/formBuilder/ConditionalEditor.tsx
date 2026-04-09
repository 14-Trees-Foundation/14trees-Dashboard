import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	Typography,
	RadioGroup,
	FormControlLabel,
	Radio,
	Select,
	MenuItem,
	TextField,
	IconButton,
	Divider,
	FormControl,
	Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	ConditionalRule,
	ConditionClause,
	ConditionalOp,
	SurveyField,
} from './formBuilderTypes';

interface ConditionalEditorProps {
	open: boolean;
	onClose: () => void;
	targetLabel: string;
	rule: ConditionalRule | undefined;
	requiredIf: ConditionalRule | undefined;
	allFields: SurveyField[];
	onSave: (
		rule: ConditionalRule | undefined,
		requiredIf: ConditionalRule | undefined,
	) => void;
}

const OPERATORS: { value: ConditionalOp; label: string }[] = [
	{ value: 'eq', label: 'equals' },
	{ value: 'neq', label: 'not equals' },
	{ value: 'in', label: 'is one of' },
	{ value: 'not_in', label: 'is not one of' },
	{ value: 'gt', label: '>' },
	{ value: 'lt', label: '<' },
	{ value: 'gte', label: '>=' },
	{ value: 'lte', label: '<=' },
	{ value: 'exists', label: 'has any value' },
	{ value: 'not_exists', label: 'has no value' },
];

const inputSx = {
	'& .MuiOutlinedInput-root': {
		bgcolor: '#0d1017',
		color: '#e8eaf0',
		fontSize: '0.85rem',
		'& fieldset': { borderColor: '#2a3832' },
		'&:hover fieldset': { borderColor: '#9bc53d' },
		'&.Mui-focused fieldset': { borderColor: '#9bc53d' },
	},
	'& .MuiInputLabel-root': { color: '#9ba39d', fontSize: '0.85rem' },
	'& .MuiInputLabel-root.Mui-focused': { color: '#9bc53d' },
};

const selectSx = {
	bgcolor: '#0d1017',
	color: '#e8eaf0',
	fontSize: '0.82rem',
	'& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a3832' },
	'&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9bc53d' },
	'&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#9bc53d' },
	'& .MuiSvgIcon-root': { color: '#9ba39d' },
};

const EMPTY_CLAUSE: ConditionClause = { field: '', op: 'eq', value: '' };

function ruleToState(rule: ConditionalRule | undefined): ConditionClause[] {
	if (!rule) return [{ ...EMPTY_CLAUSE }];
	const clauses = rule.all || rule.any || [];
	return clauses.length > 0
		? clauses.map((c) => ({ ...c }))
		: [{ ...EMPTY_CLAUSE }];
}

function previewText(clauses: ConditionClause[]): string {
	const valid = clauses.filter((c) => c.field && c.op);
	if (valid.length === 0) return '';
	return (
		'Show when ' +
		valid
			.map((c) => {
				const opLabel = OPERATORS.find((o) => o.value === c.op)?.label || c.op;
				const noValue = c.op === 'exists' || c.op === 'not_exists';
				return `"${c.field}" ${opLabel}${noValue ? '' : ` "${c.value}"`}`;
			})
			.join(' AND ')
	);
}

const ConditionalEditor: React.FC<ConditionalEditorProps> = ({
	open,
	onClose,
	targetLabel,
	rule,
	requiredIf,
	allFields,
	onSave,
}) => {
	const [mode, setMode] = useState<'always' | 'conditional'>('always');
	const [clauses, setClauses] = useState<ConditionClause[]>([
		{ ...EMPTY_CLAUSE },
	]);
	const [makeRequiredIfVisible, setMakeRequiredIfVisible] = useState(false);

	useEffect(() => {
		if (!open) return;
		setMode(rule ? 'conditional' : 'always');
		setClauses(ruleToState(rule));
		setMakeRequiredIfVisible(!!requiredIf);
	}, [open, rule, requiredIf]);

	const updateClause = (idx: number, patch: Partial<ConditionClause>) => {
		setClauses((prev) =>
			prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
		);
	};

	const addClause = () => setClauses((prev) => [...prev, { ...EMPTY_CLAUSE }]);
	const removeClause = (idx: number) =>
		setClauses((prev) => prev.filter((_, i) => i !== idx));

	const handleSave = () => {
		if (mode === 'always') {
			onSave(undefined, undefined);
			return;
		}
		const valid = clauses.filter((c) => c.field && c.op);
		const built: ConditionalRule = valid.length > 0 ? { all: valid } : {};
		onSave(built, makeRequiredIfVisible ? built : undefined);
	};

	const preview = mode === 'conditional' ? previewText(clauses) : '';

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{ sx: { bgcolor: '#1a2820', color: '#e8eaf0' } }}
		>
			<DialogTitle
				sx={{ borderBottom: '1px solid #2a3832', py: 1.5, fontSize: '0.95rem' }}
			>
				Conditional Logic —{' '}
				<Box component="span" sx={{ color: '#9bc53d' }}>
					{targetLabel}
				</Box>
			</DialogTitle>

			<DialogContent
				sx={{ pt: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}
			>
				<RadioGroup
					value={mode}
					onChange={(e) => setMode(e.target.value as 'always' | 'conditional')}
				>
					<FormControlLabel
						value="always"
						control={
							<Radio
								size="small"
								sx={{ color: '#9ba39d', '&.Mui-checked': { color: '#9bc53d' } }}
							/>
						}
						label={
							<Typography sx={{ fontSize: '0.875rem', color: '#e8eaf0' }}>
								Always show
							</Typography>
						}
					/>
					<FormControlLabel
						value="conditional"
						control={
							<Radio
								size="small"
								sx={{ color: '#9ba39d', '&.Mui-checked': { color: '#9bc53d' } }}
							/>
						}
						label={
							<Typography sx={{ fontSize: '0.875rem', color: '#e8eaf0' }}>
								Show only if conditions are met
							</Typography>
						}
					/>
				</RadioGroup>

				{mode === 'conditional' && (
					<>
						<Divider sx={{ borderColor: '#2a3832' }} />
						<Typography
							sx={{
								fontSize: '0.78rem',
								color: '#9ba39d',
								fontWeight: 600,
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
							}}
						>
							All of the following must be true:
						</Typography>

						{clauses.map((clause, idx) => (
							<Box
								key={idx}
								sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
							>
								{/* Field */}
								<FormControl size="small" sx={{ flex: 2, minWidth: 0 }}>
									<Select
										value={clause.field}
										onChange={(e) =>
											updateClause(idx, { field: e.target.value })
										}
										displayEmpty
										sx={selectSx}
									>
										<MenuItem value="" disabled>
											<em style={{ color: '#6b7a6e' }}>Field</em>
										</MenuItem>
										{allFields.map((f) => (
											<MenuItem
												key={f.name}
												value={f.name}
												sx={{ fontSize: '0.82rem' }}
											>
												{f.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								{/* Operator */}
								<FormControl size="small" sx={{ flex: 2, minWidth: 0 }}>
									<Select
										value={clause.op}
										onChange={(e) =>
											updateClause(idx, { op: e.target.value as ConditionalOp })
										}
										sx={selectSx}
									>
										{OPERATORS.map((o) => (
											<MenuItem
												key={o.value}
												value={o.value}
												sx={{ fontSize: '0.82rem' }}
											>
												{o.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								{/* Value */}
								{clause.op !== 'exists' && clause.op !== 'not_exists' && (
									<TextField
										size="small"
										placeholder="Value"
										value={clause.value ?? ''}
										onChange={(e) =>
											updateClause(idx, { value: e.target.value })
										}
										sx={{ flex: 2, ...inputSx }}
									/>
								)}

								<IconButton
									size="small"
									onClick={() => removeClause(idx)}
									disabled={clauses.length === 1}
									sx={{
										color: '#6b7a6e',
										'&:hover': { color: '#ef5350' },
										flexShrink: 0,
									}}
								>
									<DeleteIcon sx={{ fontSize: 17 }} />
								</IconButton>
							</Box>
						))}

						<Button
							startIcon={<AddIcon />}
							onClick={addClause}
							size="small"
							sx={{
								alignSelf: 'flex-start',
								color: '#9bc53d',
								textTransform: 'none',
								fontSize: '0.8rem',
								px: 0,
							}}
						>
							Add condition
						</Button>

						{preview && (
							<Box
								sx={{
									bgcolor: '#0d1017',
									border: '1px solid #2a3832',
									borderRadius: 1,
									p: 1.5,
								}}
							>
								<Typography
									sx={{
										fontSize: '0.78rem',
										color: '#9ba39d',
										fontStyle: 'italic',
									}}
								>
									{preview}
								</Typography>
							</Box>
						)}

						<Divider sx={{ borderColor: '#2a3832' }} />

						<FormControlLabel
							control={
								<Checkbox
									checked={makeRequiredIfVisible}
									onChange={(e) => setMakeRequiredIfVisible(e.target.checked)}
									size="small"
									sx={{
										color: '#9ba39d',
										'&.Mui-checked': { color: '#9bc53d' },
									}}
								/>
							}
							label={
								<Typography sx={{ fontSize: '0.85rem', color: '#e8eaf0' }}>
									Make required when visible
								</Typography>
							}
						/>
					</>
				)}
			</DialogContent>

			<DialogActions sx={{ borderTop: '1px solid #2a3832', px: 3, py: 2 }}>
				<Button
					onClick={onClose}
					sx={{ color: '#9ba39d', textTransform: 'none' }}
				>
					Cancel
				</Button>
				<Button
					onClick={handleSave}
					variant="contained"
					sx={{
						bgcolor: '#9bc53d',
						color: '#0f1912',
						textTransform: 'none',
						'&:hover': { bgcolor: '#8ab02d' },
					}}
				>
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConditionalEditor;
