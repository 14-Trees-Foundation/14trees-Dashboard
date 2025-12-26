import { useEffect, useState } from "react";
import { GridFilterItem } from "@mui/x-data-grid";
import { TableColumnsType } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { Box, Typography, Divider, IconButton, Button, Dialog, DialogContent, DialogTitle, Badge, DialogActions } from "@mui/material";
import GeneralTable from "../../../components/GenTable";
import ApiClient from "../../../api/apiClient/apiClient";
import { getHumanReadableDate } from "../../../helpers/utils";
import { Order } from "../../../types/common";
import getColumnSearchProps, { getColumnDateFilter } from "../../../components/Filter";
import { Edit, OpenInNew, NotesOutlined } from "@mui/icons-material";
import EditCampaign from "./EditCampaign";
import AddCampaignDialog from "./AddCampaign";

const Campaigns: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [currentDescription, setCurrentDescription] = useState("");

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const filtersData = Object.values(filters);
            const response = await apiClient.getCampaigns(
                page * pageSize,
                pageSize,
                filtersData,
                orderBy
            );

            setTableRows(response.results);
            setTotalRecords(response.total || response.results.length);
        } catch (error: any) {
            toast.error(error.message);
            setTableRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [page, pageSize, filters, orderBy]);

    const handleSetFilters = (newFilters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(newFilters);
    };

    const handleEditClick = (record: any) => {
        setSelectedCampaign(record);
        setEditModalOpen(true);
    };

    const handleOpenCampaignPage = (record: any) => {
        if (record.c_key) {
            window.open(`/campaign/${record.c_key}`, "_blank");
        } else {
            toast.error("Campaign key is missing.");
        }
    };

    const handleViewDescription = (description: string) => {
        setCurrentDescription(description || "No description available");
        setDescriptionModalOpen(true);
    };

    const handleCampaignSubmit = async (data: any) => {
        try {
            const apiClient = new ApiClient();
            await apiClient.updateCampaign(
                data.id,
                ["name", "c_key", "description", "email_config"],
                data
            );
            toast.success("Campaign updated successfully!");
            fetchCampaigns();
        } catch (error: any) {
            toast.error(`Failed to update campaign: ${error.message}`);
            throw error;
        }
    };

    const handleAddCampaign = async (campaignData: { c_key: string; name: string; description?: string; email_config?: any }) => {
        try {
            const apiClient = new ApiClient();
            await apiClient.createCampaign(
                campaignData.name,
                campaignData.c_key,
                campaignData.description,
                campaignData.email_config
            );
            toast.success("Campaign created successfully!");
            fetchCampaigns();
        } catch (error: any) {
            toast.error(`Failed to create campaign: ${error.message}`);
            throw error;
        }
    };

    const handlePaginationChange = (newPage: number, newPageSize: number) => {
        setPage(newPage - 1);
        setPageSize(newPageSize);
    };

    const handleSortingChange = (sorter: any) => {
        const newOrder = [...orderBy].filter((item) => item.column !== sorter.field);
        if (sorter.order) {
            newOrder.push({ column: sorter.field, order: sorter.order });
        }
        setPage(0);
        setOrderBy(newOrder);
    };

    const handleDownloadCampaigns = async () => {
        const apiClient = new ApiClient();
        const response = await apiClient.getCampaigns(0, -1, Object.values(filters), orderBy);
        return response.results;
    };

    const columns: TableColumnsType<any> = [
        {
            dataIndex: "name",
            key: "Campaign Name",
            title: "Campaign Name",
            align: "center",
            width: 200,
            ...getColumnSearchProps("name", filters, handleSetFilters),
        },
        {
            title: "Campaign Progress Tracker",
            key: "campaign_progress_tracker",
            align: "center",
            width: 120,
            render: (_, record) => (
                <IconButton
                    onClick={() => handleOpenCampaignPage(record)}
                    color="secondary"
                    size="small"
                    aria-label="open campaign page"
                >
                    <OpenInNew fontSize="small" />
                </IconButton>
            ),
        },
        {
            dataIndex: "description",
            key: "Display Text",
            title: "Display Text",
            align: "center",
            width: 150,
            render: (value: string) => (
                <IconButton onClick={() => handleViewDescription(value)} size="small">
                    <Badge variant="dot" color="primary" invisible={!value}>
                        <NotesOutlined />
                    </Badge>
                </IconButton>
            ),
        },
        {
            dataIndex: "created_by",
            key: "Created By",
            title: "Created By",
            align: "center",
            width: 150,
            ...getColumnSearchProps("created_by", filters, handleSetFilters),
        },
        {
            dataIndex: "created_at",
            key: "Created At",
            title: "Created At",
            align: "center",
            width: 150,
            render: getHumanReadableDate,
            ...getColumnDateFilter({
                dataIndex: "created_at",
                filters,
                handleSetFilters,
                label: "Created At",
            }),
        },
        {
            dataIndex: "c_key",
            key: "Campaign Key",
            title: "Campaign Key",
            align: "center",
            width: 200,
            ...getColumnSearchProps("c_key", filters, handleSetFilters),
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            width: 80,
            render: (_, record) => (
                <IconButton onClick={() => handleEditClick(record)} color="primary" size="small" aria-label="edit">
                    <Edit fontSize="small" />
                </IconButton>
            ),
        },
    ];

    return (
        <>
            <ToastContainer />
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px" }}>
                <Typography variant="h4" style={{ marginTop: "5px" }}>
                    Campaigns
                </Typography>
                <Button
                    variant="contained"
                    color="success"
                    style={{ marginLeft: "10px", textTransform: 'none' }}
                    onClick={() => setAddModalOpen(true)}
                >
                    Add campaign
                </Button>
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: "15px" }} />

            <Box sx={{ height: 540, width: "100%" }}>
                <GeneralTable
                    loading={loading}
                    rows={tableRows}
                    columns={columns}
                    totalRecords={totalRecords}
                    page={page + 1}
                    pageSize={pageSize}
                    onPaginationChange={handlePaginationChange}
                    onDownload={handleDownloadCampaigns}
                    footer
                    tableName="Campaigns"
                />
            </Box>

            <EditCampaign
                row={selectedCampaign || {}}
                open={editModalOpen}
                handleClose={() => setEditModalOpen(false)}
                onSubmit={handleCampaignSubmit}
            />

            <AddCampaignDialog
                open={addModalOpen}
                handleClose={() => setAddModalOpen(false)}
                handleSave={handleAddCampaign}
            />

            {/* Description View Modal */}
            <Dialog
                open={descriptionModalOpen}
                onClose={() => setDescriptionModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Campaign Description</DialogTitle>
                <DialogContent>
                    <Box sx={{
                        p: 2,
                        border: '1px solid #eee',
                        borderRadius: 1,
                        minHeight: '100px',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {currentDescription}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDescriptionModalOpen(false)}
                        color="primary"
                        variant="contained"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Campaigns;