// import { Button } from '@mui/material';
import { Table, TableColumnsType } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { TableRowSelection } from 'antd/es/table/interface';
// import { CSVLink } from "react-csv"
// import { toast } from 'react-toastify';

interface TableComponentProps {
    dataSource: any[] | undefined
    columns: TableColumnsType<any> | undefined
    totalRecords: number
    fetchAllData: () => Promise<void>
    setPage: (value: React.SetStateAction<number>) => void
    setSrNoPage?: (value: React.SetStateAction<number>) => void
    handleSelectionChanges?: (ids: number[]) => void
}

function TableComponent({ dataSource, columns, totalRecords, fetchAllData, setPage, handleSelectionChanges, setSrNoPage }: TableComponentProps) {

    let rowSelection: TableRowSelection<AnyObject> | undefined;
    if (handleSelectionChanges) {
        rowSelection = {
            type: 'checkbox',
            onChange: (selectedRowKeys) => {
                handleSelectionChanges(selectedRowKeys as number[]);
            },
            getCheckboxProps: (record) => {
                return { name: record._id }
            },
        }
    }

    /* <Button  
        variant="contained"
    >
        <CSVLink
            data={dataSource ?? ''}
            asyncOnClick={true}
            className="btn btn-primary"
            onClick={(event, done) => {
                toast.info("The file is downloading")
                fetchAllData().then(() => { done(); toast.success("Downloaded the file")});
            }}
        >
            Export
        </CSVLink>
    </Button> */
    return (
        <Table
            style={{ borderRadius: 20 }}
            dataSource={dataSource}
            columns={columns}
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
            scroll={{ y: 700 }}
        />
    )
}

export default TableComponent;