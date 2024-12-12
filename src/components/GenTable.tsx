import { Settings } from '@mui/icons-material';
import { Button, Divider, IconButton } from '@mui/material';
import { Checkbox, Dropdown, MenuProps, Table, TableColumnsType } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { TableRowSelection } from 'antd/es/table/interface';
import { Parser } from 'json2csv';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Resizable } from "react-resizable";
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
    tableName?: string
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

function GeneralTable({ loading, rows, columns, totalRecords, page, pageSize = 10, footer, tableName, onDownload, onSelectionChanges, onPaginationChange, summary, rowClassName }: GeneralTableProps) {

    const [checkedList, setCheckedList] = useState(columns?.map((item) => item.key) ?? []);
    const [open, setOpen] = useState(false);
    const [tableCols, setTableCols] = useState<any[]>([]);

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

    const handleDownload = (data: any) => {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

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
            } catch (error: any) {
                toast.error(error.message);
                return; 
            }
        }

        const data = dataSource.map((item) => {
            const row: any = {}
            columns?.forEach((column: any) => {
                const title = typeof column.title === 'string' ? column.title : column.dataIndex;
                if (column.dataIndex === 'srNo' || column.dataIndex === 'action') return;
                if (column.render) {
                    const value = column.render(item[column.dataIndex], item, 0);
                    row[title] = value?.props?.children ? value.props.children : value;
                }
                else row[title] = item[column.dataIndex];
            })
            return row
        })

        handleDownload(data);
        toast.success('File downloaded successfully!');
    }

    useEffect(() => {
        setTableCols(columns?.map((item: any) => ({
            ...item,
            hidden: !checkedList.includes(item.key as string),
        })) ?? []);
    }, [columns, checkedList]);

    useEffect(() => {
        setCheckedList(columns?.map((item) => item.key) ?? []);
    }, [columns]);

    const handleOpenChange = (flag: boolean, info: { source: 'menu' | 'trigger' }) => {
        if (info.source === 'trigger') setOpen(flag);
    };

    const handleColumnsSelection = (key: string) => {
        const newSelected = checkedList.includes(key) ? checkedList.filter((item) => item !== key) : [...checkedList, key];
        setCheckedList(newSelected);
    }

    const items: MenuProps['items'] = columns?.map((column: any) => {
        const title = typeof column.title === 'string' ? column.title : column.dataIndex;
        return {
            key: column.dataIndex,
            label: <Checkbox checked={checkedList.includes(column.key)} onChange={() => handleColumnsSelection(column.key)}>{title}</Checkbox>
        }
    })

    const components = {
        header: {
            cell: ResizableTitle
        }
    };

    const handleResize = (index: number) => (e: any, info: { size: any }) => {
        setTableCols(prev => {
            const nextColumns = [...prev];
            nextColumns[index] = {
                ...nextColumns[index],
                width: info.size.width
            };
            return nextColumns as any[];
        });
    };

    return (
        <Table
            loading={loading}
            style={{ 
                borderRadius: 20,
                width: '100%'
            }}
            dataSource={rows}
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
                onChange: onPaginationChange,
            }}
            components={components}
            rowClassName={rowClassName}
            rowSelection={rowSelection}
            scroll={{ y: 550 }}
            footer={footer ? () => (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Dropdown
                        menu={{ items }}
                        placement="bottomLeft"
                        open={open}
                        onOpenChange={handleOpenChange}
                        trigger={['click']}
                    >
                        <IconButton sx={{ marginLeft: 'auto' }}><Settings /></IconButton>
                    </Dropdown>
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
        />
    )
}

export default GeneralTable;