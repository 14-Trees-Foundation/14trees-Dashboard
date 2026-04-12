const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

const isBrowser = typeof window !== 'undefined';

export const resolveApiBaseUrl = (envBaseUrl?: string): string => {
	if (!envBaseUrl) {
		return '';
	}

	if (!isBrowser) {
		return envBaseUrl;
	}

	let parsedUrl: URL;
	try {
		parsedUrl = new URL(envBaseUrl);
	} catch {
		return envBaseUrl;
	}

	const pageHost = window.location.hostname;
	if (!pageHost || LOCAL_HOSTS.has(pageHost)) {
		return envBaseUrl;
	}

	if (LOCAL_HOSTS.has(parsedUrl.hostname)) {
		parsedUrl.hostname = pageHost;
		return parsedUrl.toString().replace(/\/$/, '');
	}

	return envBaseUrl;
};
