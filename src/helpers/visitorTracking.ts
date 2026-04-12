/**
 * Visitor tracking utilities for analytics
 * Uses UUID v4 stored in localStorage to identify unique visitors
 */

const generateUuidV4 = (): string => {
	const cryptoObj = globalThis.crypto;

	if (cryptoObj?.randomUUID) {
		return cryptoObj.randomUUID();
	}

	if (cryptoObj?.getRandomValues) {
		const bytes = new Uint8Array(16);
		cryptoObj.getRandomValues(bytes);

		// RFC 4122 variant and version bits.
		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;

		const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
		return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex
			.slice(6, 8)
			.join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
	}

	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.floor(Math.random() * 16);
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

/**
 * Gets or creates a visitor ID
 * If one exists in localStorage, returns it
 * Otherwise generates a new UUID v4 and stores it
 */
export const getOrCreateVisitorId = (): string => {
	const key = 'visitor_id';
	const existingId = localStorage.getItem(key);

	if (existingId) {
		return existingId;
	}

	// Generate UUID v4 with compatibility fallback for older browsers.
	const newId = generateUuidV4();
	localStorage.setItem(key, newId);
	return newId;
};

/**
 * Gets the current visitor ID from localStorage
 * Returns null if no visitor ID exists yet
 */
export const getVisitorId = (): string | null => {
	return localStorage.getItem('visitor_id');
};
