import { Box, Typography, Button } from "@mui/material";
import getColumnSearchProps, { getSortableHeader } from "../Filter";
import { useState, useEffect } from "react";
import { GridFilterItem } from "@mui/x-data-grid";
import { Plot } from "../../types/plot";
import GeneralTable from "../GenTable";
import ApiClient from "../../api/apiClient/apiClient";
import AddPlotsDialog from "./AddPlotsDialog"

interface Props {
    type: "donate" | "gift-trees";
}

const AutoPrsPlots: React.FC<Props> = ({ type }) => {
    const [loading, setLoading] = useState(false);
    const [tableRows, setTableRows] = useState<Plot[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [dialogOpen, setDialogOpen] = useState(false)
    const [orderBy, setOrderBy] = useState<
        { column: string; order: "ASC" | "DESC" }[]
    >([]);

    const fetchPlotData = async () => {
        setLoading(true);
        try {
            const apiType = type === "donate" ? "donation" : "gift";

            const filtersData = Object.values(filters);
            const apiClient = new ApiClient();
            const response = await apiClient.getPlotsByType(apiType, filtersData, orderBy);

            setTableRows(response.results);
            setTotalRecords(response.total);
        } catch (error) {
            console.error("Failed to fetch plot data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlotData();
    }, [type, page, pageSize, filters, orderBy]);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    };

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    };

    const handleDownload = async () => {
        const apiClient = new ApiClient();

        const filtersData = Object.values(filters);
        const resp = await apiClient.getPlotsByType(
            type === "donate" ? "donation" : "gift",
            filtersData,
            orderBy,
        );
        return resp.results;
    };

    const handleAddPlots = async (plotIds: string[]) => {
        try {
            const apiClient = new ApiClient();
            await apiClient.addAutoProcessPlot({
                plot_ids: plotIds.map(id => Number(id)),
                type: type === "donate" ? "donation" : "gift"
            });
            fetchPlotData();
        } catch (error) {
            console.error("Failed to add plots:", error);
            throw error;
        }
    };

    const handleSortingChange = (sorter: any) => {
        let newOrder = [...orderBy];
        const updateOrder = (item: { column: string; order: "ASC" | "DESC" }) => {
            const index = newOrder.findIndex(
                (item) => item.column === sorter.field
            );
            if (index > -1) {
                if (sorter.order) newOrder[index].order = sorter.order;
                else
                    newOrder = newOrder.filter(
                        (item) => item.column !== sorter.field
                    );
            } else if (sorter.order) {
                newOrder.push({ column: sorter.field, order: sorter.order });
            }
        };

        if (sorter.field) {
            setPage(0);
            updateOrder(sorter);
            setOrderBy(newOrder);
        }
    };

    const columns: any[] = [
        {
            dataIndex: "name",
            key: "name",
            title: "Name",
            align: "center",
            width: 300,
            ...getColumnSearchProps("name", filters, handleSetFilters),
        },
        {
            dataIndex: "label",
            key: "label",
            title: "Plot Label",
            align: "center",
            width: 150,
            ...getColumnSearchProps("label", filters, handleSetFilters),
        },
        {
            dataIndex: "site_name",
            key: "site_name",
            title: "Site Name",
            align: "center",
            width: 300,
            ...getColumnSearchProps("site_name", filters, handleSetFilters),
        },
        {
            dataIndex: "total",
            key: "Total Trees",
            title: getSortableHeader(
                "Total Trees",
                "total",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "tree_count",
            key: "Trees",
            title: getSortableHeader(
                "Trees",
                "tree_count",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "booked",
            key: "Booked Trees",
            title: getSortableHeader(
                "Booked Trees",
                "booked",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "assigned",
            key: "Assigned Trees",
            title: getSortableHeader(
                "Assigned Trees",
                "assigned",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 150,
        },
        {
            dataIndex: "unbooked_assigned",
            key: "Unfunded Inventory (Assigned)",
            title: getSortableHeader(
                "Unfunded Inventory (Assigned)",
                "unbooked_assigned",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 180,
        },
        {
            dataIndex: "available",
            key: "Unfunded Inventory (Unassigned)",
            title: getSortableHeader(
                "Unfunded Inventory (Unassigned)",
                "available",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 180,
        },
        {
            dataIndex: "card_available",
            key: "Giftable Inventory",
            title: getSortableHeader(
                "Giftable Inventory",
                "card_available",
                orderBy,
                handleSortingChange
            ),
            align: "right",
            width: 150,
        },
    ];

    const titleText =
        type === "donate"
            ? "Plots for Auto-Processing Donations"
            : "Plots for Auto-Processing Gift Requests";

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    {titleText}
                </Typography>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => setDialogOpen(true)}
                >
                    Add Plots
                </Button>
            </Box>
            <GeneralTable
                loading={loading}
                rows={tableRows}
                columns={columns}
                totalRecords={totalRecords}
                page={page}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                onDownload={handleDownload}
                footer
                tableName="Plots"
            />
            <AddPlotsDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                type={type}
                onAddPlots={handleAddPlots}
            />
        </Box>
    );
};

export default AutoPrsPlots;
