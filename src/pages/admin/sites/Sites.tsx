import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridColumns, GridFilterItem } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import EditSites from "./EditSites";
import { TableColumnsType } from "antd";
import { Site } from "../../../types/site";
import getColumnSearchProps from "../../../components/Filter";
import TableComponent from "../../../components/Table";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import * as siteActionCreators from "../../../redux/actions/siteActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import AddSite from "./AddSite";

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

export const SitesComponent = () => {
  const dispatch = useAppDispatch();
    const { getSites, createSite, updateSite, deleteSite } = bindActionCreators(
        siteActionCreators,
        dispatch
    );
  
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<any | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  }

  useEffect(() => {
    getSiteData();
  }, [page, filters]);

  const getSiteData = async () => {
      let filtersData = Object.values(filters);
      setTimeout(async () => {
          await getSites(page*10, 10, filtersData);
      }, 1000);
  };


  let sitesList: Site[] = [];
  const sitesData = useAppSelector((state: RootState) => state.sitesData);
  if (sitesData) {
      sitesList = Object.values(sitesData.sites);
  }

  const getAllSitesData = async () => {
      let filtersData = Object.values(filters);
      setTimeout(async () => {
          await getSites(0, sitesData.totalSites, filtersData);
      }, 1000);
  };

  const handleDeleteSites = (row: Site) => {
      setOpenDeleteModal(true);
      setSelectedItem(row);
  };

  const handleEditSubmit = (formData: Site) => {
      updateSite(formData);
      setSelectedEditRow(null);
  };

  const handleCreateSiteData = (formData: Site) => {
      createSite(formData);
  };

  const columns: TableColumnsType<Site> = [
    {
      dataIndex: "sr",
      key: "sr",
      title: "Sr. No.",
      width: 100,
      align: "center",
      render: (value, record, index) => index + 1 + page * 10,
    },
    {
        dataIndex: "action",
        key: "action",
        title: "Actions",
        width: 180,
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
                setEditModal(true);
                setSelectedEditRow(record);
              }}>
              <EditIcon />
            </Button>
            <Button
              variant="outlined"
              color="error"
              style={{ margin: "0 5px" }}
              onClick={() => handleDeleteSites(record)}>
              <DeleteIcon />
            </Button>
          </div>
        ),
    },
    {
      dataIndex: "name_marathi",
      key: "name_marathi",
      title: "Name (Marathi)",
      width: 220,
      align: "center",
      ...getColumnSearchProps('name_marathi', filters, handleSetFilters)
    },
    {
      dataIndex: "name_english",
      key: "name_english",
      title: "Name (English)",
      width: 220,
      align: "center",
    },
    {
      dataIndex: "owner",
      key: "owner",
      title: "Owner",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "land_type",
      key: "land_type",
      title: "Land Type",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "land_strata",
      key: "land_strata",
      title: "Land Strata",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "district",
      key: "district",
      title: "District",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "taluka",
      key: "taluka",
      title: "Taluka",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "village",
      key: "village",
      title: "Village",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "area_acres",
      key: "area_acres",
      title: "Area (Acres)",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "length_km",
      key: "length_km",
      title: "Length (Km)",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "tree_count",
      key: "tree_count",
      title: "Tree Count",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "unique_id",
      key: "unique_id",
      title: "Unique ID",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "photo_album",
      key: "photo_album",
      title: "Photo Album",
      width: 200,
      align: "center",
      render: (value) => (
        <a href={value} target="_blank" rel="noopener noreferrer">
          View Photos
        </a>
      ),
    },
    {
      dataIndex: "consent_letter",
      key: "consent_letter",
      title: "Consent Letter",
      width: 200,
      align: "center",
    },
    {
      dataIndex: "grove_type",
      key: "grove_type",
      title: "Grove Type",
      width: 180,
      align: "center",
    },
    {
      dataIndex: "map_to",
      key: "map_to",
      title: "Map To",
      width: 150,
      align: "center",
    },
    {
      dataIndex: "notion_db_pictures",
      key: "notion_db_pictures",
      title: "Notion DB Pictures",
      width: 220,
      align: "center",
    },
    {
      dataIndex: "split_village_name_1",
      key: "split_village_name_1",
      title: "Split Village Name 1",
      width: 200,
      align: "center",
    },
    {
      dataIndex: "split_village_name_2",
      key: "split_village_name_2",
      title: "Split Village Name 2",
      width: 200,
      align: "center",
    },
    {
      dataIndex: "create_id",
      key: "create_id",
      title: "Create ID",
      width: 200,
      align: "center",
    },
    {
      dataIndex: "site_key",
      key: "site_key",
      title: "Site Key",
      width: 250,
      align: "center",
    },
    {
      dataIndex: "site_key_2",
      key: "site_key_2",
      title: "Site Key 2",
      width: 200,
      align: "center",
    },
    {
      dataIndex: "temp_backup_copy_of_old_site_name_english_marathi",
      key: "temp_backup_copy_of_old_site_name_english_marathi",
      title: "Temp Backup Copy of Old Site Name",
      width: 300,
      align: "center",
    },
    {
      dataIndex: "temp_copy_of_old_site_key",
      key: "temp_copy_of_old_site_key",
      title: "Temp Copy of Old Site Key",
      width: 300,
      align: "center",
    },
    {
      dataIndex: "temp_old_site_name_in_english",
      key: "temp_old_site_name_in_english",
      title: "Temp Old Site Name (English)",
      width: 300,
      align: "center",
    },
    {
      dataIndex: "temp_old_site_name_in_marathi",
      key: "temp_old_site_name_in_marathi",
      title: "Temp Old Site Name (Marathi)",
      width: 300,
      align: "center",
    },
    {
      dataIndex: "created_at",
      key: "created_at",
      title: "Created At",
      width: 200,
      align: "center",
    },
    {
      dataIndex: "updated_at",
      key: "updated_at",
      title: "Updated At",
      width: 200,
      align: "center",
    },
  ]

  return (
    <>
      <div
          style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
          }}>
          <Button variant="contained" style={{ backgroundColor: 'blue' }} onClick={() => setOpen(true)}>
              Add Site
          </Button>
          <AddSite
              open={open}
              handleClose={() => setOpen(false)}
              createSite={handleCreateSiteData}
          />
        </div>
      <Box sx={{ height: 840, width: "100%" }}>
        <TableComponent
          dataSource={sitesList}
          columns={columns}
          totalRecords={sitesData.totalSites}
          fetchAllData={getAllSitesData}
          setPage={setPage}
        />
      </Box>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete '{selectedItem?.name_english}'?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedItem !== null) {
                deleteSite(selectedItem);
              }
              setOpenDeleteModal(false);
            }}
            color="primary"
            autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {selectedEditRow && (
        <EditSites
          row={selectedEditRow}
          openeditModal={editModal}
          closeEditModal={() => { setEditModal(false); setSelectedEditRow(null); }}
          editSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
