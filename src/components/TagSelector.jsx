import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const TagSelector = ( { tagsList, value, handleChange, margin = "none" } ) => {
    const [tags, setTags] = useState(tagsList ?? []);
    const [selectedTags, setSelectedTags] = useState(value ?? []);

    const handleCreateTag = (event, newValue) => {
        if (newValue && newValue.inputValue) {
            const newTag = newValue.inputValue;
            setTags([...tags, newTag]);
            setSelectedTags([...selectedTags, newTag]);
            handleChange([...selectedTags, newTag]);
        } else {
            const newValues = []
            newValue.forEach(value => {
                if (typeof value === "string") newValues.push(value);
                else if (value && value.inputValue) newValues.push(value.inputValue);
            })
            setSelectedTags(newValues);
            handleChange(newValues);
        }
    };

    return (
        <Autocomplete
            multiple
            value={selectedTags}
            onChange={handleCreateTag}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                // Suggest the creation of a new tag
                if (params.inputValue !== '') {
                    filtered.push({
                        inputValue: params.inputValue,
                        title: `Add "${params.inputValue}"`,
                    });
                }

                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={tags}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                // Regular option
                return option;
            }}
            renderOption={(props, option) => (
                <li {...props}>
                    {option.title || option}
                </li>
            )}
            freeSolo
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        variant="outlined"
                        label={option.inputValue || option}
                        {...getTagProps({ index })}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Tags"
                    placeholder="Select tags"
                    margin={margin}
                />
            )}
        />
    );
};

export default TagSelector;
