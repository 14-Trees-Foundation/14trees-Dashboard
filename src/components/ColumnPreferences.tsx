import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';
import { Settings, RestartAlt } from '@mui/icons-material';
import { TableColumnsType } from 'antd';

interface ColumnPreferencesProps {
    columns: TableColumnsType<any>;
    tableName: string;
    onColumnVisibilityChange: (visibleColumns: string[]) => void;
    children?: React.ReactNode;
}

const ColumnPreferences: React.FC<ColumnPreferencesProps> = ({
    columns,
    tableName,
    onColumnVisibilityChange,
    children
}) => {
    const [open, setOpen] = useState(false);
    const [tempVisibleColumns, setTempVisibleColumns] = useState<string[]>([]);
    const [currentVisibleColumns, setCurrentVisibleColumns] = useState<string[]>([]);

    const storageKey = `column-preferences-${tableName}`;

    // Get default visible columns (columns that are not hidden by default)
    const getDefaultVisibleColumns = (): string[] => {
        return columns
            ?.filter(col => !col.hidden)
            ?.map(col => col.key as string)
            ?.filter(key => key) || [];
    };

    // Load preferences from localStorage
    const loadPreferences = (): string[] => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate that saved columns still exist in current columns
                const currentColumnKeys = columns?.map(col => col.key as string) || [];
                return parsed.filter((key: string) => currentColumnKeys.includes(key));
            }
        } catch (error) {
            console.error('Error loading column preferences:', error);
        }
        return getDefaultVisibleColumns();
    };

    // Save preferences to localStorage
    const savePreferences = (visibleColumns: string[]) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
        } catch (error) {
            console.error('Error saving column preferences:', error);
        }
    };

    // Initialize preferences
    useEffect(() => {
        const visibleColumns = loadPreferences();
        setCurrentVisibleColumns(visibleColumns);
        onColumnVisibilityChange(visibleColumns);
    }, [columns]);

    const handleOpen = () => {
        setTempVisibleColumns([...currentVisibleColumns]);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleColumnToggle = (columnKey: string) => {
        setTempVisibleColumns(prev => {
            if (prev.includes(columnKey)) {
                return prev.filter(key => key !== columnKey);
            } else {
                return [...prev, columnKey];
            }
        });
    };

    const handleSave = () => {
        setCurrentVisibleColumns(tempVisibleColumns);
        savePreferences(tempVisibleColumns);
        onColumnVisibilityChange(tempVisibleColumns);
        setOpen(false);
    };

    const handleCancel = () => {
        setTempVisibleColumns([...currentVisibleColumns]);
        setOpen(false);
    };

    const handleReset = () => {
        const defaultColumns = getDefaultVisibleColumns();
        setTempVisibleColumns(defaultColumns);
    };

    const handleSelectAll = () => {
        const allColumnKeys = columns?.map(col => col.key as string)?.filter(key => key) || [];
        setTempVisibleColumns(allColumnKeys);
    };

    const handleDeselectAll = () => {
        setTempVisibleColumns([]);
    };

    // Get column title for display
    const getColumnTitle = (column: any): string => {
        if (typeof column.title === 'string') {
            return column.title;
        }
        if (React.isValidElement(column.title)) {
            // Try to extract text from React element
            return column.title.props?.children || column.key || 'Unknown';
        }
        return column.key || 'Unknown';
    };

    return (
        <>
            {children ? (
                <div onClick={handleOpen} style={{ cursor: 'pointer' }}>
                    {children}
                </div>
            ) : (
                <Tooltip title="Column Settings">
                    <IconButton onClick={handleOpen}>
                        <Settings />
                    </IconButton>
                </Tooltip>
            )}

            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">Column Settings</Typography>
                        <Tooltip title="Reset to Default">
                            <IconButton onClick={handleReset} size="small">
                                <RestartAlt />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </DialogTitle>
                
                <DialogContent>
                    <Box mb={2}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Select which columns to display in the {tableName} table:
                        </Typography>
                        
                        <Box display="flex" gap={1} mb={2}>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={handleSelectAll}
                            >
                                Select All
                            </Button>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={handleDeselectAll}
                            >
                                Deselect All
                            </Button>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box>
                        {columns?.map((column) => {
                            const columnKey = column.key as string;
                            const columnTitle = getColumnTitle(column);
                            
                            // Skip action columns and sr no columns
                            if (columnKey === 'action' || columnKey === 'srNo') {
                                return null;
                            }

                            return (
                                <FormControlLabel
                                    key={columnKey}
                                    control={
                                        <Checkbox
                                            checked={tempVisibleColumns.includes(columnKey)}
                                            onChange={() => handleColumnToggle(columnKey)}
                                            size="small"
                                        />
                                    }
                                    label={columnTitle}
                                    sx={{ 
                                        display: 'block',
                                        mb: 0.5,
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '0.875rem'
                                        }
                                    }}
                                />
                            );
                        })}
                    </Box>

                    <Divider sx={{ mt: 2, mb: 1 }} />
                    
                    <Typography variant="caption" color="textSecondary">
                        {tempVisibleColumns.length} of {columns?.filter(col => col.key !== 'action' && col.key !== 'srNo').length || 0} columns selected
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCancel} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleReset} variant="outlined" color="warning">
                        Reset
                    </Button>
                    <Button onClick={handleSave} variant="outlined" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ColumnPreferences;