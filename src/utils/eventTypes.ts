export const EVENT_TYPE_MAP: Record<string, string> = {
	'1': 'Birthday',
	'2': 'Memorial',
	'3': 'General gift',
	'4': 'Wedding',
	'5': 'Anniversary',
	'6': 'Festival Celebration',
	'7': 'Retirement',
};

export function mapEventType(value: string | null | undefined): string {
	if (!value) return 'Unassigned';
	return EVENT_TYPE_MAP[value] ?? value;
}

export function mapEventTypes(values: string[] | null | undefined): string[] {
	if (!values || values.length === 0) return [];
	return values
		.map((v) => EVENT_TYPE_MAP[v] ?? null)
		.filter((v): v is string => v !== null);
}
