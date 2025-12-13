import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { GridFilterItem } from "@mui/x-data-grid";
import AddPond from "./AddPond";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WaterIcon from '@mui/icons-material/Water';
import { type Pond } from "../../../../types/pond";
import * as pondActionCreators from "../../../../redux/actions/pondActions";
import * as pondWaterLevelUpdateActions from "../../../../redux/actions/pondWaterLevelUpdateActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { RootState } from "../../../../redux/store/store";
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
import EditPond from "./EditPond";
import { getFormattedDate } from "../../../../helpers/utils";
import { TableColumnsType } from "antd";
import { toast, ToastContainer } from "react-toastify";
import TableComponent from "../../../../components/Table";
import GeneralTable from "../../../../components/GenTable";
import ApiClient from "../../../../api/apiClient/apiClient";
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../../components/Filter";
import { useTranslation } from "react-i18next";

function getCapacity(pond: any) {
    return (
      parseInt(pond.depth_ft) *
      parseInt(pond.width_ft) *
      parseInt(pond.length_ft)
    );
}

interface PondComponentInputProps {
    setSelectedPond: React.Dispatch<React.SetStateAction<Pond | null>>
}

export const PondComponent = ({ setSelectedPond }: PondComponentInputProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { getPonds, createPond, updatePond, deletePond } = bindActionCreators(
        pondActionCreators,
        dispatch
    );
    const { getPondWaterLevelUpdates } = bindActionCreators(
        pondWaterLevelUpdateActions,
        dispatch
    );

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Pond | null>(null);
    const [selectedEditRow, setSelectedEditRow] = useState<Pond | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [tableRows, setTableRows] = useState<Pond[]>([]);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
      }

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const getPondWaterLevelUpdatesData = async (id: number) => {
        getPondWaterLevelUpdates(id, 0, -1);
    };

    const handlePondWaterLevelFetch = (record: Pond) => {
        setSelectedPond(record);
        getPondWaterLevelUpdatesData(record.id);
    };

    const typesList = [
        "Storage",
        "Percolation",
    ]

    const columns: TableColumnsType<Pond> = [
        {
            dataIndex: "action",
            key: "action",
            title: t('common.tableHeaders.actions'),
            width: 250,
            align: "center",
            render: (value, record, index )=> (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        style={{ margin: "0 5px" }}
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => {
                            handlePondWaterLevelFetch(record);
                        }}>
                        <WaterIcon />
                    </Button>
                    <Button
                        style={{ margin: "0 5px" }}
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setEditModal(true);
                            setSelectedEditRow(record);
                        }}>
                        <EditIcon />
                    </Button>
                    <Button
                        style={{ margin: "0 5px" }}
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(record)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
        },  
        {
          dataIndex: "name",
          key: "name",
          title: t('common.tableHeaders.name'),
          align: "center",
          width: 300,
          ...getColumnSearchProps('name', filters, handleSetFilters)
        },
        {
            dataIndex: "type",
            key: "type",
            title: t('common.tableHeaders.type'),
            width: 150,
            align: "center",
            ...getColumnSelectedItemFilter({ dataIndex: 'type', filters, handleSetFilters, options: typesList }),
        },
        {
            dataIndex: "site_name",
            key: "site_name",
            title: t('ponds.tableHeaders.siteName'),
            width: 350,
            align: "center",
            ...getColumnSearchProps( 'site_name', filters, handleSetFilters ),
        },
        {
            dataIndex: "length_ft",
            key: "length_ft",
            title: t('ponds.tableHeaders.lengthFt'),
            width: 150,
            align: "center",
        },
        {
            dataIndex: "width_ft",
            key: "width_ft",
            title: t('ponds.tableHeaders.widthFt'),
            width: 150,
            align: "center",
        },
        {
            dataIndex: "depth_ft",
            key: "depth_ft",
            title: t('ponds.tableHeaders.depthFt'),
            width: 150,
            align: "center",
        },
        {
            dataIndex: "capacity",
            key: "capacity",
            title: t('ponds.tableHeaders.pondCapacity'),
            width: 150,
            align: "center",
            render: (value, record, index) => getCapacity(record),
        },
        {
            dataIndex: "created_at",
            key: "created_at",
            title: t('ponds.tableHeaders.createdAt'),
            width: 150,
            align: "center",
            render: getFormattedDate,
        },
        
      ];

      let pondsList: Pond[] = [];
      const pondsData = useAppSelector((state: RootState) => state.pondsData);
      if (pondsData) {
        pondsList = Object.values(pondsData.ponds);
        pondsList = pondsList.sort((a, b) => b.id - a.id)
      }
      
      useEffect(() => {
        getPondData();
      }, [filters]);
      
      useEffect(() => {
        const handler = setTimeout(() => {
          if (pondsData.loading) return;
      
          const records: Pond[] = [];
          const maxLength = Math.min((page + 1) * pageSize, pondsData.totalPonds);
          for (let i = page * pageSize; i < maxLength; i++) {
            if (Object.hasOwn(pondsData.paginationMapping, i)) {
              const id = pondsData.paginationMapping[i];
              const record = pondsData.ponds[id];
              if (record) {
                records.push(record);
              }
            } else {
              getPondData();
              break;
            }
          }
      
          setTableRows(records);
        }, 500)
      
        return () => {
          clearTimeout(handler);
        }
      }, [pageSize, page, pondsData]);

      const getPondData = async () => {
        let filtersData = Object.values(filters);
        getPonds(page*pageSize, pageSize, filtersData);
      };
      
      const getAllPondsData = async () => {
        let filtersData = Object.values(filters);
        const apiClient = new ApiClient();
        try {
          const pondsResp = await apiClient.getPonds(0, -1, filtersData);
          return pondsResp.results;
        } catch (error: any) {
          toast.error(error.message);
          return [];
        }
      };

    const handleDelete = (row: Pond) => {
        setOpenDeleteModal(true);
        setSelectedItem(row);
    };

    const handleEditSubmit = (formData: Pond) => {
        updatePond(formData);
        setSelectedEditRow(null);
    };

    const handleCreatePondData = (formData: Pond) => {
        createPond(formData);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 12px",
                }}
            >
                <Typography variant="h4" style={{ marginTop: '5px' }}>{t('ponds.title')}</Typography>
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
                        onClick={handleModalOpen}>
                        {t('ponds.addPond')}
                    </Button>
                    <AddPond
                        open={open}
                        handleClose={handleModalClose}
                        createPondData={handleCreatePondData}
                    />
                </div>
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
            
            <Box sx={{ height: 840, width: "100%" }}>
            <GeneralTable
              loading={pondsData.loading}
              rows={tableRows}
              columns={columns}
              totalRecords={pondsData.totalPonds}
              page={page}
              pageSize={pageSize}
              onPaginationChange={handlePaginationChange}
              onDownload={getAllPondsData}
              footer
              tableName={t('ponds.title')}
                />
            </Box>

            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>{t('common.confirmations.confirmDelete')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('common.confirmations.deleteConfirmation')} "{selectedItem?.name}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)} color="primary">
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={() => {
                            console.log("Deleting item...", selectedItem);
                            if (selectedItem !== null) {
                                deletePond(selectedItem);
                            }
                            setOpenDeleteModal(false);
                        }}
                        color="primary"
                        autoFocus>
                        {t('common.yes')}
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedEditRow && (
                <EditPond
                    row={selectedEditRow}
                    openEditModal={editModal}
                    handleClose={() => {
                        setEditModal(false);
                        setSelectedEditRow(null);
                    }}
                    editSubmit={handleEditSubmit}
                />
            )}
        </>
    );
};
