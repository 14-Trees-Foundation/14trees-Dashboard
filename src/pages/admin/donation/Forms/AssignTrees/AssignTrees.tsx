import { GridFilterItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ApiClient from "../../../../../api/apiClient/apiClient";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, FormControlLabel, Checkbox, Box, Tabs, Tab, Divider } from "@mui/material";
import GeneralTable from "../../../../../components/GenTable";
import { TableColumnsType } from "antd";
import getColumnSearchProps from "../../../../../components/Filter";
import { UserAddOutlined } from "@ant-design/icons";
import { Donation, DonationTree, DonationUser } from "../../../../../types/donation";
import { toast } from "react-toastify";
import AssignmentList from "./AssignmentList";
import AssignedTrees from "./AssignedTrees";


interface AssignTreesProps {
    donationId: number;
    donation: Donation;
    open: boolean;
    onClose: () => void;
}

interface DonationUsersListProps {
    assignmentList: { tree_id: number, du_id: number, sapling_id: string, plant_type: string, recipient_name: string, assignee_name: string }[];
    setUsersCount: (value: number) => void;
    donationId: number;
    open: boolean;
    onClose: () => void;
    onSubmit: (donationUser: DonationUser) => void;
}

const DonationUsersList = ({ donationId, open, setUsersCount, onClose, onSubmit, assignmentList }: DonationUsersListProps) => {

    // handle loading, pagination, filters, etc.
    const [indexToDonationUserMap, setIndexToDonationUserMap] = useState<Record<number, DonationUser>>({});
    const [donationUsers, setDonationUsers] = useState<DonationUser[]>([]);
    const [totalDonationUsers, setTotalDonationUsers] = useState(10);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const getFilters = (donationId: number, filters: Record<string, GridFilterItem>) => {
        const filterArray = Object.values(filters);
        filterArray.push(
            { columnField: 'donation_id', operatorValue: 'equals', value: donationId },
        );
        return filterArray;
    }

    const getDonationUsers = async (offset: number, limit: number, filters: GridFilterItem[]) => {
        const apiClient = new ApiClient();

        setLoading(true);
        try {
            const donationUsers = await apiClient.getDonationUsers(offset, limit, filters);
            setTotalDonationUsers(donationUsers.total);
            setIndexToDonationUserMap(prev => {
                const newData = { ...prev };
                donationUsers.results.forEach((user, index) => {
                    newData[offset + index] = user;
                });
                return newData;
            });

            if (filters.length === 1) setUsersCount(Number(donationUsers.total));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getDonationUsersData = async () => {
        getDonationUsers(page * pageSize, pageSize, getFilters(donationId, filters));
    }

    const handleDownload = async () => {
        const apiClient = new ApiClient();
        const donationUsers = await apiClient.getDonationUsers(0, totalDonationUsers, getFilters(donationId, filters));
        return donationUsers.results;
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            const maxIndex = Math.min(page * pageSize + pageSize, totalDonationUsers);
            const donationUsers = [];
            for (let i = page * pageSize; i < maxIndex; i++) {
                if (!indexToDonationUserMap[i]) {
                    getDonationUsersData();
                    break;
                }
                donationUsers.push(indexToDonationUserMap[i]);
            }

            setDonationUsers(donationUsers);
        }, 300);

        return () => clearTimeout(handler);
    }, [page, pageSize, indexToDonationUserMap]);

    useEffect(() => {
        setPage(0);
        setPageSize(10);
        setIndexToDonationUserMap({});
    }, [filters]);

    const columns: TableColumnsType<any> = [
        {
            dataIndex: 'recipient_name',
            key: 'Recipient Name',
            title: 'Recipient Name',
            align: 'center',
            width: 120,
            ...getColumnSearchProps('recipient_name', filters, handleSetFilters)
        },
        {
            dataIndex: 'assignee_name',
            key: 'Assignee Name',
            title: 'Assignee Name',
            align: 'center',
            width: 120,
            ...getColumnSearchProps('assignee_name', filters, handleSetFilters)
        },
        {
            dataIndex: 'trees_count',
            key: 'Required Trees',
            title: 'Required Trees',
            align: 'center',
            width: 120,
        },
        {
            dataIndex: 'assigned_trees',
            key: 'Already Assigned',
            title: 'Already Assigned',
            align: 'center',
            width: 100,
        },
        {
            dataIndex: 'selected',
            key: 'Selected For Assignment',
            title: 'Selected For Assignment',
            align: 'center',
            width: 150,
            render: (value, record) => {
                return assignmentList.filter(item => item.du_id === record.id).length;
            }
        },
        {
            dataIndex: 'actions',
            key: 'Actions',
            title: 'Actions',
            align: 'center',
            width: 120,
            render: (value, record) => {
                return <Button
                    variant="outlined"
                    color="success"
                    disabled={assignmentList.filter(item => item.du_id === record.id).length + Number(record.assigned_trees) >= Number(record.trees_count)}
                    onClick={() => {
                        onSubmit(record);
                        onClose();
                    }}
                >Select</Button>;
            }
        }
    ];

    return (
        <Dialog open={open} fullWidth maxWidth="xl">
            <DialogTitle>Donation Users</DialogTitle>
            <DialogContent dividers>
                <GeneralTable
                    rows={donationUsers}
                    columns={columns}
                    totalRecords={totalDonationUsers}
                    onPaginationChange={handlePaginationChange}
                    onDownload={handleDownload}
                    page={page}
                    pageSize={pageSize}
                    loading={loading}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={onClose}
                >Close</Button>
            </DialogActions>
        </Dialog>
    )
}

const AssignTrees: React.FC<AssignTreesProps> = ({ donationId, donation, open, onClose }) => {

    // Get the trees for the donation, facilitate loading, filters, pagination, etc.
    const [indexToTreeMap, setIndexToTreeMap] = useState<Record<number, DonationTree>>({});
    const [treesList, setTreesList] = useState<DonationTree[]>([]);
    const [totalTrees, setTotalTrees] = useState(10);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [autoAssign, setAutoAssign] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const [tabValue, setTabValue] = useState("assign");
    const [totalUsers, setTotalUsers] = useState(0);
    const [assignSponsor, setAssignSponsor] = useState(false);

    // tree - user mapping
    const [selectedTree, setSelectedTree] = useState<DonationTree | null>(null);
    const [assignmentList, setAssignmentList] = useState<{ tree_id: number, du_id: number, sapling_id: string, plant_type: string, recipient_name: string, assignee_name: string }[]>([]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const getFilters = (donationId: number, filters: Record<string, GridFilterItem>) => {
        const filterArray = Object.values(filters);
        filterArray.push(
            { columnField: 'donation_id', operatorValue: 'equals', value: donationId },
            { columnField: 'assigned_to', operatorValue: 'isEmpty', value: null }
        );
        return filterArray;
    }

    const getTrees = async (offset: number, limit: number, filters: GridFilterItem[]) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const trees = await apiClient.getDonationTrees(offset, limit, filters);
            setTotalTrees(trees.total);
            setIndexToTreeMap(prev => {
                const newData = { ...prev };
                trees.results.forEach((tree, index) => {
                    newData[offset + index] = tree;
                });
                return newData;
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getTreesData = async () => {
        getTrees(page * pageSize, pageSize, getFilters(donationId, filters));
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            const trees = [];
            const maxIndex = Math.min(page * pageSize + pageSize, totalTrees);
            for (let i = page * pageSize; i < maxIndex; i++) {
                if (!indexToTreeMap[i]) {
                    getTreesData();
                    break;
                }
                trees.push(indexToTreeMap[i]);
            }

            setTreesList(trees);
        }, 300);

        return () => clearTimeout(handler);
    }, [page, pageSize, indexToTreeMap, totalTrees]);

    useEffect(() => {
        if (open) {
            setPage(0);
            setPageSize(10);
            setTotalTrees(10);
            setIndexToTreeMap({});
            setAssignmentList([]);
        }
    }, [filters, donationId, open]);

    const handleDownload = async () => {
        const apiClient = new ApiClient();
        const trees = await apiClient.getTrees(0, totalTrees, getFilters(donationId, filters));
        return trees.results;
    }

    const handleAssignToSponsor = async () => {
        try {
            const apiClient = new ApiClient();
            await apiClient.createDonationUser({
                donation_id: donation.id,
                recipient_email: donation.user_email,
                recipient_name: donation.user_name,
                assignee_email: donation.user_email,
                assignee_name: donation.user_name,
                trees_count: donation.trees_count  || 0,
                profile_image_url: null
            })
        } catch (error: any) {
            toast.error(error.message);
            return;
        }

        handleAssign();
    }

    const handleAssign = async () => {
        setIsAssigning(true);
        try {
            const apiClient = new ApiClient();

            if (autoAssign) {
                // Auto-assign all trees
                await apiClient.assignTreesToDonationUsers(donationId, true, []);
                toast.success('Trees automatically assigned successfully');
            } else {
                // Manual assignment with the assignment map
                const userTrees = assignmentList.map(item => ({
                    du_id: item.du_id,
                    tree_id: item.tree_id
                }));

                await apiClient.assignTreesToDonationUsers(donationId, false, userTrees);
                toast.success('Trees assigned successfully');
            }

            onClose();
            setAssignmentList([]);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsAssigning(false);
            setPage(0);
            setPageSize(10);
            setIndexToTreeMap({});
        }
    }

    const handleUserTreeMapping = (donationUser: DonationUser) => {
        if (selectedTree) {
            setAssignmentList(prev => [...prev,
            {
                tree_id: selectedTree.id, du_id: donationUser.id,
                sapling_id: selectedTree.sapling_id, plant_type: selectedTree.plant_type || '',
                recipient_name: donationUser.recipient_name || '', assignee_name: donationUser.assignee_name || ''
            }]);

            setSelectedTree(null);
            setUserDialogOpen(false);
        }
    }

    const handleRemoveAssignment = (treeId: number) => {
        setAssignmentList(prev => prev.filter(item => item.tree_id !== treeId));
    }

    const columns: TableColumnsType<any> = [
        {
            dataIndex: 'sapling_id',
            key: 'Sapling Id', title: 'Sapling Id',
            align: 'center', width: 120,
            ...getColumnSearchProps('sapling_id', filters, handleSetFilters)
        },
        {
            dataIndex: 'plant_type',
            key: 'Plant Type',
            title: 'Plant Type',
            align: 'center',
            width: 120,
            ...getColumnSearchProps('plant_type', filters, handleSetFilters)
        },
        {
            dataIndex: 'actions',
            key: 'Actions',
            title: 'Actions',
            align: 'center',
            width: 120,
            render: (value, record) => {
                return <Button
                    onClick={() => {
                        setSelectedTree(record);
                        setUserDialogOpen(true);
                    }}
                    variant="outlined"
                    color="success"
                    disabled={assignmentList.some(item => item.tree_id === record.id)}
                ><UserAddOutlined /></Button>;
            }
        }
    ];

    return (
        <Dialog open={open} fullWidth maxWidth="xl">
            {/* <DialogTitle>Donation #{donationId}: Trees Assignment</DialogTitle> */}
            <DialogContent dividers>

                <Tabs
                    value={tabValue}
                    onChange={(_, value) => setTabValue(value)}
                    sx={{
                        marginBottom: 2,
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'success.main'
                        }
                    }}
                    variant="fullWidth"
                    textColor="inherit"
                    indicatorColor="primary"
                >
                    <Tab
                        label="Assign Trees"
                        value="assign"
                    />
                    <Tab
                        label="Unassign Trees"
                        value="unassign"
                    />
                </Tabs>
                {tabValue === "assign" && (
                    <>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            Assign trees to donation recipients!
                        </Typography>
                        <FormControlLabel
                            control={<Checkbox disabled={assignmentList.length > 0} checked={autoAssign} onChange={(e) => setAutoAssign(e.target.checked)} />}
                            label={
                                <>
                                    <Typography variant="body1">
                                        Automatically assign trees to donation recipients
                                    </Typography>
                                    <Typography variant="body2">
                                        This will automatically assign {totalTrees} {totalTrees > 1 ? 'trees' : 'tree'} to donation recipients based on the donation recipients' needs.
                                    </Typography>
                                </>
                            }
                            sx={{ marginBottom: 2 }}
                        />
                        <GeneralTable
                            rows={treesList}
                            columns={columns}
                            totalRecords={totalTrees}
                            onDownload={handleDownload}
                            onPaginationChange={handlePaginationChange}
                            page={page}
                            pageSize={pageSize}
                            loading={loading}
                        />

                        {assignmentList.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                    Assignment List
                                </Typography>
                                <AssignmentList
                                    assignments={assignmentList}
                                    onRemoveAssignment={handleRemoveAssignment}
                                />
                            </Box>
                        )}

                        <DonationUsersList donationId={donationId} open={userDialogOpen} onClose={() => setUserDialogOpen(false)} onSubmit={handleUserTreeMapping} setUsersCount={setTotalUsers} assignmentList={assignmentList} />
                        <Divider sx={{ marginBottom: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                onClick={onClose}
                                variant="outlined"
                                color="error"
                                disabled={isAssigning}
                            >Cancel</Button>
                            <Button
                                onClick={autoAssign && totalUsers === 0 ? () => { setAssignSponsor(true); } : handleAssign}
                                variant="contained"
                                color="success"
                                disabled={isAssigning || (!autoAssign && assignmentList.length === 0)}
                            >{isAssigning ? 'Assigning...' : 'Assign'}</Button>
                        </Box>
                    </>
                )}
                {tabValue === "unassign" && (
                    <AssignedTrees onClose={onClose} donationId={donationId} />
                )}

                <Dialog open={assignSponsor}>
                    <DialogContent dividers>
                        <Typography variant='h6'>
                            Warning:
                        </Typography>
                        <Typography variant='body1'>
                            You haven't provided recipient details for assigning trees. All the reserved trees will be assigned to sponsor.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => { setAssignSponsor(false) }}
                            variant="outlined"
                            color="error"
                        >Cancel</Button>
                        <Button
                            onClick={handleAssignToSponsor}
                            variant="contained"
                            color="success"
                            disabled={isAssigning || (!autoAssign && assignmentList.length === 0)}
                        >{isAssigning ? 'Assigning...' : 'Assign'}</Button>
                    </DialogActions>
                </Dialog>

            </DialogContent>
        </Dialog>
    )
}

export default AssignTrees;