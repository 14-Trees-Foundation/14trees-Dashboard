import { Button } from "@mui/material";
import { GridFilterItem } from "@mui/x-data-grid";
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../../../components/Filter";
import { toast } from "react-toastify";

export const createBaseTreeColumns = (
    filters: Record<string, GridFilterItem>,
    handleSetFilters: (filters: Record<string, GridFilterItem>) => void,
    tags: string[]
) => [
    {
        dataIndex: "sapling_id",
        key: "sapling_id",
        title: "Sapling Id",
        align: "center",
        width: 100,
        ...getColumnSearchProps('sapling_id', filters, handleSetFilters)
    },
    {
        dataIndex: "plant_type",
        key: "plant_type",
        title: "Plant Type",
        align: "center",
        width: 200,
        ...getColumnSearchProps('plant_type', filters, handleSetFilters)
    },
    {
        dataIndex: "plot",
        key: "plot",
        title: "Plot Name",
        align: "center",
        width: 200,
        ...getColumnSearchProps('plot', filters, handleSetFilters)
    },
    {
        dataIndex: "tags",
        key: "tags",
        title: "Tags",
        align: "center",
        width: 200,
        ...getColumnSelectedItemFilter({ dataIndex: 'tags', filters, handleSetFilters, options: tags })
    },
];

export const createTreeSelectionColumns = (
    filters: Record<string, GridFilterItem>,
    handleSetFilters: (filters: Record<string, GridFilterItem>) => void,
    tags: string[],
    selectedTrees: any[],
    max: number,
    onSelectedTreesChange: (trees: any[]) => void
) => [
    ...createBaseTreeColumns(filters, handleSetFilters, tags),
    {
        dataIndex: "action",
        key: "action",
        title: "Actions",
        width: 100,
        align: "center",
        render: (value: any, record: any, index: number) => (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Button
                    variant='outlined'
                    color='success'
                    style={{ margin: "0 5px" }}
                    disabled={selectedTrees.findIndex(item => item.id === record.id) !== -1}
                    onClick={() => {
                        if (selectedTrees.length === max) {
                            toast.error("You have already selected maximum number of trees in the request!");
                            return;
                        }
                        onSelectedTreesChange([...selectedTrees, record]);
                    }}
                >
                    Select
                </Button>
            </div>
        ),
    },
];

export const createSelectedTreeColumns = (
    filters: Record<string, GridFilterItem>,
    handleSetFilters: (filters: Record<string, GridFilterItem>) => void,
    tags: string[],
    selectedTrees: any[],
    onSelectedTreesChange: (trees: any[]) => void
) => [
    ...createBaseTreeColumns(filters, handleSetFilters, tags),
    {
        dataIndex: "action",
        key: "action",
        title: "Actions",
        width: 100,
        align: "center",
        render: (value: any, record: any, index: number) => (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Button
                    variant='outlined'
                    color='error'
                    style={{ margin: "0 5px" }}
                    onClick={() => {
                        onSelectedTreesChange(selectedTrees.filter(item => item.id !== record.id));
                    }}
                >
                    Remove
                </Button>
            </div>
        ),
    },
];