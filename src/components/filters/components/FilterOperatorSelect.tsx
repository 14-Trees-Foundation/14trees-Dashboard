import React from 'react';
import { Select } from 'antd';
import { FilterOperator } from '../types';

interface FilterOperatorSelectProps {
    value: FilterOperator;
    onChange: (value: FilterOperator) => void;
    operators: FilterOperator[];
    style?: React.CSSProperties;
}

const OPERATOR_LABELS: Record<FilterOperator, string> = {
    'contains': 'Contains',
    'equals': 'Equals',
    'startsWith': 'Starts with',
    'endsWith': 'Ends with',
    'isEmpty': 'Is empty',
    'isNotEmpty': 'Is not empty',
    'isAnyOf': 'Is Any Of',
    'between': 'Between',
    'greaterThan': 'Greater than',
    'lessThan': 'Less than',
};

export const FilterOperatorSelect: React.FC<FilterOperatorSelectProps> = ({
    value,
    onChange,
    operators,
    style = { marginBottom: 8, marginRight: 6 },
}) => {
    const options = operators.map(op => ({
        label: OPERATOR_LABELS[op],
        value: op,
    }));

    return (
        <Select
            value={value}
            style={style}
            options={options}
            styles={{ popup: { root: { zIndex: 10001 } } }}
            onChange={onChange}
        />
    );
};