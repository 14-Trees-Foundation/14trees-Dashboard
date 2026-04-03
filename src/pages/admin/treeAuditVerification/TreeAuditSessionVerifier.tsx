import { useEffect, useMemo, useState } from 'react';
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	IconButton,
	Stack,
	Tab,
	Tabs,
	Tooltip,
	Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { analyticsPageSx } from '../shared/adminTheme';
import { darkTheme, lightAnalyticsTheme } from '../../../theme';
import {
	batchVerifyTreeAuditPhotos,
	fetchTreeAuditSessionDetail,
	rejectTreeAuditPhoto,
} from './treeAuditVerificationService';
import Filmstrip from './components/Filmstrip';
import ImageViewer from './components/ImageViewer';
import RejectDialog from './components/RejectDialog';
import TaggingPanel from './components/TaggingPanel';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { TreeAuditPhoto, TreeAuditSessionDetail } from './types';

const THEME_STORAGE_KEY = 'tree-audit-verification-theme-preference';

const getStoredThemePreference = (): 'dark' | 'light' => {
	if (typeof window === 'undefined') return 'dark';
	const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
	return saved === 'light' || saved === 'dark' ? saved : 'dark';
};

const SessionVerifierContent = ({
	themeMode,
	onToggleTheme,
}: {
	themeMode: 'dark' | 'light';
	onToggleTheme: () => void;
}) => {
	const { sessionId } = useParams<{ sessionId: string }>();
	const navigate = useNavigate();
	const theme = useTheme();
	const isLightMode = themeMode === 'light';

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sessionDetail, setSessionDetail] =
		useState<TreeAuditSessionDetail | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState<25 | 50 | 100>(25);
	const [stagedEdits, setStagedEdits] = useState<Map<number, string>>(
		new Map(),
	);
	const [isSaving, setIsSaving] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

	const loadSessionDetail = async () => {
		if (!sessionId) return;
		setLoading(true);
		setError(null);
		try {
			const detail = await fetchTreeAuditSessionDetail(sessionId);
			const auditPhotos = detail.photos.filter(
				(photo) => photo.form_type === 'tree_audit',
			);
			setSessionDetail({
				...detail,
				form_type: 'tree_audit',
				photos: auditPhotos,
			});
			setCurrentIndex((prev) =>
				Math.min(prev, Math.max(auditPhotos.length - 1, 0)),
			);
		} catch (fetchError: any) {
			setError(fetchError.message || 'Failed to load session details');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadSessionDetail();
	}, [sessionId]);

	const photos = sessionDetail?.photos || [];
	const totalPhotos = photos.length;
	const totalPages = Math.max(1, Math.ceil(totalPhotos / pageSize));

	useEffect(() => {
		setCurrentPage(Math.floor(currentIndex / pageSize));
	}, [currentIndex, pageSize]);

	const currentPhoto = photos[currentIndex];
	const currentSaplingId = currentPhoto
		? stagedEdits.get(currentPhoto.id) ?? currentPhoto.sapling_id ?? ''
		: '';

	const pagePhotos = useMemo(() => {
		const start = currentPage * pageSize;
		return photos.slice(start, start + pageSize);
	}, [photos, currentPage, pageSize]);

	const sessionMeta = useMemo(
		() => ({
			workerName: sessionDetail?.worker?.name,
			plotName: sessionDetail?.plot?.name,
			siteName: sessionDetail?.plot?.site?.name,
		}),
		[sessionDetail],
	);

	const verifiedCount = photos.filter(
		(photo) => photo.verification_status === 'verified',
	).length;
	const rejectedCount = photos.filter(
		(photo) => photo.verification_status === 'rejected',
	).length;
	const pendingCount = photos.filter(
		(photo) =>
			!photo.verification_status || photo.verification_status === 'pending',
	).length;

	const moveToIndex = (nextIndex: number) => {
		setCurrentIndex(
			Math.max(0, Math.min(nextIndex, Math.max(totalPhotos - 1, 0))),
		);
	};

	const findNextPendingFrom = (fromIndex: number) => {
		const nextPending = photos.findIndex(
			(photo, index) =>
				index > fromIndex &&
				(!photo.verification_status || photo.verification_status === 'pending'),
		);
		return nextPending !== -1
			? nextPending
			: Math.min(fromIndex + 1, Math.max(totalPhotos - 1, 0));
	};

	const findPrevIndex = (fromIndex: number) => Math.max(fromIndex - 1, 0);

	const handleNext = () => moveToIndex(findNextPendingFrom(currentIndex));
	const handlePrev = () => moveToIndex(findPrevIndex(currentIndex));

	const handleSaplingIdChange = (value: string) => {
		if (!currentPhoto) return;
		setStagedEdits((prev) => {
			const next = new Map(prev);
			if (!value.trim() && !currentPhoto.sapling_id) {
				next.delete(currentPhoto.id);
			} else {
				next.set(currentPhoto.id, value);
			}
			return next;
		});
	};

	const handleBatchSave = async () => {
		if (!pagePhotos.length) return;
		const pageIds = new Set(pagePhotos.map((photo) => photo.id));
		const items = Array.from(stagedEdits.entries())
			.filter(([id, saplingId]) => {
				if (!pageIds.has(id)) return false;
				if (!saplingId.trim()) return false;
				const photo = photos.find((item) => item.id === id);
				if (!photo) return false;
				if (
					photo.verification_status === 'verified' ||
					photo.verification_status === 'rejected'
				) {
					return false;
				}
				return true;
			})
			.map(([id, sapling_id]) => ({ id, sapling_id: sapling_id.trim() }));

		if (items.length === 0) {
			toast.info('No valid edits on this page to verify.');
			return;
		}

		setIsSaving(true);
		try {
			const result = await batchVerifyTreeAuditPhotos(items);
			setStagedEdits((prev) => {
				const next = new Map(prev);
				result.updatedIds.forEach((id) => next.delete(id));
				return next;
			});
			await loadSessionDetail();
			if (result.failed.length > 0) {
				toast.warning(
					`${result.updatedIds.length} verified, ${result.failed.length} failed.`,
				);
			} else {
				toast.success(
					`${result.updatedIds.length} photos verified successfully.`,
				);
			}
			moveToIndex(findNextPendingFrom(currentIndex));
		} catch (saveError: any) {
			toast.error(saveError.message || 'Failed to verify tree audit photos.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleReject = async (reason: string) => {
		if (!currentPhoto) return;
		try {
			await rejectTreeAuditPhoto(currentPhoto.id, reason);
			setRejectDialogOpen(false);
			setStagedEdits((prev) => {
				const next = new Map(prev);
				next.delete(currentPhoto.id);
				return next;
			});
			await loadSessionDetail();
			toast.success('Photo rejected successfully.');
			moveToIndex(findNextPendingFrom(currentIndex));
		} catch (rejectError: any) {
			toast.error(rejectError.message || 'Failed to reject photo.');
		}
	};

	useKeyboardNav({
		enabled: !rejectDialogOpen,
		currentSaplingId,
		onNext: handleNext,
		onPrev: handlePrev,
		onBatchSave: handleBatchSave,
		onReject: () => {
			if (currentPhoto) setRejectDialogOpen(true);
		},
		onToggleFullscreen: () => setIsFullscreen((prev) => !prev),
		onPageNext: () =>
			setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1)),
		onPagePrev: () => setCurrentPage((prev) => Math.max(prev - 1, 0)),
	});

	return (
		<Box
			sx={{
				...analyticsPageSx,
				m: -2,
				minHeight: '100vh',
				backgroundColor: theme.palette.background.default,
				transition: 'background-color 0.2s ease',
			}}
		>
			<Card
				elevation={0}
				sx={{
					backgroundColor: isLightMode
						? 'transparent'
						: theme.palette.background.default,
					border: isLightMode ? 'none' : `1px solid ${theme.palette.divider}`,
					borderBottom: isLightMode ? 'none' : undefined,
					borderRadius: isLightMode ? 0 : 2,
					boxShadow: 'none',
					px: 3,
					py: 2,
					mb: 3,
				}}
			>
				<CardContent sx={{ px: 0, py: 0 }}>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						mb={2}
						flexWrap="wrap"
						gap={2}
					>
						<Stack direction="row" spacing={1} alignItems="center">
							<IconButton
								onClick={() => navigate('/admin/tree-audit-verification')}
							>
								<ArrowBackIcon />
							</IconButton>
							<Box>
								<Typography
									variant="h4"
									sx={{
										mt: 1,
										mb: 0.5,
										fontWeight: 600,
										color: isLightMode ? '#1a1a1a' : 'text.primary',
									}}
								>
									{sessionDetail?.session_id || sessionId}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: 'text.secondary', fontFamily: 'monospace' }}
								>
									Tree Audit Verification Session
								</Typography>
							</Box>
						</Stack>

						<Stack direction="row" spacing={1} alignItems="center">
							<Tooltip
								title={
									themeMode === 'dark'
										? 'Switch to light mode'
										: 'Switch to dark mode'
								}
							>
								<IconButton
									onClick={onToggleTheme}
									size="small"
									sx={{
										width: 34,
										height: 34,
										borderRadius: '8px',
										border:
											themeMode === 'dark'
												? '1px solid rgba(255,255,255,0.15)'
												: '1px solid #dde1e7',
										color:
											themeMode === 'dark'
												? 'rgba(255,255,255,0.6)'
												: '#64748b',
										backgroundColor:
											themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
									}}
								>
									{themeMode === 'dark' ? (
										<Brightness7Icon fontSize="small" />
									) : (
										<Brightness4Icon fontSize="small" />
									)}
								</IconButton>
							</Tooltip>

							<Button
								variant="contained"
								onClick={handleBatchSave}
								disabled={
									isSaving || stagedEdits.size === 0 || totalPhotos === 0
								}
							>
								Save Batch ({stagedEdits.size})
							</Button>
						</Stack>
					</Stack>

					<Tabs
						value={0}
						variant="scrollable"
						scrollButtons="auto"
						sx={{
							borderBottom: isLightMode ? '1px solid #eeebe4' : 'none',
							mb: 2,
							'& .MuiTabs-flexContainer': {
								backgroundColor: isLightMode
									? 'transparent'
									: theme.palette.background.paper,
								borderRadius: isLightMode ? 0 : '10px',
							},
							'& .MuiTab-root': {
								color: isLightMode ? '#9ca3af' : 'rgba(255,255,255,0.4)',
								fontSize: '0.72rem',
								letterSpacing: '0.08em',
								fontWeight: 500,
							},
							'& .MuiTab-root.Mui-selected': {
								color: isLightMode ? '#1a1a1a' : theme.palette.text.primary,
							},
						}}
					>
						<Tab label="VERIFY" />
					</Tabs>

					{loading ? (
						<Alert severity="info">Loading session…</Alert>
					) : error ? (
						<Alert severity="error">{error}</Alert>
					) : !sessionDetail || totalPhotos === 0 ? (
						<Alert severity="warning">
							No audit photos found for this session.
						</Alert>
					) : (
						<Stack spacing={2}>
							<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
								<Typography variant="body2">
									<strong>Worker:</strong>{' '}
									{sessionMeta.workerName || `User #${sessionDetail.worker.id}`}
								</Typography>
								<Typography variant="body2">
									<strong>Plot:</strong> {sessionMeta.plotName || '—'}
								</Typography>
								<Typography variant="body2">
									<strong>Site:</strong> {sessionMeta.siteName || '—'}
								</Typography>
								<Typography variant="body2">
									<strong>Verified:</strong> {verifiedCount}
								</Typography>
								<Typography variant="body2">
									<strong>Pending:</strong> {pendingCount}
								</Typography>
								<Typography variant="body2">
									<strong>Rejected:</strong> {rejectedCount}
								</Typography>
							</Stack>

							<Stack
								direction={{ xs: 'column', lg: 'row' }}
								spacing={2}
								alignItems="stretch"
							>
								<Box
									sx={{
										flex: 1,
										minWidth: 0,
										height: {
											xs: '48vh',
											sm: '54vh',
											lg: 'calc(100vh - 340px)',
										},
										minHeight: {
											xs: 320,
											sm: 380,
											lg: 420,
										},
										maxHeight: {
											lg: '720px',
										},
									}}
								>
									<ImageViewer
										photo={currentPhoto}
										isFullscreen={isFullscreen}
										onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
									/>
								</Box>

								<Card
									elevation={0}
									sx={{
										width: { xs: '100%', lg: 360 },
										border: `1px solid ${theme.palette.divider}`,
										background:
											theme.palette.mode === 'dark'
												? 'rgba(255,255,255,0.02)'
												: '#ffffff',
									}}
								>
									<CardContent sx={{ height: '100%' }}>
										<TaggingPanel
											photo={currentPhoto}
											currentIndex={currentIndex}
											total={totalPhotos}
											saplingId={currentSaplingId}
											onSaplingIdChange={handleSaplingIdChange}
											onReject={() => setRejectDialogOpen(true)}
											hasUnsavedChanges={
												currentPhoto ? stagedEdits.has(currentPhoto.id) : false
											}
											isSaving={isSaving}
											sessionMeta={sessionMeta}
										/>
									</CardContent>
								</Card>
							</Stack>

							<Card
								elevation={0}
								sx={{
									border: `1px solid ${theme.palette.divider}`,
									background:
										theme.palette.mode === 'dark'
											? 'rgba(255,255,255,0.02)'
											: '#ffffff',
								}}
							>
								<CardContent>
									<Filmstrip
										pagePhotos={pagePhotos}
										allPhotos={photos}
										currentIndex={currentIndex}
										currentPage={currentPage}
										pageSize={pageSize}
										totalPages={totalPages}
										stagedEdits={stagedEdits}
										onPhotoSelect={moveToIndex}
										onPageChange={setCurrentPage}
										onPageSizeChange={setPageSize}
									/>
								</CardContent>
							</Card>
						</Stack>
					)}
				</CardContent>
			</Card>

			<RejectDialog
				open={rejectDialogOpen}
				photo={currentPhoto}
				onClose={() => setRejectDialogOpen(false)}
				onConfirm={handleReject}
			/>
		</Box>
	);
};

const TreeAuditSessionVerifier = () => {
	const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() =>
		getStoredThemePreference(),
	);

	const toggleTheme = () => {
		const next = themeMode === 'dark' ? 'light' : 'dark';
		setThemeMode(next);
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(THEME_STORAGE_KEY, next);
		}
	};

	return (
		<ThemeProvider
			theme={themeMode === 'dark' ? darkTheme : lightAnalyticsTheme}
		>
			<SessionVerifierContent
				themeMode={themeMode}
				onToggleTheme={toggleTheme}
			/>
		</ThemeProvider>
	);
};

export default TreeAuditSessionVerifier;
