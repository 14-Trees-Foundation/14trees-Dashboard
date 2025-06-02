import {
    Box, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, Tabs, Tab, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Donation } from "../../../../../types/donation";
import { Tree } from "../../../../../types/tree";
import AssignedTrees from "./AssignedTrees";
import GeneralTable from "../../../../../components/GenTable";
import { TableColumnsType } from "antd";
import ApiClient from "../../../../../api/apiClient/apiClient";

interface Props {
    open: boolean;
    onClose: () => void;
    donation: Donation;
    onSuccess?: () => void;
    disableSelect?: boolean;
}

interface ApiResponse {
    data?: Tree[];
    results?: Tree[];
}

const TabPanel = ({ children, value, index }: { children: React.ReactNode, value: number, index: number }) => (
    <div hidden={value !== index}>
        {value === index && <Box sx={{ mt: 3 }}>{children}</Box>}
    </div>
);

const MapTrees: React.FC<Props> = ({ open, onClose, donation, onSuccess }) => {
    const [tabValue, setTabValue] = useState(0);

    // Separate pagination states for each tab
    const [mapPage, setMapPage] = useState(0);
    const [mapPageSize, setMapPageSize] = useState(10);
    const [unmapPage, setUnmapPage] = useState(0);
    const [unmapPageSize, setUnmapPageSize] = useState(10);

    // Map Trees
    const [selectedTrees, setSelectedTrees] = useState<Tree[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Unmap Trees
    const [mappedTrees, setMappedTrees] = useState<Tree[]>([]);
    const [mappedLoading, setMappedLoading] = useState(false);
    const [selectedUnmapTrees, setSelectedUnmapTrees] = useState<Tree[]>([]);
    const [unmappingLoading, setUnmappingLoading] = useState(false);

    const mappedCount = mappedTrees.length;
    const unmappedCount = selectedTrees.length;
    const remainingCount = (donation?.trees_count || 0) - mappedCount - unmappedCount;


    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);

        if (newValue === 0) {
            setMapPage(0);
        } else {
            setUnmapPage(0);
            fetchMappedTrees();
        }
    };

    const handleMapPaginationChange = (page: number, pageSize: number) => {
        setMapPage(page - 1);
        setMapPageSize(pageSize);
    };

    const handleUnmapPaginationChange = (page: number, pageSize: number) => {
        setUnmapPage(page - 1);
        setUnmapPageSize(pageSize);
    };

    const handleSelect = (tree: Tree) => {
        if (!selectedTrees.some(t => t.id === tree.id)) {
            setSelectedTrees(prev => [...prev, tree]);
        }
    };

    const handleRemove = (tree: Tree) => {
        setSelectedTrees(prev => {
            const updated = prev.filter(item => item.id !== tree.id);
            if (mapPage > 0 && (mapPage * mapPageSize) >= updated.length) {
                setMapPage(Math.max(0, mapPage - 1));
            }
            return updated;
        });
    };

    const handleSelectUnmapTree = (tree: Tree) => {
        if (!selectedUnmapTrees.some(t => t.id === tree.id)) {
            setSelectedUnmapTrees(prev => [...prev, tree]);
        }
    };

    const handleRemoveUnmapTree = (tree: Tree) => {
        setSelectedUnmapTrees(prev => {
            const updated = prev.filter(item => item.id !== tree.id);
            if (unmapPage > 0 && (unmapPage * unmapPageSize) >= updated.length) {
                setUnmapPage(Math.max(0, unmapPage - 1));
            }
            return updated;
        });
    };

    const handleMapTrees = async () => {
        if (selectedTrees.length === 0) return;
        setIsLoading(true);
        try {
            const apiClient = new ApiClient();
            await apiClient.mapAssignedTreesToDonation(
                donation.id,
                selectedTrees.map(tree => tree.id)
            );
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Failed to map trees:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmUnmap = async () => {
        if (selectedUnmapTrees.length === 0) return;

        setUnmappingLoading(true);
        try {
            const apiClient = new ApiClient();
            await apiClient.unmapAssignedTreesFromDonation(
                donation.id,
                selectedUnmapTrees.map(tree => tree.id)
            );
            setSelectedUnmapTrees([]);
            onSuccess?.();

            // Refresh the mapped trees list after unmapping
            await fetchMappedTrees();

            // Reset unmap pagination to first page
            setUnmapPage(0);
        } catch (error) {
            console.error("Failed to unmap selected trees", error);
        } finally {
            setUnmappingLoading(false);
        }
    };

    const fetchMappedTrees = async () => {
        if (!open || tabValue !== 1) return;
        setMappedLoading(true);
        try {
            const apiClient = new ApiClient();
            const response: unknown = await apiClient.getMappedTreesByDonation(donation.id);
            const parseResponse = (res: unknown): Tree[] => {
                if (Array.isArray(res)) return res as Tree[];
                if (typeof res === 'object' && res !== null) {
                    const apiRes = res as ApiResponse;
                    return Array.isArray(apiRes.data) ? apiRes.data : apiRes.results ?? [];
                }
                return [];
            };
            const trees = parseResponse(response);
            setMappedTrees(trees);
        } catch (error) {
            console.error("Failed to fetch mapped trees", error);
        } finally {
            setMappedLoading(false);
        }
    };

    // Fetch mapped trees on open and tab switch
    useEffect(() => {
        if (open) {
            fetchMappedTrees();
        }
    }, [open, donation?.id]);

    const baseColumns: TableColumnsType<Tree> = [
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
            render: (_, record) => record?.plot || 'N/A',
        },
        {
            dataIndex: "assigned_to_name",
            key: "assigned_to_name",
            title: "Assigned To",
            width: 250,
            align: 'center',
            render: (value) => value || 'N/A',
        }
    ];

    const mapColumns: TableColumnsType<Tree> = [
        ...baseColumns,
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 150,
            align: "center",
            render: (_, record) => (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemove(record)}
                >
                    Remove
                </Button>
            )
        }
    ];

    const unmapColumns: TableColumnsType<Tree> = [
        ...baseColumns,
        {
            key: "selectUnmap",
            title: "Select",
            width: 150,
            align: "center",
            render: (_, record) => {
                const isSelected = selectedUnmapTrees.some(tree => tree.id === record.id);
                return (
                    <Button
                        variant="outlined"
                        color={isSelected ? "error" : "success"}
                        size="small"
                        onClick={() =>
                            isSelected ? null : handleSelectUnmapTree(record)
                        }
                        disabled={isSelected}
                    >
                        {isSelected ? "Selected" : "Select"}
                    </Button>
                );
            }
        }
    ];

    const unmapSelectedColumns: TableColumnsType<Tree> = [
        ...baseColumns,
        {
            key: "removeUnmap",
            title: "Actions",
            width: 150,
            align: "center",
            render: (_, record) => (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveUnmapTree(record)}
                >
                    Remove
                </Button>
            )
        }
    ];

    return (
        <Dialog open={open} maxWidth="xl" fullWidth onClose={onClose}>
            <DialogTitle>#{donation.id}: Map trees planted during visit!</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ px: 3, pt: 1, pb: 2 }}>
                    <Typography><strong>Mapped Trees:</strong> {mappedCount}</Typography>
                    <Typography><strong>Unmapped Trees:</strong> {unmappedCount}</Typography>
                    <Typography><strong>Remaining:</strong> {remainingCount}</Typography>
                </Box>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'green',
                        },
                    }}
                >
                    <Tab
                        label="Map Trees"
                        sx={{
                            color: tabValue === 0 ? 'green' : 'black',
                            '&.Mui-selected': {
                                color: 'green',
                            },
                        }}
                    />
                    <Tab
                        label="Unmap Trees"
                        sx={{
                            color: tabValue === 1 ? 'green' : 'black',
                            '&.Mui-selected': {
                                color: 'green',
                            },
                        }}
                    />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <AssignedTrees selectedTrees={selectedTrees.map(tree => tree.id)} onSelect={handleSelect} disableSelect={remainingCount <= 0} remainingCount={remainingCount} />
                    <Box sx={{ mt: 5 }}>
                        <Typography variant="h6" mb={1}>Below Trees will be mapped to this donation</Typography>
                        <GeneralTable
                            loading={false}
                            rows={selectedTrees.slice(mapPage * mapPageSize, (mapPage + 1) * mapPageSize)}
                            columns={mapColumns}
                            totalRecords={selectedTrees.length}
                            page={mapPage}
                            pageSize={mapPageSize}
                            onPaginationChange={handleMapPaginationChange}
                            onDownload={async () => selectedTrees}
                        />
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <GeneralTable
                        loading={mappedLoading}
                        rows={mappedTrees.slice(unmapPage * unmapPageSize, (unmapPage + 1) * unmapPageSize)}
                        columns={unmapColumns}
                        totalRecords={mappedTrees.length}
                        page={unmapPage}
                        pageSize={unmapPageSize}
                        onPaginationChange={handleUnmapPaginationChange}
                        onDownload={async () => mappedTrees}
                    />
                    <Box mt={4}>
                        <Typography variant="h6" mb={1}>Below Trees will be unmapped from this donation</Typography>
                        <GeneralTable
                            loading={false}
                            rows={selectedUnmapTrees.slice(unmapPage * unmapPageSize, (unmapPage + 1) * unmapPageSize)}
                            columns={unmapSelectedColumns}
                            totalRecords={selectedUnmapTrees.length}
                            page={unmapPage}
                            pageSize={unmapPageSize}
                            onPaginationChange={handleUnmapPaginationChange}
                            onDownload={async () => selectedUnmapTrees}
                        />
                    </Box>
                </TabPanel>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={onClose}
                    sx={{ width: 120 }}
                >
                    Cancel
                </Button>

                {tabValue === 0 ? (
                    <Button
                        variant="contained"
                        color="success"
                        disabled={selectedTrees.length === 0 || isLoading}
                        onClick={handleMapTrees}
                        sx={{ width: 120 }}
                    >
                        {isLoading ? "Mapping..." : "Confirm"}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="success"
                        disabled={selectedUnmapTrees.length === 0 || unmappingLoading}
                        onClick={handleConfirmUnmap}
                        sx={{ width: 120 }}
                    >
                        {unmappingLoading ? "UnMapping..." : "Confirm"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default MapTrees;