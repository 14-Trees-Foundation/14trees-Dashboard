/**
 * Location hierarchy for site forms — Maharashtra only (hardcoded).
 *
 * TODO: Replace getDistrictOptions / getTalukaOptions / getVillageOptions with
 * backend API calls when the following endpoints are ready:
 *   GET /locations/districts
 *   GET /locations/talukas?district=<district>
 *   GET /locations/villages?district=<district>&taluka=<taluka>
 *
 * The form components only call the selector functions below — no form code
 * needs to change when the data source switches.
 */

import {
	DistrictOptions,
	BudhanaOptions,
	JalgaonOptions,
	PuneOptions,
	SambhajinagarOptions,
	BudhanaDTOptions,
	BudhanaKhamgaonOptions,
	BudhanaMalkapurOptions,
	BudhanaMotalaOptions,
	BudhanaNanduraOptions,
	JalgaonJamnerOptions,
	PuneAmbegaonOptions,
	PuneIndapurOptions,
	PuneKhedOptions,
	SambhajiNagarOptions,
} from '../../utils/Form_Data';

interface LegacyOption {
	value: string;
	label: string;
}

const toStrings = (opts: LegacyOption[]): string[] => opts.map((o) => o.value);

// ─── Taluka option lists by district value ────────────────────────────────────

const DISTRICT_TALUKAS: Record<string, LegacyOption[]> = {
	'Buldhana (बुलढाणा)': BudhanaOptions as LegacyOption[],
	'Jalgaon (जळगाव)': JalgaonOptions as LegacyOption[],
	'Pune (पुणे)': PuneOptions as LegacyOption[],
	'Sambhajinagar (संभाजीनगर)': SambhajinagarOptions as LegacyOption[],
};

// ─── Village lists keyed by "districtValue___talukaValue" ─────────────────────

const VILLAGE_MAP: Record<string, string[]> = {
	'Buldhana (बुलढाणा)___Budhana': toStrings(BudhanaDTOptions as LegacyOption[]),
	'Buldhana (बुलढाणा)___Khamgaon (खामगाव)': toStrings(
		BudhanaKhamgaonOptions as LegacyOption[],
	),
	'Buldhana (बुलढाणा)___Malkapur (मलकापूर)': toStrings(
		BudhanaMalkapurOptions as LegacyOption[],
	),
	'Buldhana (बुलढाणा)___Motala (मोताळा)': toStrings(
		BudhanaMotalaOptions as LegacyOption[],
	),
	'Buldhana (बुलढाणा)___Nandura (नांदुरा)': toStrings(
		BudhanaNanduraOptions as LegacyOption[],
	),
	'Jalgaon (जळगाव)___Jamner (जामनेर)': toStrings(
		JalgaonJamnerOptions as LegacyOption[],
	),
	'Pune (पुणे)___Ambegaon (आंबेगाव)': toStrings(
		PuneAmbegaonOptions as LegacyOption[],
	),
	'Pune (पुणे)___Indapur (इंदापूर)': toStrings(
		PuneIndapurOptions as LegacyOption[],
	),
	'Pune (पुणे)___Khed (खेड)': toStrings(PuneKhedOptions as LegacyOption[]),
	'Sambhajinagar (संभाजीनगर)___Soegaon': toStrings(
		SambhajiNagarOptions as LegacyOption[],
	),
};

// ─── Public selector functions ────────────────────────────────────────────────

/** All available district strings. */
export const getDistrictOptions = (): string[] =>
	(DistrictOptions as LegacyOption[]).map((o) => o.value);

/** Talukas available for the given district (empty array if unknown). */
export const getTalukaOptions = (district: string | null): string[] => {
	if (!district) return [];
	return (DISTRICT_TALUKAS[district] ?? []).map((o) => o.value);
};

/**
 * Villages for the given district+taluka combination.
 * Returns an empty array when no predefined list exists — village field
 * uses freeSolo so users can still enter custom values.
 */
export const getVillageOptions = (
	district: string | null,
	taluka: string | null,
): string[] => {
	if (!district || !taluka) return [];
	return VILLAGE_MAP[`${district}___${taluka}`] ?? [];
};
