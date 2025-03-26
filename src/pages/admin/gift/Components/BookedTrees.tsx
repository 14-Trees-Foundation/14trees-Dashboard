import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { GiftCardUser } from "../../../../types/gift_card";
import { useEffect, useState } from "react";
import ApiClient from "../../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { GridFilterItem } from "@mui/x-data-grid";
import { TableColumnsType } from "antd";
import getColumnSearchProps from "../../../../components/Filter";
import GeneralTable from "../../../../components/GenTable";

interface BookedTreesProps {
    giftCardRequestId: number
    visible: boolean
    onUnMap?: (unmapped: number) => void
}

const BookedTrees: React.FC<BookedTreesProps> = ({ giftCardRequestId, visible, onUnMap }) => {

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [existingBookedTrees, setExistingBookedTrees] = useState<Record<number, GiftCardUser>>({});
    const [treesList, setTreesList] = useState<GiftCardUser[]>([]);
    const [totalRecords, setTotalRecords] = useState(20);
    const [unMapConfirmation, setUnMapConfirmation] = useState(false);
    const [unMapAllConfirmation, setUnMapAllConfirmation] = useState(false);

    useEffect(() => {
        setTreesList(Object.values(existingBookedTrees));
    }, [existingBookedTrees]);

    const getBookedTrees = async (offset: number, limit: number, filters: GridFilterItem[]) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const response = await apiClient.getBookedGiftTrees(
                offset,
                limit,
                filters
            );

            setExistingBookedTrees(prev => {
                const treesData = { ...prev };
                for (let i = 0; i < response.results.length; i++) {
                    treesData[response.offset + i] = response.results[i];
                }
                return treesData;
            });
            setTotalRecords(response.total);
        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        setExistingBookedTrees({});
        setPage(0);
        setTreesList([]);
        setTotalRecords(20);
    }, [filters]);

    useEffect(() => {
        const handler = setTimeout(() => {
            const filtersArray = [{
                columnField: 'gift_card_request_id',
                operatorValue: 'equals',
                value: giftCardRequestId
            },
            ...Object.entries(filters).map(([key, value]) => ({
                columnField: key,
                operatorValue: value.operatorValue,
                value: value.value
            }))
        ];

            for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, totalRecords); i++) {
                if (!existingBookedTrees[i]) {
                    getBookedTrees(page * pageSize, pageSize, filtersArray);
                    return;
                }
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [giftCardRequestId, page, pageSize, filters, existingBookedTrees, totalRecords]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
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
    ];

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const handleDownload = async () => {
        return treesList;
    }

    const handleSelectionChanges = (ids: number[]) => {
        setSelectedIds(ids);
    }

    const handleUnMapTrees = async (unMapAll: boolean = false) => {

        try {
            const treeIds: number[] = treesList.filter(tree => selectedIds.some(id => id === tree.id)).map(item => item.tree_id);
            const apiClient = new ApiClient();
            await apiClient.unBookGiftTrees(giftCardRequestId, unMapAll ? [] : treeIds, unMapAll)

            onUnMap && onUnMap(unMapAll ? treesList.length : treeIds.length);
            setExistingBookedTrees(prev => {
                const updatedTrees = { ...prev };
                selectedIds.forEach(id => delete updatedTrees[id]);
                return updatedTrees;
            });
            setSelectedIds([]);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <Box
            hidden={treesList.length > 0 ? false : !visible}
        >
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
                pl={1}
                pr={1}
            >
                <Typography variant="h6" flexGrow={1}>Previously booked trees:</Typography>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => { setUnMapAllConfirmation(true); }}
                >Unreserve All Trees</Button>
                <Button
                    variant="contained"
                    color="success"
                    disabled={selectedIds.length === 0}
                    onClick={() => { setUnMapConfirmation(true); }}
                    sx={{ ml: 2 }}
                >Unreserve Trees</Button>
            </Box>
            <GeneralTable
                loading={loading}
                rows={treesList}
                columns={columns}
                totalRecords={totalRecords}
                page={page}
                pageSize={pageSize}
                onSelectionChanges={handleSelectionChanges}
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                footer
                tableName="Booked trees"
            />

            <Dialog open={unMapConfirmation} maxWidth="md">
                <DialogTitle>Unreserve Trees</DialogTitle>
                <DialogContent dividers>
                    <Typography>Are you sure you want to unreserve selected trees? This action will also unassign trees if they are assigned to some users.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setUnMapConfirmation(false); }} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={() => { handleUnMapTrees(); setUnMapConfirmation(false); }} color="success" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={unMapAllConfirmation} maxWidth="md">
                <DialogTitle>Unmap All Trees</DialogTitle>
                <DialogContent dividers>
                    <Typography>Are you sure you want to unmap <strong>all the trees</strong> for this gift request? This action will also unassign trees if they are assigned to some users.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setUnMapAllConfirmation(false); }} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={() => { handleUnMapTrees(true); setUnMapAllConfirmation(false); }} color="success" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default BookedTrees;