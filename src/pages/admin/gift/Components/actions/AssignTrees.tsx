import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Modal, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { GridFilterItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ApiClient from "../../../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { GiftCardUser, GiftRequestUser } from "../../../../../types/gift_card";
import getColumnSearchProps from "../../../../../components/Filter";
import { TableColumnsType } from "antd";
import GeneralTable from "../../../../../components/GenTable";
import { AccountCircleOutlined } from "@mui/icons-material";

interface AssignTreesProps {
    giftCardRequestId: number
    open: boolean
    onClose: () => void
    onSubmit: () => void
}

const AssignTrees: React.FC<AssignTreesProps> = ({ giftCardRequestId, open, onClose, onSubmit }) => {

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [trees, setTrees] = useState<GiftCardUser[]>([]);
    const [selectedTree, setSelectedTree] = useState<GiftCardUser | null>(null);
    const [autoAssign, setAutoAssign] = useState(false);

    // Users
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [users, setUsers] = useState<GiftRequestUser[]>([]);
    const [page2, setPage2] = useState(0);
    const [pageSize2, setPageSize2] = useState(10);

    const handlePaginationChange2 = (page: number, pageSize: number) => {
        setPage2(page - 1);
        setPageSize2(pageSize);
    }

    const getBookedTrees = async (giftRequestId: number) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const bookedTreesResp = await apiClient.getBookedGiftTrees(giftRequestId, 0, -1);
            setTrees(bookedTreesResp.results.map(item => ({ ...item, key: item.id })));
        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    }

    const getGiftRequestUsers = async (giftRequestId: number) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const usersResp = await apiClient.getGiftRequestUsers(giftRequestId);
            setUsers(usersResp);
        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        getBookedTrees(giftCardRequestId);
        getGiftRequestUsers(giftCardRequestId);
    }, [giftCardRequestId]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const handleUnAssign = (selectedTree: GiftCardUser) => {
        const idx = trees.findIndex(tree => selectedTree.id === tree.id);
        if (idx !== -1) {
            const newData = [...trees];
            newData[idx].gift_request_user_id = null
            newData[idx].assignee_name = undefined
            newData[idx].recipient_name = undefined

            setTrees(newData);
        }
    }

    const columns: TableColumnsType<GiftCardUser> = [
        {
            dataIndex: "sapling_id",
            key: "sapling_id",
            title: "Sapling ID",
            align: "center",
            width: 120,
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
            dataIndex: "recipient_name",
            key: "recipient_name",
            title: "Recipient",
            align: "center",
            width: 200,
            ...getColumnSearchProps('recipient_name', filters, handleSetFilters)
        },
        {
            dataIndex: "assignee_name",
            key: "assignee_name",
            title: "Assignee",
            align: "center",
            width: 200,
            ...getColumnSearchProps('assignee_name', filters, handleSetFilters)
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 150,
            align: "center",
            render: (value, record, index) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant='outlined'
                        color='success'
                        style={{ margin: "0 5px" }}
                        onClick={() => { setIsUserModalOpen(true); setSelectedTree(record); }}
                    >
                        <AccountCircleOutlined />
                    </Button>
                    {record.gift_request_user_id && <Button
                        variant='outlined'
                        color='error'
                        style={{ margin: "0 5px", textTransform: 'none' }}
                        onClick={() => { handleUnAssign(record); }}
                    >
                        Unassign
                    </Button>}
                </div>
            ),
        },
    ];

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const handleDownload = async () => {
        return trees;
    }

    const handleUserSelection = (selectedUser: GiftRequestUser) => {
        if (!selectedTree) return;

        const idx = trees.findIndex(tree => selectedTree.id === tree.id);
        if (idx !== -1) {
            const newData = [...trees];
            newData[idx].gift_request_user_id = selectedUser.id
            newData[idx].assignee_name = selectedUser.assignee_name
            newData[idx].recipient_name = selectedUser.recipient_name

            setTrees(newData);
        }

        setIsUserModalOpen(false);
    }

    const userColumns: any[] = [
        {
            dataIndex: "assignee_name",
            key: "assignee_name",
            title: "Assignee Name",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "assignee_email",
            key: "assignee_email",
            title: "Assignee Email",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 100,
            align: "center",
            render: (value: any, record: any, index: number) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant='outlined'
                        color='success'
                        style={{ margin: "0 5px" }}
                        onClick={() => { handleUserSelection(record); }}
                    >
                        Select
                    </Button>
                </div>
            ),
        },
    ]

    // Assignment
    const handleAutoAssignTrees = async () => {
        onClose();

        const apiClient = new ApiClient();
        try {
            await apiClient.assignTrees(giftCardRequestId, trees, autoAssign);
            toast.success("Successfully assigned trees to users!");
            onSubmit();
        } catch (error: any) {
            toast.error(error.message);
        }
    }


    return (
        <Dialog open={open} fullWidth maxWidth="lg">
            <DialogTitle>Assign trees to tree card request recipients</DialogTitle>
            <DialogContent dividers>
                <Box>
                    <GeneralTable
                        loading={loading}
                        rows={trees.slice(page * pageSize, (page + 1) * pageSize)}
                        columns={columns}
                        totalRecords={trees.length}
                        page={page}
                        onPaginationChange={handlePaginationChange}
                        onDownload={handleDownload}
                        footer
                        tableName="Booked trees"
                    />

                    <Box
                        mt={2}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography mr={10}>Do you want to auto assign trees?</Typography>
                        <ToggleButtonGroup
                            color="success"
                            value={autoAssign ? "yes" : "no"}
                            exclusive
                            onChange={(e, value) => { setAutoAssign(value === "yes" ? true : false); }}
                            aria-label="Platform"
                            size="small"
                        >
                            <ToggleButton value="yes">Yes</ToggleButton>
                            <ToggleButton value="no">No</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Modal open={isUserModalOpen} aria-labelledby="tree-select-modal-title">
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '90%', // Responsive width
                                maxWidth: '80vw',
                                maxHeight: '90vh',
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: 24,
                                overflow: 'auto',
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <GeneralTable
                                rows={users.filter(user => trees.filter(tree => tree.gift_request_user_id === user.id).length < user.gifted_trees)}
                                columns={userColumns}
                                totalRecords={users.filter(user => trees.filter(tree => tree.gift_request_user_id === user.id).length < user.gifted_trees).length}
                                page={page2}
                                pageSize={pageSize2}
                                onPaginationChange={handlePaginationChange2}
                                onDownload={async () => { return Object.values(users) }}
                                tableName="Users"
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={() => { setIsUserModalOpen(false) }} variant="outlined" color='error' sx={{ mr: 1 }}>Cancel</Button>
                            </Box>
                        </Box>
                    </Modal>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Cancel
                </Button>
                <Button onClick={handleAutoAssignTrees} color="success" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>

    );
}

export default AssignTrees;