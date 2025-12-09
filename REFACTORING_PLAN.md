# 14Trees Dashboard - Refactoring Plan

## 📋 Overview
This document outlines the comprehensive refactoring plan for the 14Trees Dashboard codebase to improve reusability, maintainability, and code organization.

## 🎯 Current State Analysis

### Components Created in Recent Session
1. **DailyAuditChart.tsx** - Audit-specific chart component
2. **StructuredSearch.tsx** - Advanced search with dropdown filters
3. **QuickSearchPresets.tsx** - One-click preset searches
4. **SearchHelpDialog.tsx** - Interactive help guide
5. **Tab Caching System** - Performance optimization for tab switching

### Identified Issues
- Components are tightly coupled to audit data structure
- Hardcoded configurations and field names
- Limited reusability across different data types
- No consistent pattern for search interfaces

## 🔧 Proposed Refactoring Steps

### Phase 1: Extract Chart Component ⭐ HIGH PRIORITY
**Target:** `DailyAuditChart.tsx` → Generic `TimeSeriesChart`

**Current Issues:**
```typescript
// Hardcoded audit-specific structure
interface DailyAuditChartProps {
  data: UserPlotTreesAuditRow[];
  loading?: boolean;
}
```

**Proposed Solution:**
```typescript
// Generic time-series chart
interface TimeSeriesChartProps<T> {
  data: T[];
  config: {
    dateField: keyof T;
    valueFields: Array<{
      key: keyof T;
      label: string;
      color: string;
      strokeDasharray?: string;
      chartType?: 'line' | 'bar' | 'area';
    }>;
    title: string;
    aggregationPeriod: 'daily' | 'weekly' | 'monthly';
    timeRange: number; // days to show
  };
  loading?: boolean;
  onDataPointClick?: (data: any) => void;
}
```

**New Structure:**
```
src/components/common/charts/
├── TimeSeriesChart/
│   ├── TimeSeriesChart.tsx
│   ├── types.ts
│   ├── utils/
│   │   ├── dataAggregation.ts
│   │   ├── dateHelpers.ts
│   │   └── chartFormatters.ts
│   └── index.ts
```

**Benefits:**
- Reusable across tree growth, donations, site activity
- Configurable chart types and styling
- Consistent data processing logic

### Phase 2: Extract Search Components ⭐ HIGH PRIORITY
**Target:** `StructuredSearch.tsx` → Generic `AdvancedSearchForm`

**Current Issues:**
```typescript
// Hardcoded field structure
interface SearchCriteria {
  dateType: 'single' | 'range' | 'preset' | '';
  staff: any;
  site: any;
  plot: any;
}
```

**Proposed Solution:**
```typescript
interface FieldConfig {
  name: string;
  type: 'date' | 'dateRange' | 'select' | 'autocomplete' | 'number' | 'text';
  label: string;
  section?: string; // Group fields into sections
  validation?: ValidationRule[];
  options?: {
    endpoint?: string;
    staticData?: any[];
    dependencies?: string[]; // Field dependencies
    placeholder?: string;
  };
}

interface AdvancedSearchProps {
  fields: FieldConfig[];
  onSearch: (filters: FilterItem[]) => void;
  onClear: () => void;
  loading?: boolean;
  initialValues?: Record<string, any>;
}
```

**New Structure:**
```
src/components/common/search/
├── AdvancedSearchForm/
│   ├── AdvancedSearchForm.tsx
│   ├── components/
│   │   ├── FieldRenderer.tsx
│   │   ├── DateFieldGroup.tsx
│   │   ├── AutocompleteField.tsx
│   │   └── FilterChipsDisplay.tsx
│   ├── hooks/
│   │   ├── useSearchForm.ts
│   │   └── useFieldDependencies.ts
│   ├── utils/
│   │   ├── filterBuilders.ts
│   │   └── validation.ts
│   └── types.ts
```

### Phase 3: Extract Quick Search System 📦 MEDIUM PRIORITY
**Target:** `QuickSearchPresets.tsx` → Configurable preset system

**Proposed Solution:**
```typescript
interface PresetConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category?: string;
  filterRules: FilterRule[];
}

interface FilterRule {
  field: string;
  operator: 'equals' | 'between' | 'greaterThan' | 'contains';
  valueGenerator: () => any; // Dynamic value generation
  static?: boolean;
}
```

**New Structure:**
```
src/components/common/search/
├── QuickSearchPresets/
│   ├── QuickSearchPresets.tsx
│   ├── presetConfigurations/
│   │   ├── auditPresets.ts
│   │   ├── donationPresets.ts
│   │   └── userPresets.ts
│   └── types.ts
```

### Phase 4: Create Tabbed Interface System 📦 MEDIUM PRIORITY
**Target:** Extract tab caching and management logic

**Proposed Solution:**
```typescript
interface TabConfig<T> {
  id: string;
  label: string;
  component: React.ComponentType<T>;
  cacheStrategy: 'none' | 'results' | 'full';
}

interface TabbedInterfaceProps<T> {
  tabs: TabConfig<T>[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  commonProps?: T;
}
```

### Phase 5: Service Layer Optimization 🔧 LOW PRIORITY
**Target:** `structuredSearchService.ts` → Generic data fetching service

**Current Issues:**
- Hardcoded API endpoints
- No error boundary handling
- Cache expiration not configurable

**Proposed Solution:**
```typescript
interface DataService<T> {
  endpoint: string;
  cacheKey: string;
  cacheDuration: number;
  transformer?: (data: any) => T[];
}

class GenericDataService {
  async getCachedOptions<T>(config: DataService<T>): Promise<T[]>;
  async invalidateCache(cacheKey: string): Promise<void>;
  async prefetchData<T>(configs: DataService<T>[]): Promise<void>;
}
```

## 🔍 Additional Refactoring Opportunities

### 1. Theme and Styling Consistency 🎨
**Current Issues:**
- Inline styles scattered across components
- Repeated color values and spacing
- No centralized design tokens

**Proposed Solution:**
```typescript
// src/theme/designTokens.ts
export const designTokens = {
  colors: {
    primary: {
      lightGreen: '#9BC53D',
      darkGreen: '#1F3625',
      brown: '#573D1C'
    },
    gradients: {
      card: 'linear-gradient(145deg, #9faca3, #bdccc2)',
      hover: 'linear-gradient(145deg, #a5b2a9, #c3d2c8)'
    }
  },
  shadows: {
    card: '7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9'
  },
  spacing: {
    card: { padding: 2, margin: 2 },
    section: { margin: 1.5, gap: 1.5 }
  }
};
```

### 2. Form Validation System 📝
**Current Issues:**
- No consistent validation patterns
- Error handling scattered
- No reusable validation rules

**Proposed Solution:**
```typescript
// src/utils/validation/
interface ValidationRule {
  type: 'required' | 'minLength' | 'email' | 'dateRange' | 'custom';
  message: string;
  validator?: (value: any) => boolean;
  params?: any;
}

class FormValidator {
  validateField(value: any, rules: ValidationRule[]): ValidationResult;
  validateForm(data: Record<string, any>, schema: ValidationSchema): FormValidationResult;
}
```

### 3. Data Processing Utilities 🔧
**Current Issues:**
- Date manipulation scattered across components
- No consistent data transformation patterns
- Repeated aggregation logic

**Proposed Solution:**
```typescript
// src/utils/data/
export class DataProcessor {
  static aggregateByDate<T>(data: T[], dateField: keyof T, period: 'daily' | 'weekly'): AggregatedData[];
  static filterByDateRange<T>(data: T[], dateField: keyof T, range: DateRange): T[];
  static groupBy<T>(data: T[], key: keyof T): Record<string, T[]>;
  static sortBy<T>(data: T[], key: keyof T, direction: 'asc' | 'desc'): T[];
}
```

### 4. Error Boundary and Loading States 🚨
**Current Issues:**
- No global error boundaries
- Inconsistent loading patterns
- No graceful degradation

**Proposed Solution:**
```typescript
// src/components/common/feedback/
interface ErrorBoundaryProps {
  fallback: React.ComponentType<{ error: Error }>;
  onError?: (error: Error) => void;
}

interface LoadingStateProps {
  loading: boolean;
  error?: Error;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}
```

### 5. Type Safety Improvements 📋
**Current Issues:**
- `any` types in multiple places
- No runtime type validation
- Inconsistent interfaces

**Proposed Solution:**
```typescript
// Strict typing for all data structures
interface StrictAuditRow {
  readonly id: number;
  readonly auditDate: Date;
  readonly userName: string;
  readonly siteName: string;
  readonly plotName: string;
  readonly treesAudited: number;
  readonly treesAdded: number;
}

// Runtime validation using zod or similar
const AuditRowSchema = z.object({
  id: z.number(),
  auditDate: z.date(),
  userName: z.string(),
  // ... etc
});
```

## 📊 Implementation Priority Matrix

| Component | Reusability | Complexity | Impact | Priority |
|-----------|-------------|------------|---------|----------|
| TimeSeriesChart | High | Medium | High | ⭐⭐⭐ |
| AdvancedSearch | High | High | High | ⭐⭐⭐ |
| Theme System | High | Low | Medium | ⭐⭐ |
| QuickSearch | Medium | Low | Medium | ⭐⭐ |
| TabbedInterface | Medium | Medium | Low | ⭐ |
| Data Utils | High | Low | Low | ⭐ |

## 🚀 Migration Strategy

### Phase 1: Foundation (Week 1-2)
1. Create `src/components/common/` structure
2. Extract TimeSeriesChart with backward compatibility
3. Implement design token system

### Phase 2: Search System (Week 3-4)
1. Extract AdvancedSearchForm component
2. Create field configuration system
3. Migrate existing search implementations

### Phase 3: Polish & Optimize (Week 5-6)
1. Add comprehensive error handling
2. Implement data processing utilities
3. Create documentation and examples

### Phase 4: Testing & Rollout (Week 7-8)
1. Unit tests for all new components
2. Integration testing
3. Performance optimization
4. Documentation completion

## 📚 Success Metrics

### Code Quality
- [ ] Reduce code duplication by 60%
- [ ] Achieve 90%+ TypeScript strict mode compliance
- [ ] Zero `any` types in new components

### Performance
- [ ] Improve bundle size by removing duplicate logic
- [ ] Reduce component re-renders through better memoization
- [ ] Faster development time for new features

## 🚀 Performance Optimization Roadmap

### Immediate Improvements (Phase 1) ⭐
- **Hook Optimization**: Extract `useDebouncedSearch` for reusable search patterns
- **Component Memoization**: Add `React.memo` to expensive components (identified: `UserList`, `TreeList`) 
- **Effect Cleanup**: Standardize cleanup patterns for memory leak prevention
- **Callback Optimization**: Use `useCallback` for event handlers to prevent unnecessary re-renders

### Medium-term Optimizations (Phase 2) 📦
- **Virtual Scrolling**: Implement for large data tables (audit reports, user lists, memory galleries)
- **Bundle Splitting**: Code-split chart library imports (recharts only when needed)
- **API Caching**: Implement SWR/React-Query for intelligent API response caching
- **Image Lazy Loading**: Progressive loading for memory images and user avatars

### Advanced Optimizations (Phase 3) 🔧
- **Service Worker**: Offline-first architecture for field operations
- **Data Prefetching**: Predictive loading based on user navigation patterns
- **Image Optimization**: WebP format with lazy loading for memory galleries
- **Tree Shaking**: Optimize bundle by removing unused Material-UI components

### Performance Monitoring 📊
```typescript
// Add to existing components
const PerformanceMonitor = ({ componentName, children }) => {
  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      if (duration > 16) { // Flag slow renders (>16ms)
        console.warn(`🐌 Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  });
  return children;
};

// Usage in development
<PerformanceMonitor componentName="TreesAuditReport">
  <TreesAuditReport {...props} />
</PerformanceMonitor>
```

### Memory Management Best Practices 🧠
```typescript
// Cleanup pattern for subscriptions and timers
useEffect(() => {
  let mounted = true;
  const timeoutId = setTimeout(() => {
    if (mounted) setData(newData);
  }, 300);
  
  return () => {
    mounted = false;
    clearTimeout(timeoutId);
  };
}, [dependencies]);

// Memoization for expensive calculations
const processedData = useMemo(() => {
  return data.map(item => expensiveProcessing(item));
}, [data]);
```

---

*Document generated after implementing structured search system with performance caching, daily audit chart visualization, and comprehensive refactoring analysis.*

### Developer Experience
- [ ] Consistent API patterns across all search interfaces
- [ ] Comprehensive component documentation
- [ ] Storybook examples for all reusable components

## 🔗 Dependencies & Tools

### Required Dependencies
- `react-hook-form` - For advanced form handling
- `zod` - Runtime type validation
- `date-fns` - Consistent date manipulation
- `lodash-es` - Utility functions

### Development Tools
- `@storybook/react` - Component documentation
- `@testing-library/react` - Component testing
- `typescript-strict` - Enhanced type checking

---

**Last Updated:** December 2025  
**Status:** Planning Phase  
**Next Session Focus:** Phase 1 Implementation - TimeSeriesChart extraction