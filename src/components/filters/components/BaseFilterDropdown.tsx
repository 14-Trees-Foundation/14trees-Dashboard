import React from 'react';

interface BaseFilterDropdownProps {
    children: React.ReactNode;
}

export const BaseFilterDropdown: React.FC<BaseFilterDropdownProps> = ({ children }) => {
    return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            {children}
        </div>
    );
};