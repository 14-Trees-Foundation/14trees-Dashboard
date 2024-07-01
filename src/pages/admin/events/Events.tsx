import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid, GridToolbar, GridColumns ,GridFilterItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Event } from "../../../types/event";
import * as eventActionCreators from "../../../redux/actions/eventActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import AddTreeType from "./AddEvents";
import CircularProgress from "@mui/material/CircularProgress";
import getColumnSearchProps from "../../../components/Filter";

import EditEvents from "./EditEvents";
import { TableColumnsType } from "antd";
import TableComponent from "../../../components/Table";


function LoadingOverlay() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}>
      <CircularProgress />
    </div>
  );
}

export const EventsComponent = () => {
  const dispatch = useAppDispatch();
  const { getEvents  } =
    bindActionCreators(eventActionCreators, dispatch);

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<RowType | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});


  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  useEffect(() => {
    getEventsData();
  }, [page, filters]);

  const getEventsData = async () => {
    console.log('Filters Object : ' , filters)
    let filtersData = Object.values(filters);
    console.log('filtered data : ' , filtersData)
    setTimeout(async () => {
        await getEvents(page*10, 10 , filtersData);
    }, 1000);
};

let eventsList: Event[] = [];
const eventsData = useAppSelector((state: RootState) => state.eventsData);
console.log('Sites Data : ',eventsData)
if (eventsData) {
  eventsList = Object.values(eventsData.Events);
    console.log('list of sites: ' , eventsList);
}

const getAllEventsData = async () => {
    let filtersData = Object.values(filters);
    setTimeout(async () => {
        await getEvents(0, eventsData.totalEvents, filtersData);
    }, 1000);
};




  const columns: TableColumnsType<Event> = [
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
      width: 100,
      align: "center",
      render: (value, record, index )=> (
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
              // setEditModal(true);
              // setSelectedEditRow(record);
              console.log(" donation row to edit : ")
            }}
            >
            <EditIcon />
          </Button>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "0 5px" }}
        
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
    
    {
        dataIndex: "assigned_by",
        key: "assigned_by",
        title: "assigned_by",
        width: 220,
        align: "center",
        ...getColumnSearchProps('assigned_by', filters, handleSetFilters)
    },
    {
      dataIndex: "site_id",
      key: "site_id",
      title: "site_id",
      width: 220,
      align: "center",
      ...getColumnSearchProps('site_id', filters, handleSetFilters)
  },
  {
    dataIndex: "type",
    key: "type",
    title: "type",
    width: 220,
    align: "center",
    ...getColumnSearchProps('type', filters, handleSetFilters)
},
{
  dataIndex: "name",
  key: "name",
  title: "name",
  width: 220,
  align: "center",
  ...getColumnSearchProps('name', filters, handleSetFilters)
},
{
  dataIndex: "description",
  key: "description",
  title: "description",
  width: 220,
  align: "center",
  ...getColumnSearchProps('description', filters, handleSetFilters)
},
{
  dataIndex: "event_location",
  key: "event_location",
  title: "event_location",
  width: 220,
  align: "center",
  ...getColumnSearchProps('event_location', filters, handleSetFilters)
},
{
  dataIndex: "tags",
  key: "tags",
  title: "tags",
  width: 220,
  align: "center",
  ...getColumnSearchProps('tags', filters, handleSetFilters)
},
{
  dataIndex: "memories",
  key: "memories",
  title: "memories",
  width: 220,
  align: "center",
  ...getColumnSearchProps('memories', filters, handleSetFilters)
},
{
  dataIndex: "event_date",
  key: "event_date",
  title: "event_date",
  width: 220,
  align: "center",
  ...getColumnSearchProps('event_date', filters, handleSetFilters)
},
  
  ];

  const data = [
    {
      "id": 1,
      "assigned_by": 294,
      "site_id": null,
      "type": "1",
      "name": null,
      "description": null,
      "event_location": null,
      "tags": "[]",
      "memories": null,
      "event_date": "2022-01-04T22:03:14.000Z"
    },
    {
      "id": 2,
      "assigned_by": 265,
      "site_id": null,
      "type": "1",
      "name": null,
      "description": null,
      "event_location": null,
      "tags": "[]",
      "memories": null,
      "event_date": "2022-02-28T10:12:06.000Z"
    },
    {
      "id": 3,
      "assigned_by": 265,
      "site_id": null,
      "type": "1",
      "name": null,
      "description": null,
      "event_location": null,
      "tags": "[]",
      "memories": null,
      "event_date": "2022-02-28T10:22:02.000Z"
    },
    {
      "id": 4,
      "assigned_by": 336,
      "site_id": null,
      "type": "2",
      "name": null,
      "description": null,
      "event_location": null,
      "tags": "[]",
      "memories": null,
      "event_date": "2022-04-02T01:56:54.000Z"
    },
    {
      "id": 5,
      "assigned_by": 294,
      "site_id": null,
      "type": "1",
      "name": null,
      "description": null,
      "event_location": null,
      "tags": "[]",
      "memories": null,
      "event_date": "2022-02-18T06:49:39.000Z"
    }
  ];


  type RowType = {
    id: string;
    name: string;
  };

//   const handleDeleteTreeType = (row: any) => {
//     setOpenDeleteModal(true);
//     setSelectedItem(row);
//   };

//   const handleEditSubmit = (formData: any) => {
//     updateTreeType(formData);
//   };

//   const handleCreateEventsData = (formData: any) => {
//     console.log(formData);
// };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}>
        <Button
          variant="contained"
          style={{ backgroundColor: "blue" }}
          onClick={handleModalOpen}>
          Add Events
        </Button>
        {/* <AddTreeType
          open={open}
          handleClose={handleModalClose}
          createEvents={handleCreateEventsData}
        /> */}
      </div>

      <Box sx={{ height: 540, width: "100%", marginTop:'40px' }}>
      <TableComponent
          dataSource={eventsList}
          columns={columns}
          totalRecords={eventsData.totalEvents}
          fetchAllData={getAllEventsData}
          setPage={setPage}
        />
      </Box>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete {selectedItem?.id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("Deleting item...", selectedItem);
              // if (selectedItem !== null) {
              //   deleteTreeType(selectedItem);
              // }
              setOpenDeleteModal(false);
            }}
            color="primary"
            autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* {selectedEditRow && (
        <EditEvents
          row={selectedEditRow}
          openeditModal={editModal}
          setEditModal={setEditModal}
          editSubmit={handleEditSubmit}
        />
      )} */}
    </>
  );
};
