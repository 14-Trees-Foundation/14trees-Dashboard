import React, { useState, useEffect } from 'react';
import {
	Grid,
	Button,
	Typography,
	Card,
	CardMedia,
	IconButton,
	Box,
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';

const FileUploadSection = ({
	formData,
	updateFormData,
	isSubmitting,
	showPoster = true,
	showLandingImage = true,
	showLandingMobile = true,
	showDescriptiveImages = true,
}) => {
	const [imagePreviews, setImagePreviews] = useState([]);
	const [posterPreview, setPosterPreview] = useState(null);
	const [landingPreview, setLandingPreview] = useState(null);
	const [landingMobilePreview, setLandingMobilePreview] = useState(null);

	const formatFileSize = (bytes) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
	};

	const cleanupPreview = (preview) => {
		if (preview && preview.url && !preview.isExisting) {
			URL.revokeObjectURL(preview.url);
		}
	};

	const createPreview = (file) => ({
		file,
		url: URL.createObjectURL(file),
		name: file.name,
		size: file.size,
		isExisting: false,
	});

	const handlePosterUpload = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		cleanupPreview(posterPreview);
		const preview = createPreview(file);
		setPosterPreview(preview);
		updateFormData({ event_poster: file });
	};

	const removePoster = () => {
		cleanupPreview(posterPreview);
		setPosterPreview(null);
		updateFormData({ event_poster: null });
	};

	const handleLandingUpload = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		cleanupPreview(landingPreview);
		const preview = createPreview(file);
		setLandingPreview(preview);
		updateFormData({ landing_image: file, landing_image_s3_path: null });
	};

	const removeLanding = () => {
		cleanupPreview(landingPreview);
		setLandingPreview(null);
		updateFormData({ landing_image: null, landing_image_s3_path: null });
	};

	const handleLandingMobileUpload = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		cleanupPreview(landingMobilePreview);
		const preview = createPreview(file);
		setLandingMobilePreview(preview);
		updateFormData({
			landing_image_mobile: file,
			landing_image_mobile_s3_path: null,
		});
	};

	const removeLandingMobile = () => {
		cleanupPreview(landingMobilePreview);
		setLandingMobilePreview(null);
		updateFormData({
			landing_image_mobile: null,
			landing_image_mobile_s3_path: null,
		});
	};

	const handleFileUpload = (event, fieldName) => {
		const files = Array.from(event.target.files);
		imagePreviews.forEach((preview) => cleanupPreview(preview));

		const existingImages = imagePreviews.filter(
			(preview) => preview.isExisting,
		);
		const newPreviews = files.map((file, index) => ({
			id: `${fieldName}-${index}-${Date.now()}`,
			...createPreview(file),
		}));
		const allPreviews = [...existingImages, ...newPreviews];
		setImagePreviews(allPreviews);

		updateFormData({
			[fieldName]: allPreviews.map((preview) =>
				preview.isExisting ? preview.url : preview.file,
			),
		});
	};

	const removeImage = (imageId) => {
		const updatedPreviews = imagePreviews.filter((preview) => {
			if (preview.id === imageId) {
				cleanupPreview(preview);
				return false;
			}
			return true;
		});

		setImagePreviews(updatedPreviews);

		const fieldName = formData.type === '2' ? 'memories' : 'images';
		updateFormData({
			[fieldName]: updatedPreviews.map((preview) =>
				preview.isExisting ? preview.url : preview.file,
			),
		});
	};

	useEffect(() => {
		if (imagePreviews.length > 0) {
			imagePreviews.forEach((preview) => cleanupPreview(preview));
			setImagePreviews([]);
			updateFormData({ images: [], memories: [] });
		}
	}, [formData.type]);

	useEffect(() => {
		const fieldName = formData.type === '2' ? 'memories' : 'images';
		const existingImages = formData[fieldName];

		if (
			showDescriptiveImages &&
			existingImages &&
			existingImages.length > 0 &&
			imagePreviews.length === 0
		) {
			const areUrlStrings = existingImages.every(
				(item) => typeof item === 'string',
			);
			if (areUrlStrings) {
				const existingPreviews = existingImages.map((imageUrl, index) => ({
					id: `existing-${fieldName}-${index}`,
					url: imageUrl,
					name: `Existing Image ${index + 1}`,
					isExisting: true,
				}));
				setImagePreviews(existingPreviews);
			}
		}
	}, [
		formData.images,
		formData.memories,
		formData.type,
		showDescriptiveImages,
	]);

	useEffect(() => {
		if (
			showPoster &&
			formData.event_poster &&
			typeof formData.event_poster === 'string' &&
			!posterPreview
		) {
			setPosterPreview({
				url: formData.event_poster,
				name: 'Existing Poster',
				isExisting: true,
			});
		}
	}, [formData.event_poster, posterPreview, showPoster]);

	useEffect(() => {
		if (showLandingImage && formData.landing_image_s3_path && !landingPreview) {
			setLandingPreview({
				url: formData.landing_image_s3_path,
				name: 'Existing Landing Image',
				isExisting: true,
			});
		}
	}, [formData.landing_image_s3_path, landingPreview, showLandingImage]);

	useEffect(() => {
		if (
			showLandingMobile &&
			formData.landing_image_mobile_s3_path &&
			!landingMobilePreview
		) {
			setLandingMobilePreview({
				url: formData.landing_image_mobile_s3_path,
				name: 'Existing Landing Mobile Image',
				isExisting: true,
			});
		}
	}, [
		formData.landing_image_mobile_s3_path,
		landingMobilePreview,
		showLandingMobile,
	]);

	useEffect(() => {
		return () => {
			imagePreviews.forEach((preview) => cleanupPreview(preview));
			cleanupPreview(posterPreview);
			cleanupPreview(landingPreview);
			cleanupPreview(landingMobilePreview);
		};
	}, [imagePreviews, posterPreview, landingPreview, landingMobilePreview]);

	if (
		!showPoster &&
		!showLandingImage &&
		!showLandingMobile &&
		!showDescriptiveImages
	) {
		return null;
	}

	return (
		<>
			{showPoster && (
				<Grid item xs={12}>
					<Typography variant="subtitle2" sx={{ mb: 1 }}>
						Event Poster (Optional)
					</Typography>
					<Button
						variant="outlined"
						component="label"
						startIcon={<CloudUpload />}
						fullWidth
						sx={{ mb: 2 }}
						disabled={isSubmitting}
					>
						Upload Event Poster
						<input
							type="file"
							hidden
							accept="image/*"
							onChange={handlePosterUpload}
						/>
					</Button>
					{posterPreview && (
						<Card sx={{ position: 'relative', mb: 2 }}>
							<CardMedia
								component="img"
								height="200"
								image={posterPreview.url}
								alt={posterPreview.name}
								sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
							/>
							<IconButton
								size="small"
								sx={{
									position: 'absolute',
									top: 8,
									right: 8,
									bgcolor: 'rgba(255, 255, 255, 0.8)',
									'&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
								}}
								onClick={removePoster}
							>
								<Close fontSize="small" />
							</IconButton>
							<Box sx={{ p: 1, bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
								<Typography variant="caption" noWrap>
									{posterPreview.name}
								</Typography>
								{posterPreview.size && (
									<Typography variant="caption" display="block">
										{formatFileSize(posterPreview.size)}
									</Typography>
								)}
							</Box>
						</Card>
					)}
				</Grid>
			)}

			{showLandingImage && (
				<Grid item xs={12} md={showLandingMobile ? 6 : 12}>
					<Typography variant="subtitle2" sx={{ mb: 1 }}>
						Landing Image (Optional) - used on event landing page
					</Typography>
					<Button
						variant="outlined"
						component="label"
						startIcon={<CloudUpload />}
						fullWidth
						sx={{ mb: 2 }}
						disabled={isSubmitting}
					>
						Upload Landing Image
						<input
							type="file"
							hidden
							accept="image/*"
							onChange={handleLandingUpload}
						/>
					</Button>
					{landingPreview && (
						<Card sx={{ position: 'relative', mb: 2 }}>
							<CardMedia
								component="img"
								height="200"
								image={landingPreview.url}
								alt={landingPreview.name}
								sx={{ objectFit: 'cover', bgcolor: '#f5f5f5' }}
							/>
							<IconButton
								size="small"
								sx={{
									position: 'absolute',
									top: 8,
									right: 8,
									bgcolor: 'rgba(255, 255, 255, 0.8)',
									'&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
								}}
								onClick={removeLanding}
							>
								<Close fontSize="small" />
							</IconButton>
							<Box sx={{ p: 1, bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
								<Typography variant="caption" noWrap>
									{landingPreview.name}
								</Typography>
								{landingPreview.size && (
									<Typography variant="caption" display="block">
										{formatFileSize(landingPreview.size)}
									</Typography>
								)}
							</Box>
						</Card>
					)}
				</Grid>
			)}

			{showLandingMobile && (
				<Grid item xs={12} md={showLandingImage ? 6 : 12}>
					<Typography variant="subtitle2" sx={{ mb: 1 }}>
						Mobile Landing Image (Optional) - used on mobile viewports
					</Typography>
					<Button
						variant="outlined"
						component="label"
						startIcon={<CloudUpload />}
						fullWidth
						sx={{ mb: 2 }}
						disabled={isSubmitting}
					>
						Upload Mobile Landing Image
						<input
							type="file"
							hidden
							accept="image/*"
							onChange={handleLandingMobileUpload}
						/>
					</Button>
					{landingMobilePreview && (
						<Card sx={{ position: 'relative', mb: 2 }}>
							<CardMedia
								component="img"
								height="200"
								image={landingMobilePreview.url}
								alt={landingMobilePreview.name}
								sx={{ objectFit: 'cover', bgcolor: '#f5f5f5' }}
							/>
							<IconButton
								size="small"
								sx={{
									position: 'absolute',
									top: 8,
									right: 8,
									bgcolor: 'rgba(255, 255, 255, 0.8)',
									'&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
								}}
								onClick={removeLandingMobile}
							>
								<Close fontSize="small" />
							</IconButton>
							<Box sx={{ p: 1, bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
								<Typography variant="caption" noWrap>
									{landingMobilePreview.name}
								</Typography>
								{landingMobilePreview.size && (
									<Typography variant="caption" display="block">
										{formatFileSize(landingMobilePreview.size)}
									</Typography>
								)}
							</Box>
						</Card>
					)}
				</Grid>
			)}

			{showDescriptiveImages && (
				<Grid item xs={12}>
					<Typography variant="subtitle2" sx={{ mb: 1 }}>
						{formData.type === '2'
							? 'Memory Photos'
							: 'Event Descriptive Image(s)'}
					</Typography>
					<Button
						variant="outlined"
						component="label"
						startIcon={<CloudUpload />}
						fullWidth
						sx={{ mb: 2 }}
						disabled={isSubmitting}
					>
						Upload{' '}
						{formData.type === '2'
							? 'Memory Photos'
							: 'Event Descriptive Image(s)'}
						<input
							type="file"
							hidden
							multiple
							accept="image/*"
							onChange={(e) =>
								handleFileUpload(
									e,
									formData.type === '2' ? 'memories' : 'images',
								)
							}
						/>
					</Button>
					{imagePreviews.length > 0 && (
						<Grid container spacing={1} sx={{ mt: 1 }}>
							{imagePreviews.map((preview) => (
								<Grid item xs={4} key={preview.id}>
									<Card sx={{ position: 'relative' }}>
										<CardMedia
											component="img"
											height="100"
											image={preview.url}
											alt={preview.name}
											sx={{ objectFit: 'cover' }}
										/>
										<IconButton
											size="small"
											sx={{
												position: 'absolute',
												top: 2,
												right: 2,
												bgcolor: 'rgba(255, 255, 255, 0.8)',
												'&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
											}}
											onClick={() => removeImage(preview.id)}
										>
											<Close fontSize="small" />
										</IconButton>
										<Box
											sx={{
												p: 1,
												bgcolor: 'rgba(0, 0, 0, 0.7)',
												color: 'white',
											}}
										>
											<Typography variant="caption" noWrap>
												{preview.name}
											</Typography>
											<Typography variant="caption" display="block">
												{formatFileSize(preview.size)}
											</Typography>
										</Box>
									</Card>
								</Grid>
							))}
						</Grid>
					)}
				</Grid>
			)}
		</>
	);
};

export default FileUploadSection;
