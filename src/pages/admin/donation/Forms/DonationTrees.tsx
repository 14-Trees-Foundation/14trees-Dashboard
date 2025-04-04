import { FC, useEffect, useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Box, Typography, Checkbox, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControlLabel
} from "@mui/material";
import { Plot } from "../../../../types/plot";
import { Donation } from "../../../../types/donation";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import { RootState } from "../../../../redux/store/store";
import GeneralTable from "../../../../components/GenTable";
import ApiClient from "../../../../api/apiClient/apiClient";
import { TableColumnsType } from "antd";
import { GridFilterItem } from "@mui/x-data-grid";
import getColumnSearchProps from "../../../../components/Filter";
import { toast } from "react-toastify";

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
  const [selectedPlotIds, setSelectedPlotIds] = useState<number[]>([]);
  const [selectedPlots, setSelectedPlots] = useState<SelectedPlot[]>([]);
  const [tableRows, setTableRows] = useState<Plot[]>([]);
  const [bookAllHabits, setBookAllHabits] = useState(false);

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
    setSelectedPlotIds(ids);

    // Update selectedPlots list
    const newSelectedPlots: SelectedPlot[] = [];
    ids.forEach(id => {
      const plot = plotsList.find(p => p.id === id);
      if (plot && !selectedPlots.some(sp => sp.id === id)) {
        newSelectedPlots.push({
          id: plot.id,
          name: plot.name,
          availableTrees: plot.available || 0,
          reserveCount: 0,
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

  // Table columns
  const columns: TableColumnsType<Plot> = [
    {
      title: "Select",
      key: "selection",
      width: 80,
      fixed: "left",
      render: (_, record) => (
        <Checkbox 
          checked={selectedPlotIds.includes(record.id)}
          onChange={() => {
            const newIds = selectedPlotIds.includes(record.id)
              ? selectedPlotIds.filter(id => id !== record.id)
              : [...selectedPlotIds, record.id];
            handleSelectionChange(newIds);
          }}
        />
      ),
    },
    {
      title: "Plot Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      ...getColumnSearchProps("name", filters, handleSetFilters),
    },
    {
      title: "Total Trees",
      dataIndex: "total",
      key: "total",
      width: 150,
      align: "right",
      render: (value) => value || 0,
    },
    {
      title: "Available Trees",
      dataIndex: "available",
      key: "available",
      width: 150,
      align: "right",
      render: (value) => value || 0,
    },
  ];

  const handleDownload = async () => {
    const apiClient = new ApiClient();
    const filtersList = Object.values(filters);
    const resp = await apiClient.getPlots(0, plotsData.totalPlots, filtersList);
    return resp.results;
  };

  const handleConfirmReservation = async () => {
    try {
      const apiClient = new ApiClient();
      await apiClient.reserveTreesForDonation(
        donation?.id || 0, // donation_id
        [], // tree_ids (empty since we're reserving by plots)
        true, // auto_reserve (since we're doing plot-based reservation)
        selectedPlots.map(plot => plot.id), // plots
        false, // diversify (using your existing state if available)
        bookAllHabits // book_all_habits
      );
      toast.success(`Successfully reserved trees for donation ${donation?.id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
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

        <Box mt={2} mb={2}>
        <FormControlLabel
               control={
               <Checkbox
                  checked={bookAllHabits}
                  onChange={(e) => setBookAllHabits(e.target.checked)}
                  color="primary"
                />
             }
           label="Include all plant habits"
        />
         </Box>

        {/* Selected Plots Section */}
        {selectedPlots.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Selected Plots
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Plot Name</strong></TableCell>
                    <TableCell align="right"><strong>Available Trees</strong></TableCell>
                    <TableCell align="right"><strong>Reserve Trees</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedPlots.map((plot) => (
                    <TableRow key={plot.id}>
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
                          }}
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
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