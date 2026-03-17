export function arrayToCSV(
	headers: string[],
	rows: (string | number | null | undefined)[][],
): string {
	const escape = (val: string | number | null | undefined) => {
		if (val === null || val === undefined) return '';
		const str = String(val);
		if (str.includes(',') || str.includes('"') || str.includes('\n')) {
			return `"${str.replace(/"/g, '""')}"`;
		}
		return str;
	};

	const lines = [
		headers.map(escape).join(','),
		...rows.map((row) => row.map(escape).join(',')),
	];

	return lines.join('\n');
}

export function downloadCSV(content: string, filename: string): void {
	const blob = new Blob([content], { type: 'text/csv' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function formatFilename(
	base: string,
	filters: {
		year?: number | string;
		type?: string;
		source?: string;
	},
): string {
	const parts = [base];
	if (filters.year && filters.year !== 0) {
		parts.push(String(filters.year));
	}
	if (filters.type && filters.type !== 'all') {
		parts.push(filters.type);
	}
	if (filters.source && filters.source !== 'all') {
		parts.push(filters.source);
	}
	return parts.join('_').toLowerCase().replace(/\s+/g, '_');
}
