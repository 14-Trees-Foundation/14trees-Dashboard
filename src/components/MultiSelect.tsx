import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

interface MultipleSelectProps {
    disabled?: boolean;
    disableLabel?: string;
    label: string;
    selected: string[];
    options: string[];
    onSelectionChange: (selected: string[]) => void;
}

const MultipleSelect: React.FC<MultipleSelectProps> = ({ disabled, disableLabel, label, selected, options, onSelectionChange }) => {
    const theme = useTheme();

    const handleChange = (event: React.SyntheticEvent, newValue: string[]) => {
        onSelectionChange(newValue);
    };

    return (
        <Autocomplete
            multiple
            disabled={disabled}
            id="tags-filled"
            options={options}
            value={selected}
            onChange={handleChange}
            freeSolo
            renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                    <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        style={{
                            fontWeight: selected.includes(option)
                                ? theme.typography.fontWeightMedium
                                : theme.typography.fontWeightRegular,
                        }}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={disabled && disableLabel ? disableLabel : label}
                    placeholder={label}
                />
            )}
        />
    );
};

export default MultipleSelect;
