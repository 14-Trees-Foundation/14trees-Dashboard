/**
 * Static dropdown option lists for the Add/Edit Site forms.
 *
 * TODO: owner types should eventually be fetched from the backend.
 *       Other enums (maintenance_type, land_type, land_strata, consent_letter)
 *       are stable and can stay hardcoded.
 */

export const OWNER_OPTIONS = [
	'GramPanchayat (ग्राम पंचायत)',
	'Govt. Dept. (सरकारी विभाग)',
	'Forest Dept. (वन विभाग)',
	'14 Trees Branch',
	'NGO (संस्था)',
	'Farmer (शेतकरी)',
];

export const MAINTENANCE_TYPE_OPTIONS = [
	'FULL_MAINTENANCE',
	'PLANTATION_ONLY',
	'DISTRIBUTION_ONLY',
	'WAITING',
	'CANCELLED',
	'TBD',
];

export const LAND_TYPE_OPTIONS = [
	'Roadside (रस्ता)',
	'Gairan (गायरान)',
	'School (शाळा)',
	'Temple (मंदिर, मस्जिद)',
	'Gavthan, Premises',
	'Cremation, burial (स्मशानभूमी, कब्रिस्तान)',
	'Forest',
	'Farm',
	'Premises (परिसर)',
	'Barren (पडीक)',
];

export const LAND_STRATA_OPTIONS = [
	'Rocky',
	'Murum (मुरूम)',
	'Soil (माती)',
	'Roadside (रस्ता काठ)',
];

export const CONSENT_LETTER_OPTIONS = [
	'14T - ग्राम पंचायत पत्र',
	'14T - संस्था पत्र',
	'वन विभाग सहकार्य पत्र',
	'14T - MoU with owner',
];

/** Returns true when the given land_type value is road-based (uses length, not area). */
export const isRoadsideLandType = (landType: string): boolean =>
	landType.toLowerCase().includes('roadside');
