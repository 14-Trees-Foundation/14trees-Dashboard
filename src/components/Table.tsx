import { Settings } from '@mui/icons-material';
import { Box, Button, Divider, IconButton } from '@mui/material';
import { Checkbox, Dropdown, MenuProps, Table, TableColumnsType } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { TableRowSelection } from 'antd/es/table/interface';
import { Parser } from 'json2csv';
import { ReactElement, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Resizable } from "react-resizable";

interface TableComponentProps {
    loading?: boolean
    dataSource: any[] | undefined
    columns: TableColumnsType<any> | undefined
    totalRecords: number
    fetchAllData: () => Promise<void>
    setPageSize: (value: React.SetStateAction<number>) => void
    setPage: (value: React.SetStateAction<number>) => void
    setSrNoPage?: (value: React.SetStateAction<number>) => void
    handleSelectionChanges?: (ids: number[]) => void
    tableName?: string,
    isExpandable?: boolean
    expandableFunction?: (record: any) =>
        ReactElement
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
                        // "z-index": 1,
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

function TableComponent({ loading, dataSource, columns, totalRecords, tableName, fetchAllData, setPageSize, setPage, handleSelectionChanges, setSrNoPage, isExpandable, expandableFunction }: TableComponentProps) {

    const [download, setDownload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [checkedList, setCheckedList] = useState(columns?.map((item) => item.key) ?? []);
    const [open, setOpen] = useState(false);
    const [tableCols, setTableCols] = useState<any[]>([]);

    let rowSelection: TableRowSelection<AnyObject> | undefined;
    if (handleSelectionChanges) {
        rowSelection = {
            type: 'checkbox',
            onChange: (selectedRowKeys) => {
                handleSelectionChanges(selectedRowKeys as number[]);
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

    const expandable = {
        expandedRowRender: (record: any) => expandableFunction ? expandableFunction(record) : null,
        rowExpandable: (record: any) => { return isExpandable ? isExpandable : false },
    }

    const handleDataSourceParse = async () => {
        const data = dataSource?.map((item) => {
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
        setDownload(false);
        toast.success('File downloaded successfully!');
    }

    useEffect(() => {
        if (download) {
            handleDataSourceParse();
        }

    }, [dataSource]);

    useEffect(() => {
        if (loading !== undefined) setIsLoading(loading);
    }, [loading]);

    useEffect(() => {
        setTableCols(columns?.map((item: any) => ({
            ...item,
            hidden: !checkedList.includes(item.key as string),
        })) ?? []);
    }, [columns, checkedList]);

    const handlePageChange = (page: number, pageSize: number) => {
        if (dataSource && page * pageSize > dataSource.length) {
            const pageNo = Math.floor(dataSource.length / pageSize);
            setPage(pageNo);
            setPageSize(pageSize);
            setSrNoPage && setSrNoPage(pageNo);
        } else {
            setPageSize(pageSize);
            setSrNoPage && setSrNoPage(page - 1);
        }
    }

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
            loading={isLoading}
            style={{ borderRadius: 20 }}
            dataSource={dataSource}
            columns={tableCols.map((col, index) => ({
                ...col,
                onHeaderCell: (column: any) => ({
                    width: column.width,
                    onResize: handleResize(index)
                })
            }))}
            expandable={isExpandable ? expandable : undefined}
            pagination={{
                position: ['bottomRight'],
                defaultCurrent: 1,
                total: totalRecords,
                simple: true,
                onChange: handlePageChange,
            }}
            components={components}
            rowSelection={rowSelection}
            scroll={{ y: 550 }}
            footer={() => (
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
                        disabled={download || Number(totalRecords) === 0}
                        onClick={() => {
                            if (dataSource?.length === totalRecords) handleDataSourceParse();
                            else {
                                fetchAllData();
                                setDownload(true);
                            }
                        }}>Export</Button>
                    <div></div>
                </div>
            )}
        />
    )
}

export default TableComponent;