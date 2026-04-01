import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
	Box,
	Typography,
	Chip,
	Autocomplete,
	TextField,
	CircularProgress,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import ApiClient from '../../../api/apiClient/apiClient';
import { toast } from 'react-toastify';

interface AssignedSite {
	id: number;
	name_english: string;
}

interface Props {
	userId: number;
	hasViewAll: boolean;
}

export const AssignedSitesPanel: React.FC<Props> = ({ userId, hasViewAll }) => {
	const api = new ApiClient();

	const [assignedSites, setAssignedSites] = useState<AssignedSite[]>([]);
	const [loadingAssigned, setLoadingAssigned] = useState(false);

	const [searchInput, setSearchInput] = useState('');
	const [searchResults, setSearchResults] = useState<AssignedSite[]>([]);
	const [searching, setSearching] = useState(false);
	const [adding, setAdding] = useState(false);
	const [removingId, setRemovingId] = useState<number | null>(null);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const loadAssigned = useCallback(async () => {
		setLoadingAssigned(true);
		try {
			const data = await api.getUserSites(userId);
			setAssignedSites(data.sites || []);
		} catch (err: any) {
			// 500/404 from the sites endpoint (e.g. no entries in user_site_access table)
			// — show empty state rather than an error toast
			if (err?.response?.status >= 500 || err?.response?.status === 404) {
				setAssignedSites([]);
			} else {
				toast.error('Failed to load assigned sites');
			}
		} finally {
			setLoadingAssigned(false);
		}
	}, [userId]);

	useEffect(() => {
		if (!hasViewAll) {
			loadAssigned();
		}
	}, [hasViewAll, loadAssigned]);

	const searchSites = useCallback(async (input: string) => {
		if (!input.trim()) {
			setSearchResults([]);
			return;
		}
		setSearching(true);
		try {
			const data = await api.getSites(0, 10, [
				{
					columnField: 'name_english',
					value: input.trim(),
					operatorValue: 'contains',
				},
			]);
			setSearchResults(data.results || []);
		} catch {
			toast.error('Failed to search sites');
		} finally {
			setSearching(false);
		}
	}, []);

	const handleInputChange = (_: React.SyntheticEvent, value: string) => {
		setSearchInput(value);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => searchSites(value), 300);
	};

	const handleSelectSite = async (
		_: React.SyntheticEvent,
		site: AssignedSite | null,
	) => {
		if (!site) return;
		if (assignedSites.some((s) => s.id === site.id)) return;
		setAdding(true);
		try {
			await api.assignUserSites(userId, [String(site.id)]);
			setAssignedSites((prev) => [...prev, site]);
			setSearchInput('');
			setSearchResults([]);
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to assign site');
		} finally {
			setAdding(false);
		}
	};

	const handleRemoveSite = async (site: AssignedSite) => {
		setRemovingId(site.id);
		try {
			await api.removeUserSite(userId, String(site.id));
			setAssignedSites((prev) => prev.filter((s) => s.id !== site.id));
		} catch (err: any) {
			toast.error(err.response?.data?.error || 'Failed to remove site');
		} finally {
			setRemovingId(null);
		}
	};

	if (hasViewAll) {
		return (
			<Box>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ display: 'block', mb: 1 }}
				>
					Site Access
				</Typography>
				<Chip
					icon={<PublicIcon fontSize="small" />}
					label="Has access to all sites"
					color="success"
					size="small"
					variant="outlined"
				/>
			</Box>
		);
	}

	const filteredResults = searchResults.filter(
		(s) => !assignedSites.some((a) => a.id === s.id),
	);

	return (
		<Box>
			<Typography
				variant="caption"
				color="text.secondary"
				sx={{ display: 'block', mb: 1 }}
			>
				Assigned Sites
			</Typography>

			{loadingAssigned ? (
				<CircularProgress size={20} />
			) : (
				<Box
					display="flex"
					flexWrap="wrap"
					gap={0.75}
					mb={assignedSites.length > 0 ? 1.5 : 0}
				>
					{assignedSites.map((site) => (
						<Chip
							key={site.id}
							label={site.name_english}
							size="small"
							onDelete={
								removingId === site.id
									? undefined
									: () => handleRemoveSite(site)
							}
							deleteIcon={
								removingId === site.id ? (
									<CircularProgress size={14} sx={{ color: 'inherit' }} />
								) : undefined
							}
						/>
					))}
					{assignedSites.length === 0 && (
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ fontStyle: 'italic' }}
						>
							No sites assigned
						</Typography>
					)}
				</Box>
			)}

			<Autocomplete
				options={filteredResults}
				getOptionLabel={(s) => s.name_english}
				inputValue={searchInput}
				onInputChange={handleInputChange}
				onChange={handleSelectSite}
				value={null}
				loading={searching || adding}
				filterOptions={(x) => x}
				isOptionEqualToValue={(a, b) => a.id === b.id}
				noOptionsText={
					searchInput.trim() ? 'No sites found' : 'Type to search sites'
				}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Add site"
						size="small"
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<>
									{(searching || adding) && <CircularProgress size={16} />}
									{params.InputProps.endAdornment}
								</>
							),
						}}
					/>
				)}
			/>
		</Box>
	);
};

export default AssignedSitesPanel;
