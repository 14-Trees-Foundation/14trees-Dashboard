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

    const [existingBookedTrees, setExistingBookedTrees] = useState<GiftCardUser[]>([]);
    const [unMapConfirmation, setUnMapConfirmation] = useState(false);
    const [unMapAllConfirmation, setUnMapAllConfirmation] = useState(false);

    const getBookedTrees = async (giftRequestId: number) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const bookedTreesResp = await apiClient.getBookedGiftTrees(giftRequestId, 0, -1);
            setExistingBookedTrees(bookedTreesResp.results.map(item => ({ ...item, key: item.id })));
        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        getBookedTrees(giftCardRequestId);
    }, [giftCardRequestId])

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    // Add the applyFilters function here
    const applyFilters = (rows: GiftCardUser[], filters: Record<string, GridFilterItem>) => {
        return rows.filter(row => {
            return Object.entries(filters).every(([key, filter]) => {
                const columnValue = row[key as keyof GiftCardUser];
                const filterValue = filter.value;

                if (!filterValue) return true; // No filter applied

                switch (filter.operatorValue) {
                    case 'contains':
                        return String(columnValue).toLowerCase().includes(String(filterValue).toLowerCase());
                    case 'equals':
                        return String(columnValue) === String(filterValue);
                    case 'startsWith':
                        return String(columnValue).startsWith(String(filterValue));
                    case 'endsWith':
                        return String(columnValue).endsWith(String(filterValue));
                    case 'isEmpty':
                        return !columnValue;
                    case 'isNotEmpty':
                        return !!columnValue;
                    case 'isAnyOf':
                        return Array.isArray(filterValue) && filterValue.includes(String(columnValue));
                    default:
                        return true;
                }
            });
        });
    };

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
        return existingBookedTrees;
    }

    const handleSelectionChanges = (ids: number[]) => {
        setSelectedIds(ids);
    }

    const handleUnMapTrees = async (unMapAll: boolean = false) => {

        try {
            const treeIds: number[] = existingBookedTrees.filter(tree => selectedIds.some(id => id === tree.id)).map(item => item.tree_id);
            const apiClient = new ApiClient();
            await apiClient.unBookGiftTrees(giftCardRequestId, unMapAll ? [] : treeIds, unMapAll)

            onUnMap && onUnMap(unMapAll ? existingBookedTrees.length : treeIds.length);
            setExistingBookedTrees(prev => {
                return prev.filter(item => selectedIds.findIndex(id => id === item.id) === -1);
            });
            setSelectedIds([]);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <Box
            hidden={existingBookedTrees.length > 0 ? false : !visible}
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
                rows={applyFilters(existingBookedTrees, filters).slice(page * pageSize, (page + 1) * pageSize)} // Apply filters here
                columns={columns}
                totalRecords={applyFilters(existingBookedTrees, filters).length} // Update total records
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