import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { GridFilterItem } from "@mui/x-data-grid";
import AddPlot from "./AddPlot";
import { Forms } from "../Forms/Forms"
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Plot } from "../../../types/plot";
import * as plotActionCreators from "../../../redux/actions/plotActions";
import * as siteActionCreators from "../../../redux/actions/siteActions";
import * as tagActionCreators from "../../../redux/actions/tagActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";
import EditPlot from "./EditPlot";
import { Segmented, Table, TableColumnsType } from "antd";
import getColumnSearchProps, { getColumnSelectedItemFilter, getSortIcon } from "../../../components/Filter";
import { ToastContainer, toast } from "react-toastify";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import { Site } from "../../../types/site";
import UpdateCoords from "./UpdateCoords";
import ApiClient from "../../../api/apiClient/apiClient";
import GeneralTable from "../../../components/GenTable";

function getColumn(field: string, treeHabitat: string) {
  return field + (treeHabitat ? "_" + treeHabitat : '')
}

const TableSummary = (plots: Plot[], selectedPlotIds: number[], totalColumns: number, treeHabitat: string) => {

  const calculateSum = (data: (number | undefined)[]) => {
    return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
  }

  return (
    <Table.Summary fixed='bottom'>
      <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
        <Table.Summary.Cell align="right" index={totalColumns - 10} colSpan={totalColumns - 8}>
          <strong>Total</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right" index={totalColumns - 8} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.total))}</Table.Summary.Cell>
        <Table.Summary.Cell align="right" index={totalColumns - 7} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.tree_count))}</Table.Summary.Cell>
        <Table.Summary.Cell align="right" index={totalColumns - 6} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.shrub_count))}</Table.Summary.Cell>
        <Table.Summary.Cell align="right" index={totalColumns - 5} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.herb_count))}</Table.Summary.Cell>
        <Table.Summary.Cell align="right" index={totalColumns - 4} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot: any) => plot[getColumn("booked", treeHabitat)]))}</Table.Summary.Cell>
        <Table.Summary.Cell align="right" index={totalColumns - 3} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot: any) => plot[getColumn("assigned", treeHabitat)]))}</Table.Summary.Cell>
        <Table.Summary.Cell align="right" index={totalColumns - 2} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot: any) => plot[getColumn("unbooked_assigned", treeHabitat)]))}</Table.Summary.Cell>
        <Table.Summary.Cell align="right" index={totalColumns - 1} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot: any) => plot[getColumn("available", treeHabitat)]))}</Table.Summary.Cell>
        <Table.Summary.Cell align="right" index={totalColumns - 0} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot: any) => plot[getColumn("card_available", treeHabitat)]))}</Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  )
}

export const PlotComponent = () => {
  const dispatch = useAppDispatch();
  const { getPlots, createPlot, updatePlot, deletePlot, assignPlotsToSite } = bindActionCreators(
    plotActionCreators,
    dispatch
  );
  const { getTags } = bindActionCreators(tagActionCreators, dispatch);
  const { getSites } = bindActionCreators(siteActionCreators, dispatch);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [tableRows, setTableRows] = useState<Plot[]>([]);
  const [selectedItem, setSelectedItem] = useState<Plot | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<Plot | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [selectedPlotIds, setSelectedPlotIds] = useState<number[]>([]);
  const [selectSiteModal, setSelectSiteModal] = useState<boolean>(false);
  const [sitePage, setSitePage] = useState(0);
  const [sitesLoading, setSitesLoading] = useState(false);
  const [siteNameInput, setSiteNameInput] = useState("");
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [updateCoords, setUpdateCoords] = useState(false);
  const [includeDeadLostTrees, setIncludeDeadLostTrees] = useState(false);
  const [treeHabit, setTreeHabit] = useState<'trees' | 'shrubs' | 'herbs' | ''>('trees');

  const [orderBy, setOrderBy] = useState<{ column: string, order: 'ASC' | 'DESC' }[]>([]);

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  const plotsData = useAppSelector((state: RootState) => state.plotsData);

  useEffect(() => {
    getPlotData();
  }, [filters, orderBy]);

  useEffect(() => {
    const records: Plot[] = [];
    const maxLength = Math.min((page + 1) * pageSize, plotsData.totalPlots);
    for (let i = page * pageSize; i < maxLength; i++) {
      if (Object.hasOwn(plotsData.paginationMapping, i)) {
        const id = plotsData.paginationMapping[i];
        const record = plotsData.plots[id];
        if (record) {
          records.push(record);
        }
      } else {
        getPlotData();
        break;
      }
    }

    setTableRows(records);
  }, [pageSize, page, plotsData]);

  const getPlotData = async () => {
    setLoading(true);
    let filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];

    const accessibilityIdx = filtersData.findIndex(item => item.columnField === 'accessibility_status');
    if (accessibilityIdx > -1) {
      filtersData[accessibilityIdx].value = filtersData[accessibilityIdx].value.map((item: string) => {
        switch (item) {
          case "Accessible":
            return "accessible";
          case "Inaccessible":
            return "inaccessible";
          case "Moderately Accessible":
            return "moderately_accessible";
          default:
            return null;
        }
      })
    }

    getPlots(page * pageSize, pageSize, filtersData, orderBy);
    setTimeout(async () => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getTags(0, 100);
  }, []);

  let tags: string[] = [];
  const tagsData = useAppSelector((state: RootState) => state.tagsData);
  if (tagsData) {
    tags = Object.values(tagsData.tags).map(item => item.tag);
  }

  useEffect(() => {
    getSitesData();
  }, [sitePage, siteNameInput]);

  const getSitesData = async () => {
    const siteNameFilter = {
      columnField: "name_english",
      value: siteNameInput,
      operatorValue: "contains",
    };

    setSitesLoading(true);
    getSites(sitePage * 10, 10, [siteNameFilter]);
    setTimeout(async () => {
      setSitesLoading(false);
    }, 1000);
  };

  let sitesList: Site[] = [];
  const siteData = useAppSelector((state) => state.sitesData);
  if (siteData) {
    sitesList = Object.values(siteData.sites);
    sitesList = sitesList.sort((a, b) => {
      return b.id - a.id;
    });
  }

  const accessibilityList = [
    { value: "accessible", label: "Accessible" },
    { value: "inaccessible", label: "Inaccessible" },
    { value: "moderately_accessible", label: "Moderately Accessible" },
  ];

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

  const getSortableHeader = (header: string, key: string) => {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
        {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
      </div>
    )
  }

  const [columns, setColumns] = useState<TableColumnsType<Plot>>([
    {
      dataIndex: "action",
      key: "action",
      title: "Actions",
      width: 150,
      align: "center",
      render: (value, record, index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Button
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => {
              setSelectedEditRow(record);
              setEditModal(true);
              console.log("Row to edit: ", record);
            }}>
            <EditIcon />
          </Button>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "0 5px" }}
            onClick={() => handleDelete(record)}>
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      align: "center",
      width: 300,
      ...getColumnSearchProps('name', filters, handleSetFilters)
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
      dataIndex: "accessibility_status",
      key: "accessibility_status",
      title: "Accessibility",
      align: "center",
      width: 200,
      render: (value) => value ? accessibilityList.find((item) => item.value === value)?.label : "Unknown",
      ...getColumnSelectedItemFilter({ dataIndex: 'accessibility_status', filters, handleSetFilters, options: accessibilityList.map((item) => item.label).concat("Unknown") })
    },
    {
      dataIndex: "gat",
      key: "gat",
      title: "Gat No.",
      align: "center",
      width: 150,
    },
    {
      dataIndex: "tags",
      key: "tags",
      title: "Tags",
      align: "center",
      width: 150,
      render: (tags) => tags ? tags.join(", ") : '',
      ...getColumnSelectedItemFilter({ dataIndex: 'tags', filters, handleSetFilters, options: tags })
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
      dataIndex: "acres_area",
      key: "Area (acres)",
      title: getSortableHeader("Area (acres)", 'acres_area'),
      align: "right",
      width: 150,
      render: (value: number) => value ? value.toFixed(3) : 'Unknown', 
    },
    {
      dataIndex: "pit_count",
      key: "No. of Pits",
      title: getSortableHeader("No. of Pits", 'pit_count'),
      align: "right",
      width: 150,
      render: (value: number) => value >= 0 ? value : 'Unknown', 
    },
    {
      dataIndex: "total",
      key: "Total Trees",
      title: getSortableHeader("Total Trees", 'total'),
      align: "right",
      width: 150,
      render: (value, record) => value ?? 0 - (includeDeadLostTrees && record.void_total ? record.void_total : 0),
    },
    {
      dataIndex: "tree_count",
      key: "Trees",
      title: getSortableHeader("Trees", 'tree_count'),
      align: "right",
      width: 150,
    },
    {
      dataIndex: "shrub_count",
      key: "Shrubs",
      title: getSortableHeader("Shrubs", 'shrub_count'),
      align: "right",
      width: 150,
    },
    {
      dataIndex: "herb_count",
      key: "Herbs",
      title: getSortableHeader("Herbs", 'herb_count'),
      align: "right",
      width: 150,
    },
    {
      dataIndex: "booked",
      key: "Booked Trees",
      title: getSortableHeader("Booked Trees", "booked"),
      align: "right",
      width: 150,
      render: (value, record) => value ?? 0 - (includeDeadLostTrees && record.void_booked ? record.void_booked : 0),
    },
    {
      dataIndex: "assigned",
      key: "Assigned Trees",
      title: getSortableHeader("Assigned Trees", "assigned"),
      align: "right",
      width: 150,
      render: (value, record) => value ?? 0 - (includeDeadLostTrees && record.void_assigned ? record.void_assigned : 0),
    },
    {
      dataIndex: "unbooked_assigned",
      key: "Unfunded Inventory (Assigned)",
      title: getSortableHeader("Unfunded Inventory (Assigned)", "unbooked_assigned"),
      align: "right",
      width: 150,
    },
    {
      dataIndex: "available",
      key: "Unfunded Inventory (Unassigned)",
      title: getSortableHeader("Unfunded Inventory (Unassigned)", "available"),
      align: "right",
      width: 150,
      render: (value, record) => value ?? 0 - (includeDeadLostTrees && record.void_available ? record.void_available : 0),
    },
    {
      dataIndex: "card_available",
      key: "Giftable Inventory",
      title: getSortableHeader("Giftable Inventory", "card_available"),
      align: "right",
      width: 150,
    },
  ]);

  useEffect(() => {

    const getColumnClass = () => {
      if (treeHabit === 'trees') return 'bg-green';
      if (treeHabit === 'shrubs') return 'bg-cyan';
      if (treeHabit === 'herbs') return 'bg-yellow';

      return 'bg-orange'
    }

    setColumns(prev => {
      return prev.map((column: any) => {
        if (column.dataIndex.startsWith("booked")) {
          return {
            ...column,
            dataIndex: getColumn("booked", treeHabit),
            title: getSortableHeader("Booked Trees", getColumn("booked", treeHabit)),
            className: getColumnClass(),
          }
        } else if (column.dataIndex.startsWith("assigned")) {
          return {
            ...column,
            dataIndex: getColumn("assigned", treeHabit),
            title: getSortableHeader("Assigned Trees", getColumn("assigned", treeHabit)),
            className: getColumnClass(),
          }
        } else if (column.dataIndex.startsWith("unbooked_assigned")) {
          return {
            ...column,
            dataIndex: getColumn("unbooked_assigned", treeHabit),
            title: getSortableHeader("Unfunded Inventory (Assigned)", getColumn("unbooked_assigned", treeHabit)),
            className: getColumnClass(),
          }
        } else if (column.dataIndex.startsWith("available")) {
          return {
            ...column,
            dataIndex: getColumn("available", treeHabit),
            title: getSortableHeader("Unfunded Inventory (Unassigned)", getColumn("available", treeHabit)),
            className: getColumnClass(),
          }
        } else if (column.dataIndex.startsWith("card_available")) {
          return {
            ...column,
            dataIndex: getColumn("card_available", treeHabit),
            title: getSortableHeader("Giftable Inventory", getColumn("card_available", treeHabit)),
            className: getColumnClass(),
          }
        } else if (column.dataIndex === "total") {
          return {
            ...column,
            className: treeHabit === '' ? 'bg-orange' : undefined,
          }
        } else if (column.dataIndex === "tree_count") {
          return {
            ...column,
            className: treeHabit === 'trees' ? 'bg-green' : undefined,
          }
        } else if (column.dataIndex === "shrub_count") {
          return {
            ...column,
            className: treeHabit === 'shrubs' ? 'bg-cyan' : undefined,
          }
        } else if (column.dataIndex === "herb_count") {
          return {
            ...column,
            className: treeHabit === 'herbs' ? 'bg-yellow' : undefined,
          }
        }

        return column;
      })
    })

  }, [treeHabit, orderBy])

  const handleSelectionChanges = (plotIds: number[]) => {
    setSelectedPlotIds(plotIds);
  }

  const handleDelete = (row: Plot) => {
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: Plot) => {
    setSelectedEditRow(null);
    updatePlot(formData);
  };

  const handleCreatePlotData = (formData: Plot) => {
    createPlot(formData);
  };

  const handleAssignPlots = () => {
    if (selectedSite === null) return;
    assignPlotsToSite(selectedPlotIds, selectedSite.id);
    setSelectedSite(null);
    setTimeout(() => {
      getPlotData();
    }, 1000)
  }

  const handleUpdatePlotCoords = async (siteId: number, file: File) => {
    const apiClient = new ApiClient();
    try {
      await apiClient.updatePlotCoordsUsingKml(siteId, file);
      toast.success('Plot coordinates updated successfully');
    } catch (error) {
      toast.error('Failed to update plot coordinates');
    }

  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);
    setPageSize(pageSize);
  }

  const handleDownload = async () => {

    const apiClient = new ApiClient();
    const filtersList = Object.values(filters);
    const resp = await apiClient.getPlots(0, plotsData.totalPlots, filtersList, orderBy);
    return resp.results;
  }

  return (
    <>
      <ToastContainer />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 12px",
        }}
      >
        <Typography variant="h4" style={{ marginTop: '5px' }}>Plots</Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "5px",
            marginTop: "5px",
          }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => setUpdateCoords(true)}
            style={{ marginRight: "10px" }}
          >
            Update Coordinates
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => setSelectSiteModal(true)}
            style={{ marginRight: "10px" }}
            disabled={selectedPlotIds.length === 0}
          >
            Assign to Site
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleModalOpen}>
            Add Plot
          </Button>
          <AddPlot
            open={open}
            handleClose={handleModalClose}
            createPlot={handleCreatePlotData}
            tags={Object.values(tagsData.tags)}
          />
        </div>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
      <Box sx={{ height: 840, width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: 'center',
            justifyContent: "flex-end",
          }}
        >
          <Segmented<{ value: 'trees' | 'herbs' | 'shrubs' | '', label: string }>
            size="large"
            options={[{ value: 'trees', label: 'Trees' }, { value: 'shrubs', label: 'Shrubs' }, { value: 'herbs', label: 'Herbs' }, { value: '', label: 'Total' }]}
            onChange={(item: any) => {
              setTreeHabit(item)
            }}
          />
          <FormControlLabel
            sx={{ ml: 2 }}
            control={<Checkbox checked={includeDeadLostTrees} onChange={() => setIncludeDeadLostTrees(!includeDeadLostTrees)} />}
            label="Include Dead/Lost Trees"
          />
        </div>
        <GeneralTable
          loading={loading}
          rows={tableRows}
          columns={columns}
          totalRecords={plotsData.totalPlots}
          page={page}
          pageSize={pageSize}
          onSelectionChanges={handleSelectionChanges}
          onPaginationChange={handlePaginationChange}
          onDownload={handleDownload}
          summary={(totalColumns: number) => {
            if (totalColumns < 5) return undefined;
            return TableSummary(tableRows, selectedPlotIds, totalColumns, treeHabit)
          }}
          footer
          tableName="Plots"
        />
      </Box>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 12px",
          marginTop: 30,
        }}
      >
        <Typography variant="h4">Unreserve Trees</Typography>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
      <Forms />

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete "{selectedItem?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("Deleting item...");
              if (selectedItem !== null) {
                deletePlot(selectedItem);
              }
              setOpenDeleteModal(false);
            }}
            color="error"
            variant="outlined"
            autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={selectSiteModal} onClose={() => setSelectSiteModal(false)} >
        <DialogTitle>Select a Site</DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          <DialogContentText>
            Selected plots will be assigned to this site.
          </DialogContentText>
          <div style={{ width: 500, marginTop: 5 }}>
            <AutocompleteWithPagination
              label="Select a Site"
              options={sitesList}
              getOptionLabel={(option) => option?.name_english || ''}
              onChange={(event, newValue) => {
                setSelectedSite(newValue);
              }}
              onInputChange={(event) => {
                const { value } = event.target;
                setSitePage(0);
                setSiteNameInput(value);
              }}
              setPage={setSitePage}
              fullWidth
              size="medium"
              loading={sitesLoading}
              value={(siteNameInput === '' && selectedSite) ? selectedSite : null}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setSelectSiteModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAssignPlots();
              setSelectSiteModal(false);
            }}
            color="success"
            variant="contained"
            autoFocus
            disabled={selectedSite === null}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <UpdateCoords
        visible={updateCoords}
        handleClose={() => setUpdateCoords(false)}
        updateCoords={handleUpdatePlotCoords}
      />

      {selectedEditRow && (
        <EditPlot
          row={selectedEditRow}
          openeditModal={editModal}
          handleCloseModal={() => { setSelectedEditRow(null); setEditModal(false); }}
          editSubmit={handleEditSubmit}
          tags={Object.values(tagsData.tags)}
        />
      )}
    </>
  );
};
