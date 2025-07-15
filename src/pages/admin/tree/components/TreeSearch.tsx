import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Chip, Tooltip } from '@mui/material';
import { Search, Clear, Info } from '@mui/icons-material';

interface TreeSearchProps {
    onSearch: (saplingIds: string[]) => void;
    onClear: () => void;
    placeholder?: string;
}

const TreeSearch: React.FC<TreeSearchProps> = ({ 
    onSearch, 
    onClear, 
    placeholder = "Enter sapling ID(s)" 
}) => {
    const [searchInput, setSearchInput] = useState('');
    const [parsedIds, setParsedIds] = useState<string[]>([]);

    const parseSearchInput = (input: string): string[] => {
        if (!input.trim()) return [];
        
        // Split by comma, space, or newline and filter out empty strings
        const ids = input
            .split(/[,\s\n]+/)
            .map(id => id.trim())
            .filter(id => id.length > 0);
        
        return ids;
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchInput(value);
        
        // Parse and show preview of IDs
        const ids = parseSearchInput(value);
        setParsedIds(ids);
    };

    const handleSearch = () => {
        const ids = parseSearchInput(searchInput);
        if (ids.length > 0) {
            onSearch(ids);
        }
    };

    const handleClear = () => {
        setSearchInput('');
        setParsedIds([]);
        onClear();
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSearch();
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TextField
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={4}
                    value={searchInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {searchInput && (
                                    <Button
                                        size="small"
                                        onClick={handleClear}
                                        startIcon={<Clear />}
                                        color="secondary"
                                    >
                                        Clear
                                    </Button>
                                )}
                                <Button
                                    size="small"
                                    onClick={handleSearch}
                                    startIcon={<Search />}
                                    variant="contained"
                                    disabled={parsedIds.length === 0}
                                >
                                    Search
                                </Button>
                            </Box>
                        ),
                    }}
                />
                <Tooltip title="Separate multiple IDs with comma, space, or new line" placement="top">
                    <Info sx={{ color: 'text.secondary', fontSize: '1.2rem', mt: 0.5 }} />
                </Tooltip>
            </Box>
            
            {parsedIds.length > 0 && (
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                        {parsedIds.length} sapling ID(s) detected:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {parsedIds.slice(0, 10).map((id, index) => (
                            <Chip
                                key={index}
                                label={id}
                                size="small"
                                variant="outlined"
                                color="primary"
                            />
                        ))}
                        {parsedIds.length > 10 && (
                            <Chip
                                label={`+${parsedIds.length - 10} more`}
                                size="small"
                                variant="outlined"
                                color="secondary"
                            />
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default TreeSearch;