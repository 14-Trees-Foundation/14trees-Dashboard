import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Donation } from "../../../../../types/donation";
import AssignedTrees from "./AssignedTrees";
import { useState } from "react";
import { Tree } from "../../../../../types/tree";
import GeneralTable from "../../../../../components/GenTable";
import { TableColumnsType } from "antd";


interface Props {
    open: boolean,
    onClose: () => void
    donation: Donation
}

const MapTrees: React.FC<Props> = ({ open, onClose, donation }) => {

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedTrees, setSelectedTrees] = useState<Tree[]>([]);

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const handleSelect = (tree: Tree) => {
        setSelectedTrees(prev => [...prev, tree]);
    }

    const handleRemove = (tree: Tree) => {
        setSelectedTrees(prev => { return prev.filter(item => item.id !== tree.id) });
    }

    const columns: TableColumnsType<Tree> = [
        {
            dataIndex: "sapling_id",
            key: "sapling_id",
            title: "Sapling ID",
            width: 150,
            align: 'center',
        },
        {
            dataIndex: "plant_type",
            key: "plant_type",
            title: "Plant Type",
            width: 250,
            align: 'center',
        },
        {
            dataIndex: "plot",
            key: "plot",
            title: "Plot",
            width: 350,
            align: 'center',
            render: (value, record, index) => record?.plot,
        },
        {
            dataIndex: "assigned_to_name",
            key: "assigned_to_name",
            title: "Assigned To",
            width: 250,
            align: 'center',
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 300,
            align: "center",
            render: (value, record, index) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        style={{ margin: "0 5px", textTransform: 'none' }}
                        onClick={() => {
                            handleRemove(record);
                        }}>
                        Remove
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Dialog open={open} maxWidth="xl">
            <DialogTitle>#{donation.id}: Map trees planted during visit!</DialogTitle>
            <DialogContent dividers>
                <AssignedTrees selectedTrees={selectedTrees.map(tree => tree.id)} onSelect={handleSelect} />

                <Box sx={{ mt: 5 }}>
                    <Typography variant="h6" mb={1}>Below Trees will be mapped to this donation</Typography>
                    <GeneralTable
                        loading={false}
                        rows={selectedTrees.slice(page * pageSize, (page + 1) * pageSize)}
                        columns={columns}
                        totalRecords={selectedTrees.length}
                        page={page}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        onDownload={async () => { return selectedTrees }}
                        tableName="Trees"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={onClose}
                    style={{ textTransform: 'none' }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MapTrees;