import React from 'react';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import type { TableColumnType } from 'antd';

export const createFilterIcon = (filtered: boolean) => (
    React.createElement(FilterAltRoundedIcon, {
        style: { color: filtered ? '#1677ff' : undefined }
    })
);

export const createFilterColumn = <T extends object>(
    filterDropdown: React.ComponentType<any>
): Partial<TableColumnType<T>> => ({
    filterIcon: createFilterIcon,
    filterDropdown,
});