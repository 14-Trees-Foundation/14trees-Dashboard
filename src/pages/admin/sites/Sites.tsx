import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  GridFilterItem,
} from "@mui/x-data-grid";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSites from "./EditSites";
import SaveIcon from '@mui/icons-material/Save';
import { TableColumnsType } from "antd";
import { Site } from "../../../types/site";
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter";
import TableComponent from "../../../components/Table";
import GeneralTable from "../../../components/GenTable";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import * as siteActionCreators from "../../../redux/actions/siteActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store/store";
import AddSite from "./AddSite";
import { ToastContainer, toast } from "react-toastify";
import { SiteMap } from "./components/SiteMap";
import { getFormattedDate } from "../../../helpers/utils";
import ApiClient from "../../../api/apiClient/apiClient";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";


export const SitesComponent = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { getSites, createSite, updateSite, deleteSite } = bindActionCreators(
    siteActionCreators,
    dispatch
  );

  const [open, setOpen] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedEditRow, setSelectedEditRow] = useState<any | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [tableRows, setTableRows] = useState<Site[]>([]);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

  const siteCategories = ['Public', 'Foundation', 'Unknown']

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
  };

  let sitesList: Site[] = [];
const sitesData = useAppSelector((state: RootState) => state.sitesData);
if (sitesData) {
  sitesList = Object.values(sitesData.sites);
  // Sites are now sorted by updated_at DESC from the backend
}

const handlePaginationChange = (page: number, pageSize: number) => {
  setPage(page - 1);
  setPageSize(pageSize);
}

useEffect(() => {
  getSiteData();
}, [filters]);

useEffect(() => {
  const handler = setTimeout(() => {
    if (sitesData.loading) return;

    const records: Site[] = [];
    const maxLength = Math.min((page + 1) * pageSize, sitesData.totalSites);
    for (let i = page * pageSize; i < maxLength; i++) {
      if (Object.hasOwn(sitesData.paginationMapping, i)) {
        const id = sitesData.paginationMapping[i];
        const record = sitesData.sites[id];
        if (record) {
          records.push(record);
        }
      } else {
        getSiteData();
        break;
      }
    }

    setTableRows(records);
  }, 500)

  return () => {
    clearTimeout(handler);
  }
}, [pageSize, page, sitesData]);

const getSiteData = async () => {
  let filtersData = Object.values(filters);

  const categoryIdx = filtersData.findIndex(item => item.columnField === 'category');
  if (categoryIdx > -1) {
    filtersData[categoryIdx].value = (filtersData[categoryIdx].value as string[]).filter(item => item !== 'Unknown');
    filtersData[categoryIdx].value.push(null);
  }

  getSites(page * pageSize, pageSize, filtersData);
};

const getAllSitesData = async () => {
  let filtersData = Object.values(filters);
  const categoryIdx = filtersData.findIndex(item => item.columnField === 'category');
  if (categoryIdx > -1) {
    filtersData[categoryIdx].value = (filtersData[categoryIdx].value as string[]).filter(item => item !== 'Unknown');
    filtersData[categoryIdx].value.push(null);
  }
  
  const apiClient = new ApiClient();
  try {
    const sitesResp = await apiClient.getSites(0, -1, filtersData);
    return sitesResp.results;
  } catch (error: any) {
    toast.error(error.message);
    return [];
  }
};

  const handleDeleteSites = (row: Site) => {
    setOpenDeleteModal(true);
    setSelectedItem(row);
  };

  const handleEditSubmit = (formData: Site, file: Blob) => {
    updateSite(formData, file);
    setSelectedEditRow(null);
  };

  const handleCreateSiteData = (formData: Site, file: Blob) => {
    createSite(formData, file);
  };

  const handleSyncNotionSites = async () => {
    setSyncInProgress(true);
    const apiClient = new ApiClient();
    try {
      await apiClient.syncSitesDataFromNotion();
      toast.success('Successfully synced sites data from notion!')
    } catch (error: any) {
      if (error?.response?.data?.error) toast.error(error?.response?.data?.error)
      else toast.error(`Failed to sync sites from notion!`)
    }
    setSyncInProgress(false);
    getSiteData();
  };

  const columns: TableColumnsType<Site> = [
    // {
    //   dataIndex: "action",
    //   key: "action",
    //   title: "Actions",
    //   width: 180,
    //   align: "center",
    //   render: (value, record, index) => (
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //       }}
    //     >
    //       {/* <Button
    //         variant="outlined"
    //         style={{ margin: "0 5px" }}
    //         onClick={() => {
    //           setEditModal(true);
    //           setSelectedEditRow(record);
    //           console.log("Row data to edit : ", record);
    //         }}
    //       >
    //         <EditIcon />
    //       </Button> */}
    //       <Button
    //         variant="outlined"
    //         color="error"
    //         style={{ margin: "0 5px" }}
    //         onClick={() => handleDeleteSites(record)}
    //       >
    //         <DeleteIcon />
    //       </Button>
    //     </div>
    //   ),
    // },
    {
      dataIndex: "name_marathi",
      key: "name_marathi",
      title: t('sites.nameMarathi'),
      width: 220,
      align: "center",
      fixed: "left",
      ...getColumnSearchProps("name_marathi", filters, handleSetFilters),
    },
    {
      dataIndex: "name_english",
      key: "name_english",
      title: t('sites.nameEnglish'),
      width: 220,
      align: "center",
      fixed: "left",
      ...getColumnSearchProps("name_english", filters, handleSetFilters),
    },
    {
      dataIndex: "owner",
      key: "owner",
      title: t('sites.owner'),
      width: 180,
      align: "center",
      ...getColumnSearchProps("owner", filters, handleSetFilters),
    },
    {
      dataIndex: "maintenance_type",
      key: "maintenance_type",
      title: t('sites.serviceType'),
      width: 180,
      align: "center",
      ...getColumnSearchProps("maintenance_type", filters, handleSetFilters),

    },
    {
      dataIndex: "land_type",
      key: "land_type",
      title: t('sites.landType'),
      width: 150,
      align: "center",
      ...getColumnSearchProps("land_type", filters, handleSetFilters),
    },
    {
      dataIndex: "category",
      key: "category",
      title: t('sites.siteType'),
      width: 150,
      align: "center",
      ...getColumnSelectedItemFilter({dataIndex: "category", filters, handleSetFilters, options: siteCategories}),
    },
    {
      dataIndex: "district",
      key: "district",
      title: t('sites.district'),
      width: 150,
      align: "center",
      ...getColumnSearchProps("district", filters, handleSetFilters),
    },
    {
      dataIndex: "taluka",
      key: "taluka",
      title: t('sites.taluka'),
      width: 150,
      align: "center",
      ...getColumnSearchProps("taluka", filters, handleSetFilters),
    },
    {
      dataIndex: "village",
      key: "village",
      title: t('sites.village'),
      width: 150,
      align: "center",
      ...getColumnSearchProps("village", filters, handleSetFilters),
    },
    {
      dataIndex: "area_acres",
      key: "area_acres",
      title: t('sites.areaAcres'),
      width: 150,
      align: "center",
    },
    {
      dataIndex: "kml_file_link",
      key: "kml_file_link",
      title: t('sites.kmlFile'),
      width: 150,
      align: "center",
      render: (value, record, index) => {
        return value ? <Button variant="outlined" color="success"><a href={value} download={record.name_english + '.kml'} style={{ textTransform: 'none', color: 'inherit' }}>{t('sites.download')}</a></Button> : t('sites.notAvailable')
      },
      ...getColumnSearchProps("kml_file_link", filters, handleSetFilters),
    },
    {
      dataIndex: "length_km",
      key: "length_km",
      title: t('sites.lengthKm'),
      width: 150,
      align: "center",
    },
    {
      dataIndex: "tags",
      key: "tags",
      title: t('sites.tags'),
      width: 150,
      align: "center",
    },
    {
      dataIndex: "grove_type",
      key: "grove_type",
      title: t('sites.groveType'),
      width: 180,
      align: "center",
    },
  ];

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
        <Typography variant="h4" style={{ marginTop: '5px' }}>{t('sites.sites')}</Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "5px",
            marginTop: "5px",
          }}>
          <LoadingButton
            loading={syncInProgress}
            loadingPosition="start"
            variant="contained"
            color="success"
            onClick={handleSyncNotionSites}
            startIcon={<SaveIcon />}
            style={{ marginRight: "10px" }}
          >
            {t('sites.syncNotionSites')}
          </LoadingButton>
          <Button disabled variant="contained" color="success" onClick={handleModalOpen}>
            {t('sites.addSite')}
          </Button>
          <AddSite
            open={open}
            handleClose={handleModalClose}
            createSite={handleCreateSiteData}
          />
        </div>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
      <Box sx={{ height: 840, width: "100%" }}>
        <GeneralTable
           loading={sitesData.loading}
           rows={tableRows}
           columns={columns}
           totalRecords={sitesData.totalSites}
           page={page}
           pageSize={pageSize}
           onPaginationChange={handlePaginationChange}
           onDownload={getAllSitesData}
           footer
           tableName="Sites"
        />
      </Box>



      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>{t('sites.confirmDelete')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('sites.deleteConfirmation', { siteName: selectedItem?.name_english })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => {
              if (selectedItem !== null) {
                deleteSite(selectedItem);
              }
              setOpenDeleteModal(false);
            }}
            color="primary"
            autoFocus
          >
            {t('common.yes')}
          </Button>
        </DialogActions>
      </Dialog>

      {selectedEditRow && (
        <EditSites
          row={selectedEditRow}
          openeditModal={editModal}
          closeEditModal={() => {
            setEditModal(false);
            setSelectedEditRow(null);
          }}
          editSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
