# Filter Component Highlighting Fix

## Issue
Some table columns don't show the blue filter icon when filters are applied, while others work correctly.

## Root Cause
Ant Design's Table component shows the blue filter icon based on the `filtered` parameter passed to the `filterIcon` function. This parameter is automatically set to `true` when a column has a `filteredValue` property with a non-null/non-empty value.

## Solution
Add the `filteredValue` property to all columns that use filter functions (`getColumnSearchProps`, `getColumnSelectedItemFilter`, `getColumnDateFilter`, `getColumnNumericFilter`).

## Pattern to Apply
For any column that has a filter function, add this line:
```typescript
filteredValue: filters['dataIndex']?.value || null,
```

Where `dataIndex` matches the column's dataIndex value.

## Quick Fix Prompt
"Fix filter highlighting issue: Add `filteredValue: filters['dataIndex']?.value || null,` property to all table columns that use filter functions (getColumnSearchProps, getColumnSelectedItemFilter, getColumnDateFilter, getColumnNumericFilter) but are missing the filteredValue property. Replace 'dataIndex' with the actual dataIndex value for each column."

## Example
```typescript
// Before (no blue icon when filtered)
{
    dataIndex: "user_name",
    key: "Donor Name", 
    title: "Donor Name",
    align: "center",
    width: 200,
    ...getColumnSearchProps('user_name', filters, handleSetFilters)
},

// After (shows blue icon when filtered)
{
    dataIndex: "user_name",
    key: "Donor Name",
    title: "Donor Name", 
    align: "center",
    width: 200,
    filteredValue: filters['user_name']?.value || null,
    ...getColumnSearchProps('user_name', filters, handleSetFilters)
},
```