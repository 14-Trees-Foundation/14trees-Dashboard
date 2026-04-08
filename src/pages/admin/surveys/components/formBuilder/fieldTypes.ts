export interface FieldType {
	type: string;
	label: string;
	icon: string;
	defaultConfig: any;
}

export const FIELD_TYPES: FieldType[] = [
	{
		type: 'text',
		label: 'Text Input',
		icon: '📝',
		defaultConfig: {
			type: 'text',
			name: 'text_field',
			label: { en: 'Text Field', mr: 'मजकूर फील्ड' },
			hint: { en: 'Enter text', mr: 'मजकूर प्रविष्ट करा' },
			required: false,
			readOnly: false,
		},
	},
	{
		type: 'number',
		label: 'Number Input',
		icon: '🔢',
		defaultConfig: {
			type: 'number',
			name: 'number_field',
			label: { en: 'Number Field', mr: 'संख्या फील्ड' },
			required: false,
			readOnly: false,
			parameters: { min: 0, max: 100 },
		},
	},
	{
		type: 'select_one',
		label: 'Single Select',
		icon: '📋',
		defaultConfig: {
			type: 'select_one',
			name: 'select_field',
			label: { en: 'Select Field', mr: 'निवड फील्ड' },
			required: false,
			readOnly: false,
			parameters: { list_name: 'options' },
		},
	},
	{
		type: 'select_many',
		label: 'Multi Select',
		icon: '☑️',
		defaultConfig: {
			type: 'select_many',
			name: 'multiselect_field',
			label: { en: 'Multi Select', mr: 'बहु निवड' },
			required: false,
			readOnly: false,
			parameters: { list_name: 'options' },
		},
	},
	{
		type: 'date',
		label: 'Date Picker',
		icon: '📅',
		defaultConfig: {
			type: 'date',
			name: 'date_field',
			label: { en: 'Date', mr: 'तारीख' },
			required: false,
			readOnly: false,
		},
	},
	{
		type: 'geopoint',
		label: 'GPS Location',
		icon: '📍',
		defaultConfig: {
			type: 'geopoint',
			name: 'location',
			label: { en: 'Location', mr: 'स्थान' },
			hint: { en: 'Auto-fetched from GPS', mr: 'GPS वरून स्वयंचलित' },
			required: false,
			readOnly: false,
			appearance: 'maps',
		},
	},
	{
		type: 'image',
		label: 'Photo Upload',
		icon: '📷',
		defaultConfig: {
			type: 'image',
			name: 'photo',
			label: { en: 'Photo', mr: 'फोटो' },
			required: false,
			readOnly: false,
			parameters: { max_count: 5 },
		},
	},
];

export const getFieldIcon = (type: string): string => {
	const field = FIELD_TYPES.find((f) => f.type === type);
	return field?.icon || '📄';
};

export const generateUniqueFieldName = (
	type: string,
	existingNames: string[],
): string => {
	let counter = 1;
	let name = `${type}_${counter}`;
	while (existingNames.includes(name)) {
		counter++;
		name = `${type}_${counter}`;
	}
	return name;
};
