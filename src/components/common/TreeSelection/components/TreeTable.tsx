import React, { useCallback } from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';
import GeneralTable from '../../../GenTable';
import getColumnSearchProps, { getColumnSelectedItemFilter } from '../../../Filter';
import { Tree } from '../types';

interface TreeTableProps {
  title: string;
  trees: Tree[];
  selectedTrees: Tree[];
  associatedTrees?: Tree[];
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onTreeSelect?: (tree: Tree) => void;
  onTreeRemove?: (tree: Tree) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onViewDetails?: (tree: Tree) => void;
  mode?: 'batch' | 'immediate';
  maxSelection?: number;
  emptyMessage?: string;
  tags?: string[];
  filters?: Record<string, any>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  isSelectedTable?: boolean;
  showBulkActions?: boolean;
  hideTitle?: boolean;
  customActions?: (tree: Tree) => React.ReactNode;
  hideDefaultActions?: boolean;
}

const TreeTable: React.FC<TreeTableProps> = ({
  title,
  trees,
  selectedTrees,
  associatedTrees = [],
  loading = false,
  total = 0,
  page = 0,
  pageSize = 10,
  onPaginationChange,
  onTreeSelect,
  onTreeRemove,
  onSelectAll,
  onDeselectAll,
  onViewDetails,
  mode = 'batch',
  maxSelection,
  emptyMessage,
  tags = [],
  filters = {},
  onFiltersChange,
  isSelectedTable = false,
  showBulkActions = true,
  hideTitle = false,
  customActions,
  hideDefaultActions = false,
}) => {
  const handleSetFilters = useCallback((newFilters: Record<string, any>) => {
    onFiltersChange?.(newFilters);
  }, [onFiltersChange]);

  const handlePagination = (newPage: number, newPageSize: number) => {
    onPaginationChange?.(newPage - 1, newPageSize); // Convert from 1-based to 0-based
  };

  const getSelectionStats = () => {
    const selectedCount = selectedTrees.length;
    const maxText = maxSelection ? `/${maxSelection}` : '';
    return `${selectedCount}${maxText}`;
  };

  const canSelectMore = () => {
    if (!maxSelection) return true;
    return selectedTrees.length < maxSelection;
  };

  // Define columns for the table
  const baseColumns = [
    {
      dataIndex: "sapling_id",
      key: "sapling_id",
      title: "Sapling ID",
      align: "center" as const,
      width: 120,
      ...getColumnSearchProps('sapling_id', filters, handleSetFilters)
    },
    {
      dataIndex: "plant_type",
      key: "plant_type", 
      title: "Plant Type",
      align: "center" as const,
      width: 200,
      ...getColumnSearchProps('plant_type', filters, handleSetFilters)
    },
    {
      dataIndex: "plot",
      key: "plot",
      title: "Plot Name", 
      align: "center" as const,
      width: 200,
      ...getColumnSearchProps('plot', filters, handleSetFilters)
    },
    {
      dataIndex: "tags",
      key: "tags",
      title: "Tags",
      align: "center" as const,
      width: 200,
      ...getColumnSelectedItemFilter({ 
        dataIndex: 'tags', 
        filters, 
        handleSetFilters, 
        options: tags 
      })
    },
  ];

  // Add action column based on whether it's selected table or available table
  const actionColumn = {
    dataIndex: "action",
    key: "action", 
    title: "Actions",
    width: 100,
    align: "center" as const,
    render: (value: any, record: any, index: number) => (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {customActions ? (
          customActions(record)
        ) : !hideDefaultActions ? (
          isSelectedTable ? (
            <Button
              variant='outlined'
              color='error'
              size="small"
              onClick={() => onTreeRemove?.(record)}
            >
              Remove
            </Button>
          ) : (
            <Button
              variant='outlined'
              color='success'
              size="small"
              disabled={selectedTrees.findIndex(item => item.id === record.id) !== -1 || !canSelectMore()}
              onClick={() => onTreeSelect?.(record)}
            >
              Select
            </Button>
          )
        ) : null}
      </div>
    ),
  };

  const columns = [
    ...baseColumns,
    ...(customActions || !hideDefaultActions ? [actionColumn] : [])
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with title and stats */}
      {!hideTitle && (
        <Box sx={{ p: 2, pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" component="div">
              {title}
              {total > 0 && (
                <Chip
                  label={`${total} total`}
                  size="small"
                  sx={{ ml: 1 }}
                  variant="outlined"
                />
              )}
            </Typography>
            
            {mode === 'batch' && (
              <Chip
                label={`${getSelectionStats()} selected`}
                color="primary"
                size="small"
              />
            )}
          </Box>

          {/* Bulk Actions for available trees */}
          {showBulkActions && !isSelectedTable && mode === 'batch' && trees.length > 0 && (
            <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
              <Button
                size="small"
                onClick={onSelectAll}
                disabled={loading || !canSelectMore()}
                variant="outlined"
                color="primary"
              >
                Select All on Page
              </Button>
              <Button
                size="small"
                onClick={onDeselectAll}
                disabled={loading || selectedTrees.length === 0}
                variant="outlined"
                color="error"
              >
                Clear All Selected
              </Button>
              {maxSelection && (
                <Typography variant="caption" component="span" sx={{ alignSelf: 'center', ml: 1 }}>
                  Max: {maxSelection} trees
                </Typography>
              )}
            </Box>
          )}

          {/* Bulk Actions for selected trees */}
          {showBulkActions && isSelectedTable && mode === 'batch' && selectedTrees.length > 0 && (
            <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
              <Button
                size="small"
                onClick={onDeselectAll}
                disabled={loading || selectedTrees.length === 0}
                variant="outlined"
                color="error"
              >
                Remove All
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Table */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <GeneralTable
          loading={loading}
          rows={trees}
          columns={columns}
          totalRecords={total}
          page={page}
          pageSize={pageSize}
          onPaginationChange={handlePagination}
          onDownload={async () => trees}
          tableName={title.replace(/\s+/g, '_')}
          scroll={{ y: 400 }}
          footer={false}
        />
      </Box>
    </Box>
  );
};

export default TreeTable;