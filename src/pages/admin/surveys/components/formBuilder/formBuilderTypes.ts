// TypeScript interfaces for the hybrid visual/JSON form builder

export interface LabelObject {
	en: string;
	mr: string;
}

export type Label = string | LabelObject;

export function normalizeLabel(label: Label | undefined): LabelObject {
	if (!label) return { en: '', mr: '' };
	if (typeof label === 'string') return { en: label, mr: label };
	return { en: label.en || '', mr: label.mr || '' };
}

export function getLabelEn(label: Label | undefined): string {
	return normalizeLabel(label).en;
}

// ── Choice Lists ─────────────────────────────────────────────────────────────

export interface ChoiceItem {
	name: string;
	label: Label;
}

export interface ChoiceLists {
	[listName: string]: ChoiceItem[];
}

// ── Conditional Logic ────────────────────────────────────────────────────────

export type ConditionalOp =
	| 'eq'
	| 'neq'
	| 'in'
	| 'not_in'
	| 'gt'
	| 'lt'
	| 'gte'
	| 'lte'
	| 'exists'
	| 'not_exists';

export interface ConditionClause {
	field: string;
	op: ConditionalOp;
	value?: any;
}

export interface ConditionalRule {
	all?: ConditionClause[];
	any?: ConditionClause[];
}

// ── Validation ───────────────────────────────────────────────────────────────

export interface ValidationRules {
	// text
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	// number/decimal
	min?: number;
	max?: number;
	precision?: number;
	unit?: string;
	// image
	maxFiles?: number;
	maxPixels?: number;
	// geopoint
	minAccuracyMeters?: number;
	timeoutSeconds?: number;
	// select
	allowEmpty?: boolean;
	// custom message
	message?: Label;
}

// ── Field ────────────────────────────────────────────────────────────────────

export interface SurveyField {
	type: string;
	name: string;
	label: Label;
	hint?: Label;
	required?: boolean;
	readOnly?: boolean;
	parameters?: {
		list_name?: string;
		min?: number;
		max?: number;
		max_count?: number;
		[key: string]: any;
	};
	appearance?: string;
	section?: string;
	page?: number;
	order?: number;
	visibleIf?: ConditionalRule;
	requiredIf?: ConditionalRule;
	validation?: ValidationRules;
}

// ── Section ──────────────────────────────────────────────────────────────────

export interface SurveySection {
	id: string;
	title: Label;
	description?: Label;
	order?: number;
	fieldsPerPage?: number;
	visibleIf?: ConditionalRule;
}

// ── Form Structure ───────────────────────────────────────────────────────────

export interface FormStructure {
	fields: SurveyField[];
	choices?: ChoiceLists;
	choiceLists?: ChoiceLists; // legacy key, normalised on read
	sections?: SurveySection[];
}

export function getChoices(fs: FormStructure): ChoiceLists {
	return fs.choices || fs.choiceLists || {};
}

// ── Tree Node ────────────────────────────────────────────────────────────────

export interface TreeNode {
	id: string; // e.g. "section-basics", "field-tree_name"
	type: 'section' | 'page' | 'field';
	label: string;
	fieldType?: string; // only for type==='field'
	sectionId?: string;
	page?: number;
	conditional?: boolean;
	required?: boolean;
	errors?: string[];
	children?: TreeNode[];
}

// ── Selected Item ────────────────────────────────────────────────────────────

export type SelectedItem =
	| { type: 'section'; id: string }
	| { type: 'field'; name: string };

// ── Validation Error ─────────────────────────────────────────────────────────

export interface BuilderError {
	itemId: string; // field name or section id
	message: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function buildTree(fs: FormStructure): TreeNode[] {
	const sections = fs.sections || [];
	const fields = fs.fields || [];
	const choices = getChoices(fs);

	if (sections.length === 0) {
		// No sections — flat list
		return fields.map((f) => fieldToNode(f, choices));
	}

	const sectionMap = new Map<string, TreeNode>();
	for (const sec of sections) {
		sectionMap.set(sec.id, {
			id: `section-${sec.id}`,
			type: 'section',
			label: getLabelEn(sec.title) || sec.id,
			sectionId: sec.id,
			conditional: !!sec.visibleIf,
			children: [],
		});
	}

	// Group fields by section → page
	const pageMap = new Map<string, Map<number, TreeNode>>();

	for (const field of fields) {
		const secId = field.section || '__none__';
		const page = field.page || 1;
		const secNode = secId !== '__none__' ? sectionMap.get(secId) : undefined;
		const pageKey = `${secId}-page-${page}`;

		if (secNode) {
			if (!pageMap.has(secId)) pageMap.set(secId, new Map());
			const pMap = pageMap.get(secId)!;
			if (!pMap.has(page)) {
				const pageNode: TreeNode = {
					id: `section-${secId}-page-${page}`,
					type: 'page',
					label: `Page ${page}`,
					sectionId: secId,
					page,
					children: [],
				};
				pMap.set(page, pageNode);
				secNode.children!.push(pageNode);
			}
			pMap.get(page)!.children!.push(fieldToNode(field, choices));
		} else {
			// Orphan fields — add a synthetic section
			if (!sectionMap.has('__none__')) {
				sectionMap.set('__none__', {
					id: 'section-__none__',
					type: 'section',
					label: 'Unsectioned Fields',
					children: [],
				});
			}
			sectionMap.get('__none__')!.children!.push(fieldToNode(field, choices));
		}
	}

	// Sort sections by order
	const sorted = [...sectionMap.values()].sort((a, b) => {
		const ao = sections.find((s) => s.id === a.sectionId)?.order ?? 999;
		const bo = sections.find((s) => s.id === b.sectionId)?.order ?? 999;
		return ao - bo;
	});

	// Sort page children by page number
	for (const sec of sorted) {
		if (sec.children) {
			sec.children.sort((a, b) => (a.page ?? 0) - (b.page ?? 0));
		}
	}

	return sorted;
}

function fieldToNode(field: SurveyField, choices: ChoiceLists): TreeNode {
	return {
		id: `field-${field.name}`,
		type: 'field',
		label: getLabelEn(field.label) || field.name,
		fieldType: field.type,
		sectionId: field.section,
		page: field.page,
		conditional: !!field.visibleIf,
		required: !!field.required,
		children: [],
	};
}

export function validateFormStructure(fs: FormStructure): BuilderError[] {
	const errors: BuilderError[] = [];
	const fields = fs.fields || [];
	const choices = getChoices(fs);

	// Unique field names
	const names = new Set<string>();
	for (const f of fields) {
		if (!f.name) {
			errors.push({ itemId: 'unknown', message: 'Field is missing a name' });
			continue;
		}
		if (names.has(f.name)) {
			errors.push({
				itemId: f.name,
				message: `Duplicate field name: ${f.name}`,
			});
		}
		names.add(f.name);

		// Choice list reference exists
		if (['select_one', 'select_many'].includes(f.type)) {
			const listName = f.parameters?.list_name;
			if (listName && !choices[listName]) {
				errors.push({
					itemId: f.name,
					message: `Choice list "${listName}" not found`,
				});
			}
		}

		// visibleIf references valid fields
		if (f.visibleIf) {
			const clauses = [...(f.visibleIf.all || []), ...(f.visibleIf.any || [])];
			for (const c of clauses) {
				if (c.field && !fields.find((ff) => ff.name === c.field)) {
					errors.push({
						itemId: f.name,
						message: `visibleIf references unknown field: ${c.field}`,
					});
				}
			}
		}
	}

	// Unique section IDs
	const secIds = new Set<string>();
	for (const sec of fs.sections || []) {
		if (secIds.has(sec.id)) {
			errors.push({
				itemId: `section-${sec.id}`,
				message: `Duplicate section id: ${sec.id}`,
			});
		}
		secIds.add(sec.id);
	}

	return errors;
}
