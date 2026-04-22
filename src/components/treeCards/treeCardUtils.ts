export type ParsedPlantName = {
	primaryPlantName: string;
	englishTreeType: string;
	localPlantName: string;
};

export const parsePlantName = (
	plantTypeName?: string | null,
	plantTypeEnglishName?: string | null,
): ParsedPlantName => {
	const cleanedPlantName = (plantTypeName ?? '')
		.replace(/\s*\(.*\)\s*$/, '')
		.trim();
	const localPlantNameMatch = (plantTypeName ?? '').match(/\(([^)]+)\)/);
	const localPlantName = localPlantNameMatch
		? localPlantNameMatch[1].trim()
		: '';
	const englishPlantName = (plantTypeEnglishName ?? '').trim();
	const primaryPlantName =
		cleanedPlantName || englishPlantName || 'Tree name unavailable';
	const englishTreeType =
		englishPlantName && englishPlantName !== primaryPlantName
			? englishPlantName
			: '';

	return {
		primaryPlantName,
		englishTreeType,
		localPlantName,
	};
};
