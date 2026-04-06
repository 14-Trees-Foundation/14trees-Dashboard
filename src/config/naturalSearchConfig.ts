import { NaturalSearchConfig, SearchIntent, SearchPattern } from '../types/naturalSearch';

// Configuration for natural language search
export const SEARCH_CONFIG: NaturalSearchConfig = {
  intents: [
    {
      category: 'AUDIT_REPORT',
      subcategory: 'TREES_BY_STAFF',
      requiredFields: ['user_name'],
      optionalFields: ['audit_date', 'site_name', 'plot_name'],
      supportedFilters: ['user_name', 'audit_date', 'site_name', 'plot_name', 'trees_audited', 'trees_added']
    },
    {
      category: 'AUDIT_REPORT',
      subcategory: 'TREES_BY_DATE',
      requiredFields: ['audit_date'],
      optionalFields: ['user_name', 'site_name', 'plot_name'],
      supportedFilters: ['audit_date', 'user_name', 'site_name', 'plot_name', 'trees_audited', 'trees_added']
    },
    {
      category: 'AUDIT_REPORT',
      subcategory: 'TREES_BY_LOCATION',
      requiredFields: ['site_name', 'plot_name'],
      optionalFields: ['user_name', 'audit_date'],
      supportedFilters: ['site_name', 'plot_name', 'user_name', 'audit_date', 'trees_audited', 'trees_added']
    },
    {
      category: 'STAFF_PERFORMANCE',
      subcategory: 'PRODUCTIVITY',
      requiredFields: ['user_name'],
      optionalFields: ['audit_date', 'trees_audited', 'trees_added'],
      supportedFilters: ['user_name', 'audit_date', 'trees_audited', 'trees_added']
    }
  ],
  
  fieldMappings: {
    'user_name': ['staff', 'person', 'employee', 'worker', 'field staff', 'member', 'team member'],
    'audit_date': ['date', 'day', 'when', 'time', 'audit date'],
    'site_name': ['site', 'location', 'area', 'place'],
    'plot_name': ['plot', 'section', 'zone'],
    'trees_audited': ['audited', 'checked', 'inspected', 'reviewed'],
    'trees_added': ['planted', 'added', 'new trees', 'installed']
  },
  
  aliases: {
    'today': ['today', 'now'],
    'yesterday': ['yesterday'],
    'this_week': ['this week', 'current week'],
    'last_week': ['last week', 'previous week'],
    'this_month': ['this month', 'current month'],
    'last_month': ['last month', 'previous month']
  },
  
  patterns: [
    {
      id: 'trees_by_staff_and_date',
      pattern: '(?:trees?|how many trees?) (?:planted|added) (?:by|from) (.+?) (?:on|during|at) (.+?)(?:\\?|$)',
      intent: 'AUDIT_REPORT/TREES_BY_STAFF',
      fields: ['user_name', 'audit_date'],
      example: 'trees planted by John on 2023-12-01',
      confidence: 0.9
    },
    {
      id: 'staff_activity_date',
      pattern: '(?:what|show|find|get) (?:did|has|all) (.+?) (?:do|plant|audit) (?:on|during|at) (.+?)(?:\\?|$)',
      intent: 'STAFF_PERFORMANCE/PRODUCTIVITY',
      fields: ['user_name', 'audit_date'],
      example: 'what did John do on 2023-12-01',
      confidence: 0.85
    },
    {
      id: 'trees_by_location',
      pattern: '(?:trees?|how many trees?) (?:in|at|from) (.+?)(?:\\?|$)',
      intent: 'AUDIT_REPORT/TREES_BY_LOCATION',
      fields: ['site_name'],
      example: 'trees in site A',
      confidence: 0.8
    },
    {
      id: 'audit_report_general',
      pattern: '(?:show|find|get|list) (?:all )?(?:trees?|audits?) (?:for|by|from) (.+?)(?:\\?|$)',
      intent: 'AUDIT_REPORT/TREES_BY_STAFF',
      fields: ['user_name'],
      example: 'show all trees for John',
      confidence: 0.75
    }
  ]
};

// Quick search suggestions for common queries
export const QUICK_SEARCH_SUGGESTIONS = [
  {
    text: 'Trees planted by John today',
    category: 'Staff Activity',
    icon: '👤',
    description: 'Find trees planted by a specific person today'
  },
  {
    text: 'All audits from last week',
    category: 'Time Period',
    icon: '📅',
    description: 'Show all audit activity from the previous week'
  },
  {
    text: 'Trees in Site A this month',
    category: 'Location',
    icon: '📍',
    description: 'View tree activity for a specific site this month'
  },
  {
    text: 'Staff who planted more than 10 trees',
    category: 'Performance',
    icon: '📊',
    description: 'Find high-performing staff members'
  },
  {
    text: 'Audits on 2023-12-01',
    category: 'Specific Date',
    icon: '🗓️',
    description: 'See all audit activity on a particular date'
  }
];

// Common date parsing patterns
export const DATE_PATTERNS = {
  today: () => new Date().toISOString().split('T')[0],
  yesterday: () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  },
  'last week': () => {
    const end = new Date();
    end.setDate(end.getDate() - 1); // Yesterday
    const start = new Date();
    start.setDate(start.getDate() - 7); // 7 days ago
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  },
  'this week': () => {
    const now = new Date();
    const start = new Date(now.setDate(now.getDate() - now.getDay()));
    const end = new Date();
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  },
  'this month': () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date();
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  },
  'last month': () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  }
};