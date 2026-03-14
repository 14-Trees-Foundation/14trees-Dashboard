// Natural language search types for onsite reports

export interface SearchContext {
  entity: 'trees' | 'users' | 'plots' | 'sites' | 'audits';
  action: 'find' | 'show' | 'list' | 'get' | 'search' | 'count';
  filters: SearchFilter[];
  dateRange?: DateRangeFilter;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: any;
  humanReadable: string;
}

export interface DateRangeFilter {
  field: 'audit_date' | 'planted_date' | 'created_at';
  start?: string;
  end?: string;
  relative?: 'today' | 'yesterday' | 'last_week' | 'last_month' | 'this_month' | 'this_year';
}

export interface ParsedQuery {
  success: boolean;
  context: SearchContext;
  confidence: number;
  alternatives?: SearchContext[];
  error?: string;
  humanReadable: string;
  suggestedQueries?: string[];
}

export interface SearchIntent {
  category: 'AUDIT_REPORT' | 'TREE_MANAGEMENT' | 'STAFF_PERFORMANCE' | 'SITE_ANALYSIS';
  subcategory: string;
  requiredFields: string[];
  optionalFields: string[];
  supportedFilters: string[];
}

export interface NaturalSearchConfig {
  intents: SearchIntent[];
  fieldMappings: Record<string, string>;
  aliases: Record<string, string[]>;
  patterns: SearchPattern[];
}

export interface SearchPattern {
  id: string;
  pattern: string;
  intent: string;
  fields: string[];
  example: string;
  confidence: number;
}

// Quick search suggestions
export interface SearchSuggestion {
  text: string;
  category: string;
  icon?: string;
  filters: SearchFilter[];
  description: string;
}

// Search result with metadata
export interface SearchResultMeta {
  query: string;
  parsedContext: SearchContext;
  executionTime: number;
  resultCount: number;
  appliedFilters: SearchFilter[];
  suggestions: SearchSuggestion[];
}