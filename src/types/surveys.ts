export interface SurveyField {
	type: string;
	name: string;
	label: {
		en: string;
		mr: string;
	};
	hint?: {
		en: string;
		mr: string;
	};
	required: boolean;
	readOnly: boolean;
	parameters?: any;
	validation?: any;
}

export interface SurveyChoiceList {
	[listName: string]: Array<{
		name: string;
		label: {
			en: string;
			mr: string;
		};
	}>;
}

export interface SurveyFormStructure {
	fields: SurveyField[];
	choiceLists?: SurveyChoiceList;
	sections?: any[];
}

export interface SurveyConfig {
	_id: string;
	surveyId: string;
	formTitle: string;
	version: number;
	status: 'draft' | 'active' | 'archived';
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	permissions: string[];
	formStructure: SurveyFormStructure;
	metadata?: {
		responseCount: number;
		lastResponseAt?: string;
		tags?: string[];
	};
}

export interface SurveyConfigsResponse {
	configs: SurveyConfig[];
	total: number;
	offset: number;
	limit: number;
}

export interface SurveyFilters {
	status: 'all' | 'draft' | 'active' | 'archived';
	search: string;
	startDate: string | null;
	endDate: string | null;
}

export interface SurveyResponse {
	_id: string;
	responseId: string;
	surveyId: string;
	userId: string;
	submittedBy?: string;
	deviceId?: string;
	responses: Record<string, any>;
	images?: Array<{
		fieldName: string;
		s3Key: string;
		url: string;
		originalName?: string;
	}>;
	location?: {
		latitude: number;
		longitude: number;
	};
	createdAt: string;
	updatedAt?: string;
}

export interface SurveyResponsesData {
	responses: SurveyResponse[];
	total: number;
	offset: number;
	limit: number;
}

export interface ResponseStats {
	totalResponses: number;
	totalForms: number;
	activeForms: number;
	recentResponses: number;
	responsesBySurvey: Array<{
		_id: string;
		count: number;
		lastSubmitted: string;
	}>;
	responsesByUser: Array<{
		_id: string;
		count: number;
		lastSubmitted: string;
	}>;
	timeSeries: Array<{
		date: string;
		count: number;
	}>;
}

export interface ResponseFilters {
	surveyId: string;
	submittedBy: string;
	search: string;
	startDate: string | null;
	endDate: string | null;
}
