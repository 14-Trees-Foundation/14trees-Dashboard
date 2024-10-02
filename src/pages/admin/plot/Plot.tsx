import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { GridFilterItem } from "@mui/x-data-grid";
import AddPlot from "./AddPlot";
import { Forms } from "../Forms/Forms"
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Plot } from "../../../types/plot";
import * as plotActionCreators from "../../../redux/actions/plotActions";
import * as siteActionCreators from "../../../redux/actions/siteActions";
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
import { TableColumnsType } from "antd";
import getColumnSearchProps, { getColumnSelectedItemFilter, getSortIcon } from "../../../components/Filter";
import TableComponent from "../../../components/Table";
import { ToastContainer, toast } from "react-toastify";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import { Site } from "../../../types/site";
import UpdateCoords from "./UpdateCoords";
import ApiClient from "../../../api/apiClient/apiClient";


export const PlotComponent = () => {
  const dispatch = useAppDispatch();
  const { getPlots, createPlot, updatePlot, deletePlot, getPlotTags, assignPlotsToSite } = bindActionCreators(
    plotActionCreators,
    dispatch
  );
  const { getSites } = bindActionCreators(siteActionCreators, dispatch);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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

  const [orderBy, setOrderBy] = useState<{ column: string, order: 'ASC' | 'DESC' }[]>([]);

  const defaultTreesFilter = {
    columnField: "tree_health",
    value: [null, "healthy", "diseased"],
    operatorValue: "isAnyOf",
  };

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  useEffect(() => {
    getPlotData();
  }, [pageSize, page, filters, includeDeadLostTrees, orderBy]);

  const getPlotData = async () => {
    setLoading(true);
    let filtersData = Object.values(filters);
    if (includeDeadLostTrees) {
      filtersData.push({ ...defaultTreesFilter, value: [...defaultTreesFilter.value, "dead", "lost"] });
    } else {
      filtersData.push(defaultTreesFilter);
    }

    const categoryIdx = filtersData.findIndex(item => item.columnField === 'category');
    if (categoryIdx > -1) {
      filtersData[categoryIdx].value = (filtersData[categoryIdx].value as string[]).filter(item => item !== 'Unknown');
      filtersData[categoryIdx].value.push(null);
    }

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
    getPlotTagsData();
  }, []);

  const getPlotTagsData = async () => {
    getPlotTags(page * pageSize, pageSize);
  };

  let plotsList: Plot[] = [];
  const plotsData = useAppSelector((state: RootState) => state.plotsData);
  if (plotsData) {
    plotsList = Object.values(plotsData.plots);
    plotsList = plotsList.sort((a: any, b: any) => {
      for (let { column, order } of orderBy) {
        if (a[column] > b[column]) {
          return order === 'ASC' ? 1 : -1;
        } else if (a[column] < b[column]) {
          return order === 'ASC' ? -1 : 1;
        }
      }
      return 0;
    });
    
  }

  let tags: string[] = [];
  const tagsData = useAppSelector((state: RootState) => state.plotTags);
  if (tagsData) {
    tags = Array.from(tagsData);
  }

  const getAllPlotData = async () => {
    let filtersData = Object.values(filters);
    getPlots(0, plotsData.totalPlots, filtersData);
  };

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

  const columns: TableColumnsType<Plot> = [
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
      dataIndex: "category",
      key: "category",
      title: "Category",
      align: "center",
      width: 150,
      render: (value) => value ? value : "Unknown",
      ...getColumnSelectedItemFilter({ dataIndex: 'category', filters, handleSetFilters, options: ["Public", "Foundation", "Unknown"] })
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
      dataIndex: "trees_count",
      key: "trees_count",
      title: getSortableHeader("Total Trees", 'trees_count'),
      align: "center",
      width: 150,
      render: (value) => value ?? 0,
    },
    {
      dataIndex: "mapped_trees_count",
      key: "mapped_trees_count",
      title: getSortableHeader("Booked Trees", 'mapped_trees_count'),
      align: "center",
      width: 150,
      render: (value) => value ?? 0,
    },
    {
      dataIndex: "assigned_trees_count",
      key: "assigned_trees_count",
      title: getSortableHeader("Assigned Trees", 'assigned_trees_count'),
      align: "center",
      width: 150,
      render: (value) => value ?? 0,
    },
    {
      dataIndex: "available_trees_count",
      key: "available_trees_count",
      title: getSortableHeader("Available Trees", 'available_trees_count'),
      align: "center",
      width: 150,
      render: (value) => value ?? 0,
    },
    {
      dataIndex: "site_name",
      key: "site_name",
      title: "Site Name",
      align: "center",
      width: 300,
      ...getColumnSearchProps('site_name', filters, handleSetFilters)
    },
  ];

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
            tags={tags}
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
          <FormControlLabel
            control={<Checkbox checked={includeDeadLostTrees} onChange={() => setIncludeDeadLostTrees(!includeDeadLostTrees)} />}
            label="Include Dead/Lost Trees"
          />
        </div>
        <TableComponent
          loading={loading}
          dataSource={plotsList}
          columns={columns}
          totalRecords={plotsData.totalPlots}
          fetchAllData={getAllPlotData}
          setPage={setPage}
          setPageSize={setPageSize}
          handleSelectionChanges={handleSelectionChanges}
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
        <Typography variant="h4">Map Trees</Typography>
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
          tags={tags}
        />
      )}
    </>
  );
};
