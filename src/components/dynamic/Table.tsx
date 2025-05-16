import React from "react";
import { Table } from "antd";

type DynamicTableProps = {
    data: Record<string, any>[];
};

const formatColumnTitle = (key: string) => {
    const spaced = key
        .replace(/_/g, " ")              // snake_case -> snake case
        .replace(/([a-z])([A-Z])/g, "$1 $2"); // camelCase -> camel Case
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const DynamicTable: React.FC<DynamicTableProps> = ({ data }) => {
    if (!data || data.length === 0) return <div>No data available</div>;

    const columns = Object.keys(data[0]).map((key) => ({
        title: formatColumnTitle(key),
        dataIndex: key,
        key,
    }));

    const getRowKey = (record: Record<string, any>, index: number) =>
        record.id ?? index;

    return (
        <Table
            dataSource={data}
            columns={columns}
            rowKey={getRowKey}
            pagination={false}
        />
    );
};

export default DynamicTable;
