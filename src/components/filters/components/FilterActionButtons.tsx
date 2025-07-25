import React from 'react';
import { Button as Btn, Space } from 'antd';
import { FilterConfirmProps } from 'antd/es/table/interface';

interface FilterActionButtonsProps {
    onReset: () => void;
    onApply: () => void;
    onClose: () => void;
    resetDisabled?: boolean;
    applyDisabled?: boolean;
}

export const FilterActionButtons: React.FC<FilterActionButtonsProps> = ({
    onReset,
    onApply,
    onClose,
    resetDisabled = false,
    applyDisabled = false,
}) => {
    return (
        <Space style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Btn
                onClick={onReset}
                size="small"
                style={{ width: 90 }}
                disabled={resetDisabled}
            >
                Reset
            </Btn>
            <Btn
                size="small"
                onClick={onApply}
                disabled={applyDisabled}
            >
                Apply
            </Btn>
            <Btn
                size="small"
                onClick={onClose}
            >
                Close
            </Btn>
        </Space>
    );
};