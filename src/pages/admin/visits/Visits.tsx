import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from '@mui/icons-material/Group';
import Collections from '@mui/icons-material/Collections';
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
import {

  GridFilterItem,
} from "@mui/x-data-grid";
import { TableColumnsType } from "antd";

import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";

//import components
import { VisitUsers } from "./VisitUser";
import getColumnSearchProps, { getColumnDateFilter, getColumnSelectedItemFilter } from "../../../components/Filter";
import TableComponent from "../../../components/Table";
import GeneralTable from "../../../components/GenTable";

//import types
import { Visit, VisitTypeList } from "../../../types/visits";

//import actions
import * as visitActionCreators from "../../../redux/actions/visitActions";

//import state
import { RootState } from "../../../redux/store/store";
import { getHumanReadableDate } from "../../../helpers/utils";
import VisitForm from "./VisitForm";
import ImageGridModal from "../../../components/ImagesGrid";
import ApiClient from "../../../api/apiClient/apiClient";


export const VisitsComponent = () => {
  const dispatch = useAppDispatch();
  const { getVisits, createVisit, updateVisit, deleteVisit } = bindActionCreators(
    visitActionCreators,
    dispatch
  );

  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<any | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [tableRows, setTableRows] = useState<Visit[]>([]);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [selectedVisit , setSelectedVisit] = useState<Visit | null>(null);
  const [selectedVisitForImages , setSelectedVisitForImages] = useState<Visit | null>(null);
  const [imagesModalOpen, setImagesModalOpen] = useState(false);

  let visitsList: Visit[] = [];
  const visitsData = useAppSelector((state: RootState) => state.visitsData);
  if (visitsData) {
    visitsList = Object.values(visitsData.visits);
    visitsList = visitsList.sort((a, b) => b.id - a.id);
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);
    setPageSize(pageSize);
  }


  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  };

  useEffect(() => {
    getVisitData();
  }, [filters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (visitsData.loading) return;

      const records: Visit[] = [];
      const maxLength = Math.min((page + 1) * pageSize, visitsData.totalVisits);
      for (let i = page * pageSize; i < maxLength; i++) {
        if (Object.hasOwn(visitsData.paginationMapping, i)) {
          const id = visitsData.paginationMapping[i];
          const record = visitsData.visits[id];
          if (record) {
            records.push(record);
          }
        } else {
          getVisitData();
          break;
        }
      }

      setTableRows(records);
    }, 500)

    return () => {
      clearTimeout(handler);
    }
  }, [pageSize, page, visitsData]);

  const getVisitData = async () => {
    let filtersData = Object.values(filters);
    getVisits(page * pageSize, pageSize, filtersData);
  };



  const getAllVisitsData = async () => {
    const apiClient = new ApiClient();
    try {
      const visitsResp = await apiClient.getVisits(0, -1, Object.values(filters));
      return visitsResp.results;
    } catch (error: any) {
      toast.error(error.message);
      return [];
    }
  };

  const handleDeleteVisit = (row: Visit) => {
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: Visit) => {
    updateVisit(formData);
    setSelectedEditRow(null);
  };

  const handleCreateVisitData = (formData: Visit) => {
    createVisit(formData);
  };

  const getVisitType = (type: string) => {
    return VisitTypeList.find((visitType) => visitType.id === type)?.label || '';
  }

  const columns: TableColumnsType<Visit> = [
    {
      dataIndex: "action",
      key: "action",
      title: "Actions",
      width: 250,
      align: "center",
      render: (value, record, index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            color="success"
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => {
              setSelectedVisit(record);
            }}>
            <GroupIcon />
          </Button>
          <Button
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => {
              setEditModal(true);
              setSelectedEditRow(record);
            }}
          >
            <EditIcon />
          </Button>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "0 5px" }}
            onClick={() => handleDeleteVisit(record)}
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
    {
      dataIndex: "visit_name",
      key: "visit_name",
      title: "Visit Name",
      width: 320,
      align: "center",
      ...getColumnSearchProps("visit_name", filters, handleSetFilters),
    },
    {
      dataIndex: "visit_type",
      key: "visit_type",
      title: "Visit Type",
      width: 220,
      align: "center",
      render: getVisitType,
      ...getColumnSelectedItemFilter({dataIndex: "visit_type", filters, handleSetFilters, options: VisitTypeList.map(item => item.id)}),
    },
    {
      dataIndex: "visit_date",
      key: "visit_date",
      title: "Visit Date",
      width: 220,
      align: "center",
      render: getHumanReadableDate,
      ...getColumnDateFilter({dataIndex: "visit_date", filters, handleSetFilters, label: 'Visits' }),
    },
    {
      dataIndex: "site_name",
      key: "site_name",
      title: "Site Name",
      width: 320,
      align: "center",
      ...getColumnSearchProps("site_name", filters, handleSetFilters),
    },
    {
      dataIndex: "group_name",
      key: "group_name",
      title: "Group Name",
      width: 320,
      align: "center",
      ...getColumnSearchProps("group_name", filters, handleSetFilters),
    },
    {
      dataIndex: "user_count",
      key: "user_count",
      title: "Users #",
      width: 100,
      align: "center",
      render: (value: string) => (value ? value : "0"),
    },
    {
      dataIndex: "visit_images",
      key: "visit_images",
      title: "Images",
      width: 100,
      align: "center",
      render: (value, record, index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            style={{ margin: "0 5px" }}
            onClick={() => {
              setImagesModalOpen(true);
              setSelectedVisitForImages(record);
            }}
            disabled={!(value?.length)}
          >
            <Collections /> {value?.length || '0'}
          </Button>
        </div>
      ),
    },
  ]

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
        <Typography variant="h4" style={{ marginTop: '5px' }}>Visits</Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "5px",
            marginTop: "5px",
          }}>
          <Button variant="contained" color="success" onClick={handleModalOpen}>
            Add Visit
          </Button>
          <VisitForm
            mode={"add"}
            open={open}
            handleClose={() => {
              setOpen(false);
            }}
            onSubmit={handleCreateVisitData}
          />
        </div>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
      <Box sx={{ maxHeight: 840, width: "100%", overflowY: 'auto', marginBottom: '40px' }}>
      <GeneralTable
         loading={visitsData.loading}
         rows={tableRows}
         columns={columns}
         totalRecords={visitsData.totalVisits}
         page={page}
         pageSize={pageSize}
         onPaginationChange={handlePaginationChange}
         onDownload={getAllVisitsData}
         footer
         tableName="Visits"
        />
      </Box>
      {selectedVisit && <VisitUsers selectedVisit={selectedVisit}/>}
      {selectedVisitForImages && <ImageGridModal 
        open={imagesModalOpen}
        onClose={() => setImagesModalOpen(false)}
        imageUris={selectedVisitForImages.visit_images}
        title={selectedVisitForImages.visit_name || 'Images'}
      />}

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete '{selectedItem?.visit_name}'?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedItem !== null) {
                deleteVisit(selectedItem);
              }
              setOpenDeleteModal(false);
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {selectedEditRow && (
        <VisitForm
          mode={"edit"}
          visit={selectedEditRow}
          open={editModal}
          handleClose={() => {
            setEditModal(false);
            setSelectedEditRow(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}

    </>
  )


}