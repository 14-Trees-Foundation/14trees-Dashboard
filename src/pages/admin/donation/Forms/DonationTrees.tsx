import { FC, useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Checkbox, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControlLabel
} from "@mui/material";
import { Plot, PlotAccessibilityList } from "../../../../types/plot";
import { Donation } from "../../../../types/donation";
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

const DonationTrees: FC<DonationTreesProps> = ({ open, onClose, donation }) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [orderBy, setOrderBy] = useState<Order[]>([]);
  const [selectedPlots, setSelectedPlots] = useState<SelectedPlot[]>([]);
  const [tableRows, setTableRows] = useState<Plot[]>([]);
  const [bookAllHabits, setBookAllHabits] = useState(false);
  const [diversify, setDiversify] = useState(false);

  const dispatch = useAppDispatch();
  const { getPlots } = bindActionCreators(plotActionCreators, dispatch);

  // Fetch plots data
  useEffect(() => {
    if (open) {
      fetchPlots();
    }
  }, [open, filters, page, pageSize]);

  const fetchPlots = async () => {
    setLoading(true);
    try {
      const filtersData = Object.values(filters);
      await getPlots(page * pageSize, pageSize, filtersData);
    } catch (error) {
      console.error("Error fetching plots:", error);
    } finally {
      setLoading(false);
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
    const records: Plot[] = [];
    const maxLength = Math.min((page + 1) * pageSize, plotsData.totalPlots);

    for (let i = page * pageSize; i < maxLength; i++) {
      if (Object.hasOwn(plotsData.paginationMapping, i)) {
        const id = plotsData.paginationMapping[i];
        const record = plotsData.plots[id];
        if (record) records.push(record);
      }
    }

    setTableRows(records);
  }, [pageSize, page, plotsData]);

  // Handle plot selection
  const handleSelectionChange = (ids: number[]) => {
    // Update selectedPlots list
    const newSelectedPlots: SelectedPlot[] = [];
    ids.forEach(id => {
      const plot = plotsList.find(p => p.id === id);
      if (plot && !selectedPlots.some(sp => sp.id === id)) {
        newSelectedPlots.push({
          id: plot.id,
          name: plot.name,
          availableTrees: plot.available_trees || 0,
          reserveCount: plot.available_trees || 0,
        });
      }
    });

    // Merge existing selections with new ones
    setSelectedPlots(prev => [
      ...prev.filter(sp => ids.includes(sp.id)),
      ...newSelectedPlots,
    ]);
  };

  // Handle reserve count input change
  const handleReserveCountChange = (id: number, value: number) => {
    setSelectedPlots(prev =>
      prev.map(plot =>
        plot.id === id ? { ...plot, reserveCount: value } : plot
      )
    );
  };

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage - 1);
    setPageSize(newPageSize);
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
}

  // Table columns
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

  const handleDownload = async () => {
    const apiClient = new ApiClient();
    const filtersList = Object.values(filters);
    const resp = await apiClient.getPlots(0, plotsData.totalPlots, filtersList);
    return resp.results;
  };

  const handleConfirmReservation = async () => {
    if (!donation) return;
    try {
      const apiClient = new ApiClient();
      await apiClient.reserveTreesForDonation(
        donation.id,
        [],
        true,
        selectedPlots.map(plot => ({ plot_id: plot.id, trees_count: plot.reserveCount })), // plots
        diversify,
        bookAllHabits
      );
      toast.success(`Successfully reserved trees for donation ${donation?.id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        Reserve Trees for Donation #{donation?.id}
        <Typography variant="subtitle1">Donor: {donation?.user_name}</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box mb={2}>
          <Typography>
            <strong>Requested Trees:</strong> {donation?.trees_count}
          </Typography>
        </Box>

        <GeneralTable
          loading={loading}
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmReservation}
          color="success"
          variant="contained"
          disabled={selectedPlots.length === 0}
        >
          Confirm Reservation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DonationTrees;