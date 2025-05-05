// component to display the trees that have been assigned to donation recipients
// actions to unassign all the trees from the donation recipients
// actions to unassign a selected trees from the donation recipient

import { Button, Typography, Box, FormControlLabel, Checkbox, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { DonationTree } from "../../../../../types/donation";
import ApiClient from "../../../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { TableColumnType } from "antd";
import GeneralTable from "../../../../../components/GenTable";
import getColumnSearchProps from "../../../../../components/Filter";
import UnassignmentList from "./UnassignmentList";
import UnassignConfirmationDialog from "./UnassignConfirmationDialog";

interface AssignedTreesProps {
    donationId: number;
}

const AssignedTrees: React.FC<AssignedTreesProps> = ({ donationId }) => {


    const [loading, setLoading] = useState(false);
    const [indexToTreeMap, setIndexToTreeMap] = useState<Record<number, DonationTree>>({});
    const [trees, setTrees] = useState<DonationTree[]>([]);
    const [totalTrees, setTotalTrees] = useState(10);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [unassignAll, setUnassignAll] = useState(false);
    const [open, setOpen] = useState(false);
    const [unassignLoading, setUnassignLoading] = useState(false);

    const [unassignedTrees, setUnassignedTrees] = useState<DonationTree[]>([]);

    const handlerPaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const getFilters = (donationId: number, filters: Record<string, any>) => {
        const filtersArray = Object.values(filters);
        filtersArray.push(
            {
                columnField: "donation_id",
                operatorValue: "equals",
                value: donationId
            },
            {
                columnField: "assigned_to",
                operatorValue: "isNotEmpty",
                value: null
            }
        );
        return filtersArray;
    }

    const getDonationTrees = async (offset: number, limit: number, filters?: any[]) => {
        setLoading(true);

        try {
            const api = new ApiClient();
            const response = await api.getDonationTrees(offset, limit, filters);
            setTotalTrees(response.total);
            setIndexToTreeMap(prev => {
                const newIndexToTreeMap = { ...prev };
                response.results.forEach((tree, index) => {
                    newIndexToTreeMap[offset + index] = tree;
                });
                return newIndexToTreeMap;
            });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const getDonationTreesData = () => {
        getDonationTrees(page * pageSize, pageSize, getFilters(donationId, filters));
    }
    useEffect(() => {

        const handler = setTimeout(() => {

            const trees: DonationTree[] = [];
            const maxTrees = Math.min(page * pageSize + pageSize, totalTrees);
            for (let i = page * pageSize; i < maxTrees; i++) {
                if (!indexToTreeMap[i]) {
                    getDonationTreesData();
                    break;
                }
                trees.push(indexToTreeMap[i]);
            }
            setTrees(trees);

        }, 300);

        return () => clearTimeout(handler);
    }, [page, pageSize, indexToTreeMap, totalTrees]);

    useEffect(() => {
        setPage(0);
        setPageSize(10);
        setIndexToTreeMap({});
        setTotalTrees(10);
        setUnassignedTrees([]);
    }, [donationId, filters]);


    const handleDownload = async () => {
        const api = new ApiClient();
        const response = await api.getDonationTrees(0, -1, getFilters(donationId, filters));
        return response.results;
    }

    const handleRemoveTree = (tree: DonationTree) => {
        setUnassignedTrees(prev => prev.filter(t => t.id !== tree.id));
    }

    const handleUnassignTree = (tree: DonationTree) => {
        setUnassignedTrees(prev => [...prev, tree]);
        setUnassignAll(false);
    }

    const handleUnassign = async (unassignAll: boolean = false) => {
        setUnassignLoading(true);
        try {
            const api = new ApiClient();
            await api.unassignDonationTrees(donationId, unassignAll, unassignedTrees.map(tree => tree.id));
            setUnassignedTrees([]);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUnassignLoading(false);
            setOpen(false);
            setUnassignAll(false);
            setPage(0);
            setPageSize(10);
            setIndexToTreeMap({});
            setTotalTrees(10);
        }
     }


    const columns: TableColumnType<DonationTree>[] = [
        {
            dataIndex: "sapling_id",
            title: "Sapling ID",
            key: "Sapling ID",
            width: 100,
            ...getColumnSearchProps("sapling_id", filters, setFilters)
        },
        {
            dataIndex: "plant_type",
            title: "Plant Type",
            key: "Plant Type",
            width: 150,
            ...getColumnSearchProps("plant_type", filters, setFilters)
        },
        {
            dataIndex: "scientific_name",
            title: "Scientific Name",
            key: "Scientific Name",
            width: 150,
            ...getColumnSearchProps("scientific_name", filters, setFilters)
        },
        {
            dataIndex: "recipient_name",
            title: "Recipient",
            key: "Recipient",
            width: 250,
            ...getColumnSearchProps("recipient_name", filters, setFilters)
        },
        {
            dataIndex: "assignee_name",
            title: "Assignee",
            key: "Assignee",
            width: 250,
            ...getColumnSearchProps("assignee_name", filters, setFilters)
        },
        {
            dataIndex: "action",
            title: "Action",
            key: "Action",
            width: 100,
            align: "center",
            render: (_, record) => <Button
                onClick={() => handleUnassignTree(record)}
                disabled={unassignedTrees.some(t => t.id === record.id)}
                variant="outlined"
                color="error"
                size="small"
                sx={{ textTransform: 'none'}}
            >Unassign</Button>
        }
    ]


    return (
        <Box>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Assigned Trees</Typography>
            <GeneralTable
                loading={loading}
                rows={trees}
                columns={columns}
                totalRecords={totalTrees}
                onDownload={handleDownload}
                page={page}
                pageSize={pageSize}
                onPaginationChange={handlerPaginationChange}
            />

            <FormControlLabel
                disabled={unassignedTrees.length !== 0}
                control={<Checkbox checked={unassignAll} onChange={(e) => setUnassignAll(e.target.checked)} />}
                label={
                    <>
                        <Typography variant="body1">Unassign all the trees.</Typography>
                        <Typography variant="body2">This will unassign all the trees which were assigned to donation users.</Typography>
                    </>
                }
                sx={{ marginBottom: 4 }}
            />

            <UnassignConfirmationDialog
                open={open}
                setOpen={setOpen}
                unassignAll={unassignAll}
                handleUnassign={handleUnassign}
                loading={unassignLoading}
            />

            {unassignedTrees.length > 0 && <UnassignmentList trees={unassignedTrees} onRemove={handleRemoveTree} />}
            <Divider sx={{ marginBottom: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    variant="contained" 
                    color="error" 
                    sx={{ ml: 2, textTransform: 'none' }} 
                    disabled={unassignedTrees.length === 0 && !unassignAll} 
                    onClick={() => { setOpen(true); }}>{unassignAll ? "Unassign All" : "Unassign"}</Button>
            </Box>
        </Box>
    )
}

export default AssignedTrees;