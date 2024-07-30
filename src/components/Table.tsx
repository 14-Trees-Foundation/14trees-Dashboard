import { Button } from '@mui/material';
import { Table, TableColumnsType } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { TableRowSelection } from 'antd/es/table/interface';
import { Parser } from 'json2csv';
import { ReactElement, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface TableComponentProps {
    loading?: boolean
    dataSource: any[] | undefined
    columns: TableColumnsType<any> | undefined
    totalRecords: number
    fetchAllData: () => Promise<void>
    setPage: (value: React.SetStateAction<number>) => void
    setSrNoPage?: (value: React.SetStateAction<number>) => void
    handleSelectionChanges?: (ids: number[]) => void
    isExpandable?: boolean
    expandableFunction?: (record: any) => 
        ReactElement
}

function TableComponent({ loading, dataSource, columns, totalRecords, fetchAllData, setPage, handleSelectionChanges, setSrNoPage, isExpandable, expandableFunction }: TableComponentProps) {

    const [download, setDownload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
    
        // Create a Blob from the CSV string
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const expandable = {
        expandedRowRender: (record: any)=> expandableFunction?expandableFunction(record):null,
        rowExpandable: (record: any) => { return isExpandable?isExpandable:false},
      }

    useEffect(() => {
        if (download) {
            const data = dataSource?.map((item) => {
                const row: any = {}
                columns?.forEach((column: any) => {
                    if (column.dataIndex === 'srNo' || column.dataIndex === 'action') return;
                    if (column.render) {
                        const value = column.render(item[column.dataIndex], item, 0);
                        row[column.title] = value?.props?.children ? value.props.children : value;
                    }
                    else row[column.title] = item[column.dataIndex];
                })
                return row
            })
            handleDownload(data);
            setDownload(false);
            toast.success('File downloaded successfully!');
        }

    }, [dataSource]);

    useEffect(() => {
        if (loading !== undefined) setIsLoading(loading);
    }, [loading]);

    return (
        <Table
            loading={isLoading}
            style={{ borderRadius: 20 }}
            dataSource={dataSource}
            columns={columns}
            expandable={isExpandable ? expandable : undefined}
            pagination={{ 
                position: ['bottomRight'], 
                showSizeChanger: false, 
                pageSize: 10, 
                defaultCurrent: 1, 
                total: totalRecords, 
                simple: true, 
                onChange: (page, pageSize) => { 
                    if (dataSource && page * pageSize > dataSource.length) setPage(page - 1); 
                    setSrNoPage && setSrNoPage(page-1);
                } }}
            rowSelection={rowSelection}
            scroll={{ y: 550 }}
            footer={() => (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}><strong>Export table data in a csv file:</strong></div>
                    <Button 
                        color="success" 
                        variant='contained'
                        onClick={() =>{
                        fetchAllData();
                        setDownload(true);
                    }}>Export</Button>
                    <div></div>
                </div>
            )}
        />
    )
}

export default TableComponent;