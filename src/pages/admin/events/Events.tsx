import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { GridFilterItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiClient from "../../../api/apiClient/apiClient";
import { Event } from "../../../types/event";
import * as eventActionCreators from "../../../redux/actions/eventActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import getColumnSearchProps from "../../../components/Filter";
import { TableColumnsType } from "antd";
import GeneralTable from "../../../components/GenTable";
import { toast, ToastContainer } from "react-toastify";
import AddEvents from "./AddEvents";
import EditEvents from "./EditEvents";

export const EventsComponent = () => {
  const dispatch = useAppDispatch();
  const { getEvents } =
    bindActionCreators(eventActionCreators, dispatch);

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Event | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<Event | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [tableRows, setTableRows] = useState<Event[]>([]);

  const eventsData = useAppSelector((state: RootState) => state.eventsData);
  let eventsList: Event[] = [];
  if (eventsData) {
    eventsList = Object.values(eventsData.Events);
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);
    setPageSize(pageSize);
  };

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  };

  useEffect(() => {
    getEventsData();
  }, [filters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (eventsData.loading) return;

      const records: Event[] = [];
      const maxLength = Math.min((page + 1) * pageSize, eventsData.totalEvents);
      for (let i = page * pageSize; i < maxLength; i++) {
        if (Object.hasOwn(eventsData.paginationMapping, i)) {
          const id = eventsData.paginationMapping[i];
          const record = eventsData.Events[id];
          if (record) {
            records.push(record);
          }
        } else {
          getEventsData();
          break;
        }
      }

      setTableRows(records);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [pageSize, page, eventsData]);

  const getEventsData = async () => {
    let filtersData = Object.values(filters);
    getEvents(page * pageSize, pageSize, filtersData);
  };

  const getAllEventsData = async () => {
    const apiClient = new ApiClient();
    try {
      const eventsResp = await apiClient.getEvents(0, -1, Object.values(filters));
      return eventsResp.results;
    } catch (error: any) {
      toast.error(error.message);
      return [];
    }
  };

  const columns: TableColumnsType<Event> = [
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
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
              setEditModal(true);
              setSelectedEditRow(record);
              console.log(" donation row to edit : ")
            }}
          >
            <EditIcon />
          </Button>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "0 5px" }}
            onClick={() => handleDeleteEvent(record)}
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      width: 180,
      align: "center",
      ...getColumnSearchProps('name', filters, handleSetFilters)
    },
    {
      dataIndex: "site_name",
      key: "site_name",
      title: "Site Name",
      width: 120,
      align: "center",
      ...getColumnSearchProps('site_name', filters, handleSetFilters)
    },
    {
      dataIndex: "tags",
      key: "tags",
      title: "Tags",
      width: 150,
      align: "center",
      ...getColumnSearchProps('tags', filters, handleSetFilters)
    },
    {
      dataIndex: "event_date",
      key: "event_date",
      title: "Event Date",
      width: 150,
      align: "center",
      ...getColumnSearchProps('event_date', filters, handleSetFilters),
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      dataIndex: "link",
      key: "link",
      title: "Event Dashboard",
      width: 150,
      align: "center",
      render: (linkId: string) => (
        <a
          href={`/events/${linkId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outlined"
            color="success"
            size="small"
            sx={{
              textTransform: 'none',
            }}
          >
            Dashboard
          </Button>
        </a>
      )
    },
  ]

  const handleDeleteEvent = (row: Event) => {
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: Event) => {
    // updateEvent(formData);
    setSelectedEditRow(null);
    setEditModal(false);
  };

  const handleCreateEventsData = (formData: Event) => {
    console.log(formData);
    // createEvent(formData);
  };

  return (
    <>
      <ToastContainer />
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 12px",
      }}>
        <Typography variant="h4" style={{ marginTop: '5px' }}>Events</Typography>
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "5px",
          marginTop: "5px",
        }}>
          <Button variant="contained" color="success" onClick={handleModalOpen}>
            Add Event
          </Button>
          <AddEvents
            open={open}
            handleClose={handleModalClose}
            createEvents={handleCreateEventsData}
          />
        </div>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />

      <Box sx={{ height: 840, width: "100%" }}>
        <GeneralTable
          loading={eventsData.loading}
          rows={tableRows}
          columns={columns}
          totalRecords={eventsData.totalEvents}
          page={page}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onDownload={getAllEventsData}
          footer
          tableName="Events"
        />
      </Box>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete event {selectedItem?.name || `ID: ${selectedItem?.id}`}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDeleteModal(false)} color="error">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("Deleting item...", selectedItem);
              /*if (selectedItem !== null) {
                deleteEvent(selectedItem);
              }*/
              setOpenDeleteModal(false);
            }}
            variant="contained"
            color="success"
            autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {selectedEditRow && (
        <EditEvents
          row={selectedEditRow}
          openeditModal={editModal}
          setEditModal={setEditModal}
          editSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
