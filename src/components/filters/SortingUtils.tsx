import React from 'react';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Order } from '../../types/common';

export const getSortIcon = (
    field: string, 
    order: 'ASC' | 'DESC' | undefined, 
    handleSortingChange: (param: { field: string, order?: 'ASC' | 'DESC' }) => void
) => {
    return (
        <div
            style={{ alignItems: "center", display: "flex", flexDirection: "column" }}
            onClick={() => {
                let newOrder: 'ASC' | 'DESC' | undefined = 'ASC';
                if (order === 'ASC') newOrder = 'DESC';
                else if (order === 'DESC') newOrder = undefined;
                handleSortingChange({ field, order: newOrder });
            }}
        >
            <ArrowDropUp style={{ margin: "-8px 0" }} htmlColor={order === 'ASC' ? '#00b96b' : "grey"} />
            <ArrowDropDown style={{ margin: "-8px 0" }} htmlColor={order === 'DESC' ? '#00b96b' : "grey"} />
        </div>
    );
};

export const getSortableHeader = (
    header: string, 
    key: string, 
    orderBy: Order[], 
    handleSortingChange: (param: { field: string, order?: 'ASC' | 'DESC' }) => void
) => {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
            {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
        </div>
    );
};