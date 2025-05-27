import { FC, useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Checkbox, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControlLabel, Tabs, Tab, DialogContentText
} from "@mui/material";
import { Plot, PlotAccessibilityList } from "../../../../types/plot";
import { Donation, DonationTree } from "../../../../types/donation";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import { RootState } from "../../../../redux/store/store";
import GeneralTable from "../../../../components/GenTable";
import ApiClient from "../../../../api/apiClient/apiClient";
import { TableColumnsType } from "antd";
import { GridFilterItem } from "@mui/x-data-grid";
import getColumnSearchProps, { getColumnSelectedItemFilter, getSortableHeader } from "../../../../components/Filter";
import { toast } from "react-toastify";
import { Order } from "../../../../types/common";
import { Tree } from "../../../../types/tree";
import donationActionTypes from "../../../../redux/actionTypes/donationActionTypes";

interface DonationTreesProps {
  open: boolean;
  onClose: () => void;
  donation: Donation | null;
}

interface SelectedPlot {
  id: number;
  name: string;
  availableTrees: number;
  reserveCount: number;
}

interface SelectedTree {
  id: number;
  sapling_id: string;
  plant_type: string;
  plot: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DonationTrees: FC<DonationTreesProps> = ({ open, onClose, donation }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [orderBy, setOrderBy] = useState<Order[]>([{ column: 'available_trees', order: 'DESC' }]);
  const [selectedPlots, setSelectedPlots] = useState<SelectedPlot[]>([]);
  const [selectedPlotIds, setSelectedPlotIds] = useState<number[]>([]);
  const [tableRows, setTableRows] = useState<Plot[]>([]);
  const [bookAllHabits, setBookAllHabits] = useState(false);
  const [diversify, setDiversify] = useState(false);
  const [validationDialog, setValidationDialog] = useState({ open: false, title: '', message: '' });

  // New state variables for the tree selection tab
  const [tabValue, setTabValue] = useState(0);
  const [treePage, setTreePage] = useState(0);
  const [treePageSize, setTreePageSize] = useState(10);
  const [treeFilters, setTreeFilters] = useState<Record<string, GridFilterItem>>({});
  const [treeOrderBy, setTreeOrderBy] = useState<Order[]>([]);
  const [treeTableRows, setTreeTableRows] = useState<Tree[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [selectedTrees, setSelectedTrees] = useState<SelectedTree[]>([]);
  const [selectedTreeIds, setSelectedTreeIds] = useState<number[]>([]);
  const [treeTotal, setTreeTotal] = useState(0);

  // New state variables for the unreserve trees tab
  const [reservedTreesPage, setReservedTreesPage] = useState(0);
  const [reservedTreesPageSize, setReservedTreesPageSize] = useState(10);
  const [reservedTreesFilters, setReservedTreesFilters] = useState<Record<string, GridFilterItem>>({});
  const [reservedTreesOrderBy, setReservedTreesOrderBy] = useState<Order[]>([]);
  const [reservedTreesTableRows, setReservedTreesTableRows] = useState<DonationTree[]>([]);
  const [reservedTreesLoading, setReservedTreesLoading] = useState(false);
  const [selectedReservedTrees, setSelectedReservedTrees] = useState<number[]>([]);
  const [reservedTreesTotal, setReservedTreesTotal] = useState(0);
  const [unreserveAllDialogOpen, setUnreserveAllDialogOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { getPlots } = bindActionCreators(plotActionCreators, dispatch);

  // Fetch plots data
  useEffect(() => {
    if (open && tabValue === 0) {
      setPage(0);
      fetchPlots();
    }
  }, [open, tabValue, filters, orderBy]);

  // Fetch trees data
  useEffect(() => {
    if (open && tabValue === 1) {
      fetchTrees();
    }
  }, [open, treeFilters, treePage, treePageSize, tabValue]);

  // Fetch reserved trees data
  useEffect(() => {
    if (open && tabValue === 2 && donation) {
      fetchReservedTrees();
    }
  }, [open, reservedTreesFilters, reservedTreesPage, reservedTreesPageSize, tabValue, donation]);

  const fetchPlots = async () => {
    const filtersData = Object.values(filters);
    getPlots(page * pageSize, pageSize, filtersData, orderBy);
  };

  const hasAtLeastOneNonZeroReserve = () => {
    return selectedPlots.some(plot => plot.reserveCount > 0);
  };

  const fetchTrees = async () => {
    setTreeLoading(true);
    try {
      const apiClient = new ApiClient();
      const filtersData = Object.values(treeFilters);
      const response = await apiClient.getGiftAbleTrees(treePage * treePageSize, treePageSize, filtersData);
      setTreeTotal(response.total);
      setTreeTableRows(response.results.map(tree => ({
        ...tree,
        key: tree.id,
      })));
    } catch (error) {
      console.error("Error fetching trees:", error);
      toast.error("Failed to fetch trees");
    } finally {
      setTreeLoading(false);
    }
  };

  const fetchReservedTrees = async () => {
    if (!donation) return;

    setReservedTreesLoading(true);
    try {
      const apiClient = new ApiClient();
      // Create a filter for donation_id in the format expected by the backend
      const donationFilter = {
        columnField: "donation_id",
        operatorValue: "equals",
        value: donation.id
      };

      // Combine with existing filters
      const filtersData = [
        ...Object.values(reservedTreesFilters),
        donationFilter
      ];

      const response = await apiClient.getDonationTrees(
        reservedTreesPage * reservedTreesPageSize,
        reservedTreesPageSize,
        filtersData
      );
      setReservedTreesTotal(response.total);
      setReservedTreesTableRows(response.results.map((tree: DonationTree) => ({
        ...tree,
        key: tree.id,
      })));
    } catch (error) {
      console.error("Error fetching reserved trees:", error);
      toast.error("Failed to fetch reserved trees");
    } finally {
      setReservedTreesLoading(false);
    }
  };

  // Get plots data from Redux store
  let plotsList: Plot[] = [];
  const plotsData = useAppSelector((state: RootState) => state.plotsData);
  if (plotsData) {
    plotsList = Object.values(plotsData.plots).sort((a, b) => b.id - a.id);
  }

  // Update table rows when data changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (plotsData.loading) return;

      const records: Plot[] = [];
      const maxLength = Math.min((page + 1) * pageSize, plotsData.totalPlots);

      for (let i = page * pageSize; i < maxLength; i++) {
        if (Object.hasOwn(plotsData.paginationMapping, i)) {
          const id = plotsData.paginationMapping[i];
          const record = plotsData.plots[id];
          if (record) records.push(record);
        } else {
          fetchPlots();
          break;
        }
      }

      setTableRows(records);
    }, 300);

    return () => { clearTimeout(handler) }
  }, [pageSize, page, plotsData]);

  // Handle plot selection
  const handleSelectionChange = (ids: number[]) => {
    // Update selectedPlots list
    const newSelectedPlots: SelectedPlot[] = [];
    const remaining = (donation?.trees_count || 0) - Number(donation?.booked || 0) - selectedPlots.map(plot => plot.reserveCount).reduce((prev, curr) => prev + curr, 0);

    ids.forEach(id => {
      const plot = plotsList.find(p => p.id === id);
      if (plot && !selectedPlots.some(sp => sp.id === id)) {
        newSelectedPlots.push({
          id: plot.id,
          name: plot.name,
          availableTrees: plot.available_trees || 0,
          reserveCount: Math.min(Math.max(0, remaining), plot.available_trees || 0),
        });
      }
    });

    // Merge existing selections with new ones
    setSelectedPlots([
      ...selectedPlots.filter(sp => ids.includes(sp.id)),
      ...newSelectedPlots
    ]);
  };

  // Handle tree selection
  const handleTreeSelection = (id: number) => {
    // Check if tree is already selected
    if (selectedTreeIds.includes(id)) {
      return;
    }

    const remaining = (donation?.trees_count || 0) - Number(donation?.booked || 0) - selectedTrees.length;
    if (remaining <= 0) {
      toast.warn("You already have selected requested number of trees!");
      return;
    }

    // Find the tree in the current table rows
    const tree = treeTableRows.find(t => t.id === id);
    if (tree) {
      // Add to selected trees
      const newSelectedTree: SelectedTree = {
        id: tree.id,
        sapling_id: tree.sapling_id,
        plant_type: tree.plant_type || '',
        plot: tree.plot || ''
      };

      // Update selected trees and IDs
      setSelectedTrees([...selectedTrees, newSelectedTree]);
      setSelectedTreeIds([...selectedTreeIds, id]);
    }
  };

  // Handle removing a selected tree
  const handleRemoveTree = (id: number) => {
    setSelectedTrees(prev => prev.filter(tree => tree.id !== id));
    setSelectedTreeIds(prev => prev.filter(treeId => treeId !== id));
  };

  // Handle reserve count input change
  const handleReserveCountChange = (id: number, value: number) => {
    if (!donation) return;

    const requestedCount = donation.trees_count || 0;
    const currentTotal = selectedPlots.reduce((sum, plot) => sum + (plot.id === id ? 0 : plot.reserveCount), 0);
    const plot = selectedPlots.find(p => p.id === id);

    if (!plot) return;

    const maxAllowed = Math.min(
      plot.availableTrees,
      requestedCount - currentTotal
    );

    const newValue = Math.max(0, Math.min(value, maxAllowed));

    setSelectedPlots(prev =>
      prev.map(plot =>
        plot.id === id ? { ...plot, reserveCount: newValue } : plot
      )
    );
  };

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  };

  const handleSetTreeFilters = (filters: Record<string, GridFilterItem>) => {
    setTreePage(0);
    setTreeFilters(filters);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage - 1);
    setPageSize(newPageSize);
  };

  const handleTreePaginationChange = (newPage: number, newPageSize: number) => {
    setTreePage(newPage - 1);
    setTreePageSize(newPageSize);
  };

  const handleSortingChange = (sorter: any) => {
    let newOrder = [...orderBy];
    const updateOrder = (item: { column: string, order: 'ASC' | 'DESC' }) => {
      const index = newOrder.findIndex((item) => item.column === sorter.field);
      if (index > -1) {
        if (sorter.order) newOrder[index].order = sorter.order;
        else newOrder = newOrder.filter((item) => item.column !== sorter.field);
      } else if (sorter.order) {
        newOrder.push({ column: sorter.field, order: sorter.order });
      }
    }

    if (sorter.field) {
      setPage(0);
      updateOrder(sorter);
      setOrderBy(newOrder);
    }
  };

  const handleTreeSortingChange = (sorter: any) => {
    let newOrder = [...treeOrderBy];
    const updateOrder = (item: { column: string, order: 'ASC' | 'DESC' }) => {
      const index = newOrder.findIndex((item) => item.column === sorter.field);
      if (index > -1) {
        if (sorter.order) newOrder[index].order = sorter.order;
        else newOrder = newOrder.filter((item) => item.column !== sorter.field);
      } else if (sorter.order) {
        newOrder.push({ column: sorter.field, order: sorter.order });
      }
    }

    if (sorter.field) {
      setTreePage(0);
      updateOrder(sorter);
      setTreeOrderBy(newOrder);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReservedTreesPaginationChange = (newPage: number, newPageSize: number) => {
    setReservedTreesPage(newPage - 1);
    setReservedTreesPageSize(newPageSize);
  };

  const handleSetReservedTreesFilters = (filters: Record<string, GridFilterItem>) => {
    setReservedTreesPage(0);
    setReservedTreesFilters(filters);
  };

  const handleReservedTreesSortingChange = (sorter: any) => {
    let newOrder = [...reservedTreesOrderBy];
    const updateOrder = (item: { column: string, order: 'ASC' | 'DESC' }) => {
      const index = newOrder.findIndex((item) => item.column === sorter.field);
      if (index > -1) {
        if (sorter.order) newOrder[index].order = sorter.order;
        else newOrder = newOrder.filter((item) => item.column !== sorter.field);
      } else if (sorter.order) {
        newOrder.push({ column: sorter.field, order: sorter.order });
      }
    }

    if (sorter.field) {
      setReservedTreesPage(0);
      updateOrder(sorter);
      setReservedTreesOrderBy(newOrder);
    }
  };

  const handleReservedTreeSelection = (ids: number[]) => {
    setSelectedReservedTrees(ids);
  };

  const handleUnreserveSelectedTrees = async () => {
    if (!donation || selectedReservedTrees.length === 0) return;

    try {
      const apiClient = new ApiClient();
      const updatedDonation = await apiClient.unreserveTreesForDonation(
        donation.id,
        selectedReservedTrees,
        false
      );
      dispatch({
        type: donationActionTypes.UPDATE_DONATION_SUCCEEDED,
        payload: updatedDonation,
      });
      toast.success(`Successfully unreserved ${selectedReservedTrees.length} trees for donation ${donation.id}`);
      fetchReservedTrees();
      setSelectedReservedTrees([]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUnreserveAllTrees = async () => {
    if (!donation) return;

    try {
      const apiClient = new ApiClient();
      const updatedDonation = await apiClient.unreserveTreesForDonation(
        donation.id,
        undefined,
        true
      );
      dispatch({
        type: donationActionTypes.UPDATE_DONATION_SUCCEEDED,
        payload: updatedDonation,
      });
      toast.success(`Successfully unreserved all trees for donation ${donation.id}`);
      fetchReservedTrees();
      setSelectedReservedTrees([]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Table columns for plots
  const columns: TableColumnsType<Plot> = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      align: "center",
      width: 300,
      ...getColumnSearchProps('name', filters, handleSetFilters)
    },
    {
      dataIndex: "total",
      key: "Total Trees",
      title: getSortableHeader("Total Trees", 'total', orderBy, handleSortingChange),
      align: "right",
      width: 150,
    },
    {
      dataIndex: "tree_count",
      key: "Trees",
      title: getSortableHeader("Trees", 'tree_count', orderBy, handleSortingChange),
      align: "right",
      width: 150,
    },
    {
      dataIndex: "shrub_count",
      key: "Shrubs",
      title: getSortableHeader("Shrubs", 'shrub_count', orderBy, handleSortingChange),
      align: "right",
      width: 150,
    },
    {
      dataIndex: "herb_count",
      key: "Herbs",
      title: getSortableHeader("Herbs", 'herb_count', orderBy, handleSortingChange),
      align: "right",
      width: 150,
    },
    {
      dataIndex: "available_trees",
      key: "Available (Unfunded Inventory)",
      title: getSortableHeader("Available (Unfunded Inventory)", 'available_trees', orderBy, handleSortingChange),
      align: "right",
      width: 150,
    },
    {
      dataIndex: "distinct_plants",
      key: "distinct_plants",
      title: "Unique Plant Types",
      align: "right",
      width: 100,
      render: (value) => value?.length || 0
    },
    {
      dataIndex: "accessibility_status",
      key: "accessibility_status",
      title: "Accessibility",
      align: "center",
      width: 200,
      render: (value) => value ? PlotAccessibilityList.find((item) => item.value === value)?.label : "Unknown",
      ...getColumnSelectedItemFilter({ dataIndex: 'accessibility_status', filters, handleSetFilters, options: PlotAccessibilityList.map((item) => item.label).concat("Unknown") })
    },
    {
      dataIndex: "label",
      key: "label",
      title: "Plot Label",
      align: "center",
      width: 150,
      ...getColumnSearchProps('label', filters, handleSetFilters)
    },
    {
      dataIndex: "site_name",
      key: "site_name",
      title: "Site Name",
      align: "center",
      width: 300,
      ...getColumnSearchProps('site_name', filters, handleSetFilters)
    },
    {
      dataIndex: "tags",
      key: "tags",
      title: "Tags",
      align: "center",
      width: 150,
      render: (tags) => tags ? tags.join(", ") : '',
    },
    {
      dataIndex: "gat",
      key: "gat",
      title: "Gat No.",
      align: "center",
      width: 150,
    },
  ];

  // Table columns for trees
  const treeColumns: TableColumnsType<Tree> = [
    {
      dataIndex: "sapling_id",
      key: "sapling_id",
      title: "Sapling ID",
      align: "center",
      width: 150,
      ...getColumnSearchProps('sapling_id', treeFilters, handleSetTreeFilters)
    },
    {
      dataIndex: "plant_type",
      key: "plant_type",
      title: "Plant Type",
      align: "center",
      width: 200,
      ...getColumnSearchProps('plant_type', treeFilters, handleSetTreeFilters)
    },
    {
      dataIndex: "plot",
      key: "plot",
      title: "Plot Name",
      align: "center",
      width: 200,
      ...getColumnSearchProps('plot', treeFilters, handleSetTreeFilters)
    },
    {
      dataIndex: "site_name",
      key: "site_name",
      title: "Site Name",
      align: "center",
      width: 200,
      ...getColumnSearchProps('site_name', treeFilters, handleSetTreeFilters)
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 120,
      render: (_, record) => {
        const isSelected = selectedTreeIds.includes(record.id);
        return (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleTreeSelection(record.id)}
            disabled={isSelected}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
        );
      }
    }
  ];

  // Table columns for reserved trees
  const reservedTreesColumns: TableColumnsType<DonationTree> = [
    {
      dataIndex: "sapling_id",
      key: "sapling_id",
      title: "Sapling ID",
      align: "center",
      width: 150,
      ...getColumnSearchProps('sapling_id', reservedTreesFilters, handleSetReservedTreesFilters)
    },
    {
      dataIndex: "plant_type",
      key: "plant_type",
      title: "Plant Type",
      align: "center",
      width: 200,
      ...getColumnSearchProps('plant_type', reservedTreesFilters, handleSetReservedTreesFilters)
    },
    {
      dataIndex: "plot",
      key: "plot",
      title: "Plot Name",
      align: "center",
      width: 200,
      ...getColumnSearchProps('plot', reservedTreesFilters, handleSetReservedTreesFilters)
    },
    {
      dataIndex: "site_name",
      key: "site_name",
      title: "Site Name",
      align: "center",
      width: 200,
      ...getColumnSearchProps('site_name', reservedTreesFilters, handleSetReservedTreesFilters)
    }
  ];

  const handleDownload = async () => {
    const apiClient = new ApiClient();
    const filtersList = Object.values(filters);
    const resp = await apiClient.getPlots(0, plotsData.totalPlots, filtersList);
    return resp.results;
  };

  const handleTreeDownload = async () => {
    const apiClient = new ApiClient();
    const filtersList = Object.values(treeFilters);
    const resp = await apiClient.getGiftAbleTrees(0, treeTotal, filtersList);
    return resp.results;
  };

  const handleReservedTreesDownload = async () => {
    if (!donation) return [];

    const apiClient = new ApiClient();
    // Create a filter for donation_id in the format expected by the backend
    const donationFilter = {
      columnField: "donation_id",
      operatorValue: "equals",
      value: donation.id
    };

    // Combine with existing filters
    const reservedFiltersList = [
      ...Object.values(reservedTreesFilters),
      donationFilter
    ];

    const reservedResp = await apiClient.getDonationTrees(
      0,
      reservedTreesTotal,
      reservedFiltersList
    );
    return reservedResp.results;
  };

  const handleConfirmReservation = async () => {
    if (!donation) return;
    const requestedCount = donation.trees_count || 0;
    let totalToReserve = 0;

    // Calculate total trees to be reserved
    if (tabValue === 0) {
      if (!hasAtLeastOneNonZeroReserve()) {
        setValidationDialog({
          open: true,
          title: 'Reservation Error',
          message: 'At least one selected plot must have a reserve count greater than zero'
        });
        return;
      }
      totalToReserve = selectedPlots.reduce((sum, plot) => sum + plot.reserveCount, 0);
    } else {
      totalToReserve = selectedTrees.length;
    }

    // Validation: Check if trying to reserve more than requested
    if (totalToReserve > requestedCount) {
      setValidationDialog({
        open: true,
        title: 'Reservation Error',
        message: `Cannot reserve more trees (${totalToReserve}) than requested (${requestedCount})`
      });
      return; // Stop execution here - don't submit
    }

    // Validation: Check if trying to reserve zero trees
    if (totalToReserve === 0) {
      setValidationDialog({
        open: true,
        title: 'Reservation Error',
        message: 'Please select at least one tree to reserve'
      });
      return;
    }

    try {
      const apiClient = new ApiClient();

      if (tabValue === 0) {
        // Plot-based reservation
        const updatedDonation = await apiClient.reserveTreesForDonation(
          donation.id,
          [],
          true,
          selectedPlots.map(plot => ({ plot_id: plot.id, trees_count: plot.reserveCount })),
          diversify,
          bookAllHabits
        );
        dispatch({
          type: donationActionTypes.UPDATE_DONATION_SUCCEEDED,
          payload: updatedDonation,
        });
      } else {
        // Tree-based reservation
        const updatedDonation = await apiClient.reserveTreesForDonation(
          donation.id,
          selectedTrees.map(tree => tree.id),
          false,
          [],
          diversify,
          bookAllHabits
        );
        dispatch({
          type: donationActionTypes.UPDATE_DONATION_SUCCEEDED,
          payload: updatedDonation,
        });
      }
      toast.success("Trees reserved successfully!")
      handleClose(); // Close dialog on success
    } catch (error: any) {
      toast.error(error.message);
      setValidationDialog({
        open: true,
        title: 'Reservation Failed',
        message: error.message || "Failed to reserve trees"
      });
    }
  };

  const handleClose = () => {
    setSelectedTrees([]);
    setSelectedTreeIds([]);
    setTabValue(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
      <DialogTitle>
        Reserve Trees for Donation #{donation?.id}
        <Typography variant="subtitle1">Donor: {donation?.user_name}</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box mb={2}>
          <Typography>
            <strong>Requested Trees:</strong> {donation?.trees_count}
          </Typography>
          <Typography>
            <strong>Reserved:</strong> {donation?.booked}
          </Typography>
          <Typography>
            <strong>Remaining:</strong> {(donation?.trees_count || 0) - (donation?.booked || 0)}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="reservation tabs"
            TabIndicatorProps={{ style: { backgroundColor: 'green' } }}
            variant="fullWidth"
          >
            <Tab
              label="Reserve by Plot"
              sx={{
                '&.Mui-selected': { color: 'green' }
              }}
            />
            <Tab
              label="Select Individual Trees"
              sx={{
                '&.Mui-selected': { color: 'green' }
              }}
            />
            <Tab
              label="Unreserve Trees"
              sx={{
                '&.Mui-selected': { color: 'green' }
              }}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <GeneralTable
            loading={plotsData.loading}
            rows={tableRows}
            columns={columns}
            totalRecords={plotsData.totalPlots}
            page={page}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
            onDownload={handleDownload}
            onSelectionChanges={handleSelectionChange}
            footer
            tableName="Plots Selection"
          />

          {/* Selected Plots Section */}
          {selectedPlots.length > 0 && (
            <Paper elevation={1} sx={{ p: 3, mt: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="green">
                  Selected Plots
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Trees Selected: {selectedPlots.reduce((sum, plot) => sum + plot.reserveCount, 0)}
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Plot Name</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Available Trees</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Reserve Trees</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Remaining</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPlots.map((plot) => (
                      <TableRow
                        key={plot.id}
                        sx={{
                          '&:hover': { backgroundColor: 'action.hover' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>{plot.name}</TableCell>
                        <TableCell align="right">{plot.availableTrees}</TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            size="small"
                            value={plot.reserveCount}
                            onChange={(e) =>
                              handleReserveCountChange(
                                plot.id,
                                Math.min(Number(e.target.value), plot.availableTrees)
                              )
                            }
                            inputProps={{
                              min: 0,
                              max: plot.availableTrees,
                              style: { textAlign: 'right' }
                            }}
                            sx={{
                              width: 100,
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: 'primary.main'
                                }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'text.secondary' }}>
                          {plot.availableTrees - plot.reserveCount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <GeneralTable
            loading={treeLoading}
            rows={treeTableRows}
            columns={treeColumns}
            totalRecords={treeTotal}
            page={treePage}
            pageSize={treePageSize}
            onPaginationChange={handleTreePaginationChange}
            onDownload={handleTreeDownload}
            footer
            tableName="Trees Selection"
          />

          {/* Selected Trees Section */}
          {selectedTrees.length > 0 && (
            <Paper elevation={1} sx={{ p: 3, mt: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="green">
                  Selected Trees
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Trees Selected: {selectedTrees.length}
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Sapling ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Plant Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Plot Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTrees.map((tree) => (
                      <TableRow
                        key={tree.id}
                        sx={{
                          '&:hover': { backgroundColor: 'action.hover' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>{tree.sapling_id}</TableCell>
                        <TableCell>{tree.plant_type}</TableCell>
                        <TableCell>{tree.plot}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleRemoveTree(tree.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" color="green">
              Reserved Trees
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => setUnreserveAllDialogOpen(true)}
              disabled={reservedTreesTotal === 0}
            >
              Unreserve All Trees
            </Button>
          </Box>

          <GeneralTable
            loading={reservedTreesLoading}
            rows={reservedTreesTableRows}
            columns={reservedTreesColumns}
            totalRecords={reservedTreesTotal}
            page={reservedTreesPage}
            pageSize={reservedTreesPageSize}
            onPaginationChange={handleReservedTreesPaginationChange}
            onDownload={handleReservedTreesDownload}
            onSelectionChanges={handleReservedTreeSelection}
            footer
            tableName="Reserved Trees"
          />

          {selectedReservedTrees.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleUnreserveSelectedTrees}
              >
                Unreserve Selected Trees ({selectedReservedTrees.length})
              </Button>
            </Box>
          )}
        </TabPanel>

        {tabValue === 0 && (
          <Paper elevation={1} sx={{ p: 3, mt: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="green">
              Reservation Preferences
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bookAllHabits}
                    onChange={(e) => setBookAllHabits(e.target.checked)}
                    color="primary"
                    size="medium"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Include all plant habits
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Reserve trees from available trees, shrubs, herbs, climbers etc.
                    </Typography>
                  </Box>
                }
                sx={{
                  m: 0,
                  p: 1.5,
                  borderRadius: 1,
                  '&:hover': { backgroundColor: 'action.hover' },
                  alignItems: 'flex-start',
                  '& .MuiFormControlLabel-label': {
                    marginTop: 0
                  }
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={diversify}
                    onChange={(e) => setDiversify(e.target.checked)}
                    color="primary"
                    size="medium"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Diversify tree selection
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Select trees from different species to maximize biodiversity
                    </Typography>
                  </Box>
                }
                sx={{
                  m: 0,
                  p: 1.5,
                  borderRadius: 1,
                  '&:hover': { backgroundColor: 'action.hover' },
                  alignItems: 'flex-start',
                  '& .MuiFormControlLabel-label': {
                    marginTop: 0
                  }
                }}
              />
            </Box>
          </Paper>
        )}
      </DialogContent>
      <Dialog
        open={validationDialog.open}
        onClose={() => setValidationDialog(prev => ({ ...prev, open: false }))}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{validationDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{validationDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setValidationDialog(prev => ({ ...prev, open: false }))}
            color="success"
            variant="contained"
            autoFocus
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#388e3c',
              }
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmReservation}
          color="success"
          variant="contained"
          disabled={
            (tabValue === 0 && (selectedPlots.length === 0 || !hasAtLeastOneNonZeroReserve())) ||
            (tabValue === 1 && selectedTrees.length === 0)
          }
        >
          Confirm Reservation
        </Button>
      </DialogActions>

      {/* Confirmation Dialog for Unreserve All */}
      <Dialog
        open={unreserveAllDialogOpen}
        onClose={() => setUnreserveAllDialogOpen(false)}
      >
        <DialogTitle>Confirm Unreserve All Trees</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unreserve all trees for donation #{donation?.id}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnreserveAllDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setUnreserveAllDialogOpen(false);
              handleUnreserveAllTrees();
            }}
            color="error"
            variant="contained"
          >
            Unreserve All
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default DonationTrees;