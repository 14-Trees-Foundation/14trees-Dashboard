const processEnv = (globalThis as any)?.process?.env ?? {};

export const S3_BUCKET_NAME =
	import.meta.env.VITE_BUCKET_NAMES ||
	processEnv.bucket_names ||
	'14treesplants';

export const S3_REGION =
	import.meta.env.VITE_AWS_REGION || processEnv.aws_region || 'ap-south-1';

export const getS3BaseUrl = (useRegion = true): string => {
	if (useRegion) {
		return `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com`;
	}

	return `https://${S3_BUCKET_NAME}.s3.amazonaws.com`;
};

export const buildS3Url = (path: string, useRegion = true): string => {
	const normalizedPath = path.replace(/^\/+/, '');
	return `${getS3BaseUrl(useRegion)}/${normalizedPath}`;
};
