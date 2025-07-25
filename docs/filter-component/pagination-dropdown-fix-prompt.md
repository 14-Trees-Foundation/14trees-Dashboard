# Pagination Dropdown Fix Prompt

## Issue Description
When applying filters to table columns, the pagination dropdown (page size selector) disappears.

## Quick Fix Prompt for AI Agent

```
I have a table component where the pagination dropdown disappears when I apply filters. Please analyze the table component and fix the pagination configuration.

The issue is typically in the pagination object configuration - it's missing these essential properties:
- showSizeChanger: true (enables page size dropdown)
- pageSizeOptions: [5, 10, 20, 50, 100] (defines available page sizes)
- pageSize: pageSize (current page size value)
- current: currentPage + 1 (current page number)

Please:
1. Find the table component with incomplete pagination config
2. Add missing pagination properties
3. Update component interface to accept pageSize and currentPage props
4. Update the parent component to pass these props
5. Fix the handlePageChange function to handle both page and pageSize changes

Reference the working GeneralTable.tsx component for the correct pagination configuration.
```

## Files Usually Involved
- Table component (usually in `/components/Table.tsx` or similar)
- Parent page component that uses the table
- Look for Antd Table component with incomplete pagination config

## Expected Solution Pattern
- Add `showSizeChanger: true` and `pageSizeOptions` to pagination config
- Pass `pageSize` and `currentPage` props from parent to table component
- Update handlePageChange to accept optional second parameter for page size changes