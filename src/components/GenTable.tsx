import { Settings, KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { Button, Divider, IconButton, Tooltip } from '@mui/material';
import { Table, TableColumnsType } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { TableRowSelection } from 'antd/es/table/interface';
import { unparse } from 'papaparse';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Resizable } from "react-resizable";
import ColumnPreferences from './ColumnPreferences';
import './GenTable.css'

interface GeneralTableProps {
    loading?: boolean
    rows: any[] | undefined
    columns: TableColumnsType<any> | undefined
    totalRecords: number
    onDownload: () => Promise<any[]>
    page: number,
    pageSize?: number,
    onPaginationChange: (page: number, pageSize: number) => void
    onSelectionChanges?: (ids: number[]) => void
    summary?: (totalColumns: number) => React.ReactNode
    rowClassName?: (record: any, index: number) => string
    footer?: boolean
    fullHeight?: boolean
    tableName?: string
    scroll?: { x?: number, y?: number }
    expandable?: {
        render: (record: any) => React.ReactNode
        isExpandable: (record: any) => boolean
    }
    sequenceOrdering?: {
        enabled: boolean
        onMoveUp: (record: any, index: number) => void
        onMoveDown: (record: any, index: number) => void
        sequenceField?: string
    }
}

const ResizableTitle = (props: any) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    style={{
                        "position": "absolute",
                        "right": "-5px",
                        "bottom": 0,
                        "width": "10px",
                        "height": "100%",
                        "cursor": "col-resize",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

function GeneralTable({ loading, rows, columns, totalRecords, page, pageSize = 10, footer, fullHeight, tableName, scroll, onDownload, onSelectionChanges, onPaginationChange, summary, rowClassName, expandable, sequenceOrdering }: GeneralTableProps) {

    const [checkedList, setCheckedList] = useState(columns?.filter(item => !item.hidden)?.map((item) => item.key) ?? []);
    const [tableCols, setTableCols] = useState<any[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const isMountedRef = useRef(true);

    // Cleanup effect to prevent memory leaks
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    let rowSelection: TableRowSelection<AnyObject> | undefined;
    if (onSelectionChanges) {
        rowSelection = {
            type: 'checkbox',
            onChange: (selectedRowKeys) => {
                onSelectionChanges(selectedRowKeys as number[]);
            },
            getCheckboxProps: (record) => {
                return { name: record.id }
            },
        }
    }

    const handleDownload = async (data: any) => {
        const csv = unparse(data);

        let fileName = tableName ? tableName : "data";
        fileName += " - " + new Date().toDateString() + '.csv'

        // Create a Blob from the CSV string
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDataSourceParse = async () => {

        let dataSource = rows ? rows : [];
        if (rows?.length !== totalRecords) {
            try {
                dataSource = await onDownload();
                // Check if component is still mounted before proceeding
                if (!isMountedRef.current) return;
            } catch (error: any) {
                // Only show error if component is still mounted
                if (isMountedRef.current) {
                    toast.error(error.message);
                }
                return; 
            }
        }

        // Check if component is still mounted before processing data
        if (!isMountedRef.current) return;

        const data = dataSource.map((item) => {
            const row: any = {}
            columns?.forEach((column: any) => {
                const title = typeof column.title === 'string' ? column.title : column.key;
                if (column.dataIndex === 'srNo' || column.dataIndex === 'action') return;
                if (column.exportValue) {
                    // Use exportValue function if available
                    row[title] = column.exportValue(item[column.dataIndex], item, 0);
                } else if (column.dataIndex && item[column.dataIndex] !== undefined) {
                    // Use the raw data value directly for better CSV export
                    let value = item[column.dataIndex];
                    
                    // Special handling for dates
                    if (value instanceof Date || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/))) {
                        try {
                            const date = new Date(value);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear();
                            value = `${month}-${day}-${year}`;
                        } catch (e) {
                            // If date parsing fails, keep original value
                        }
                    }
                    
                    // Handle arrays
                    if (Array.isArray(value)) {
                        value = value.join(', ');
                    }
                    
                    row[title] = value;
                } else if (column.render) {
                    // Fallback to render function for columns without dataIndex
                    const value = column.render(item[column.dataIndex], item, 0);
                    // Try to extract meaningful text from React elements
                    if (React.isValidElement(value)) {
                        // If it's a React element, try to extract text content
                        if (value.props?.children !== undefined) {
                            if (typeof value.props.children === 'string' || typeof value.props.children === 'number') {
                                row[title] = value.props.children;
                            } else if (Array.isArray(value.props.children)) {
                                // Handle cases where children is an array
                                row[title] = value.props.children.filter(child => 
                                    typeof child === 'string' || typeof child === 'number'
                                ).join(' ');
                            } else {
                                row[title] = 'N/A';
                            }
                        } else {
                            row[title] = 'N/A';
                        }
                    } else {
                        row[title] = value || 'N/A';
                    }
                } else {
                    row[title] = item[column.key] || 'N/A';
                }
            })
            return row
        })

        await handleDownload(data);
        // Only show success message if component is still mounted
        if (isMountedRef.current) {
            toast.success('File downloaded successfully!');
        }
    }

    const handleColumnVisibilityChange = useCallback((newVisibleColumns: string[]) => {
        setVisibleColumns(newVisibleColumns);
        setCheckedList(newVisibleColumns);
    }, []);

    useEffect(() => {
        // Use visibleColumns from ColumnPreferences if available, otherwise fall back to checkedList
        const columnsToShow = visibleColumns.length > 0 ? visibleColumns : checkedList;
        let processedColumns = columns?.map((item: any) => ({
            ...item,
            hidden: !columnsToShow.includes(item.key as string),
        })) ?? [];

        // Add sequence ordering column if enabled
        if (sequenceOrdering?.enabled) {
            const sequenceColumn = {
                dataIndex: 'sequence_order',
                key: 'sequence_order',
                title: 'Order',
                align: 'center' as const,
                width: 100,
                fixed: 'left' as const,
                className: 'sequence-ordering-column',
                render: (_: any, record: any, index: number) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <Tooltip title="Move up">
                            <IconButton
                                size="small"
                                onClick={() => sequenceOrdering.onMoveUp(record, index)}
                                disabled={index === 0}
                                style={{ padding: '2px' }}
                            >
                                <KeyboardArrowUp fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Move down">
                            <IconButton
                                size="small"
                                onClick={() => sequenceOrdering.onMoveDown(record, index)}
                                disabled={!rows || index === rows.length - 1}
                                style={{ padding: '2px' }}
                            >
                                <KeyboardArrowDown fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </div>
                ),
                hidden: false
            };
            processedColumns = [sequenceColumn, ...processedColumns];
        }

        // Only update state if component is still mounted
        if (isMountedRef.current) {
            setTableCols(processedColumns);
        }
    }, [columns, checkedList, visibleColumns, sequenceOrdering, rows]);

    useEffect(() => {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
            setCheckedList(columns?.filter(item => !item.hidden)?.map((item) => item.key) ?? []);
        }
    }, [columns]);



    const components = {
        header: {
            cell: ResizableTitle
        }
    };

    const handleResize = (index: number) => (e: any, info: { size: any }) => {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
            setTableCols(prev => {
                const nextColumns = [...prev];
                nextColumns[index] = {
                    ...nextColumns[index],
                    width: info.size.width
                };
                return nextColumns as any[];
            });
        }
    };

    return (
        <Table
            loading={loading}
            style={{ 
                borderRadius: 20,
                width: '100%'
            }}
            dataSource={rows}
            rowKey={(record) => record.id || record.key || JSON.stringify(record)}
            columns={tableCols.map((col, index) => ({
                ...col,
                onHeaderCell: (column: any) => ({
                    width: column.width,
                    onResize: handleResize(index)
                })
            }))}
            pagination={{
                position: ['bottomRight'],
                current: page + 1,
                total: totalRecords,
                pageSize: pageSize,
                pageSizeOptions: [5, 10, 20, 50, 100],
                simple: true,
                showSizeChanger: true,
                onChange: onPaginationChange,
            }}
            components={components}
            rowClassName={rowClassName}
            rowSelection={rowSelection}
            scroll={scroll || (!fullHeight ? { y: 550 } : undefined)}
            footer={footer ? () => (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ColumnPreferences
                        columns={columns || []}
                        tableName={tableName || 'table'}
                        onColumnVisibilityChange={handleColumnVisibilityChange}
                    />
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", marginRight: '10px', }} />
                    <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}><strong>Export table data in a csv file:</strong></div>
                    <Button
                        color="success"
                        variant='contained'
                        onClick={handleDataSourceParse}>Export</Button>
                    <div></div>
                </div>
            ) : undefined}
            summary={summary ? 
                () => summary(tableCols.filter((col) => !col.hidden).length)
                : undefined
            }
            expandable={ expandable ? { expandedRowRender: expandable?.render, rowExpandable: expandable?.isExpandable } : undefined}
        />
    )
}

export default GeneralTable;