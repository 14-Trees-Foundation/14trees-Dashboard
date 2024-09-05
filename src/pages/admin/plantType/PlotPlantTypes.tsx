import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
    Autocomplete,
    Divider,
    TextField,
} from "@mui/material";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import * as plotActionCreators from "../../../redux/actions/plotActions";
import { RootState } from "../../../redux/store/store";
import type { TableColumnsType } from 'antd';
import TableComponent from "../../../components/Table";
import { Plot } from "../../../types/plot";
import ApiClient from "../../../api/apiClient/apiClient";

export const PlotPlantTypes = ({ }) => {
    const dispatch = useAppDispatch();
    const { getPlots } = bindActionCreators(
        plotActionCreators,
        dispatch
    );

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
    const [plantTypes, setPlantTypes] = useState<any[]>([]);
    const [searchPlotPage, setSearchPlotPage] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (selectedPlot) {
            getPlantTypes(selectedPlot.id);
        }
    }, [selectedPlot]);

    const getPlantTypes = async (plotId: number) => {
        const apiClient = new ApiClient();
        const plantTypes = await apiClient.getPlantTypesForPlot(plotId);
        setPlantTypes(plantTypes);
    };

    const getAllPlotPlantTypes = async () => {
        console.log("Fetching all plot plant types...");
    };

    useEffect(() => {
        if (searchTerm && searchTerm.length >= 3) {
            const filter = {
                operatorValue: "contains",
                value: searchTerm,
                columnField: "name",
            }
            getPlots(searchPlotPage * 20, 20, [filter]);
        }
    }, [searchTerm, searchPlotPage]);

    useEffect(() => {
        getPlots(searchPlotPage * 10, 10);
    }, []);

    let plots: Plot[] = [];
    const plotsData = useAppSelector(
        (state: RootState) => state.plotsData
    );
    if (plotsData) {
        plots = Object.values(plotsData.plots);
    }

    const handleSearchPlotChange = (event: any, value: any) => {
        setSelectedPlot(value);
    }

    const columns: TableColumnsType<any> = [
        {
            dataIndex: "srNo",
            key: "srNo",
            title: "Sr. No.",
            align: "center",
            width: 50,
            render: (value, record, index) => {
                return page * pageSize  + index + 1;
            },
        },
        {
            dataIndex: "name",
            key: "name",
            title: "Name",
            align: "center",
            width: 350,
        },
        {
            dataIndex: "pt_cnt",
            key: "pt_cnt",
            title: "Tree Count",
            align: "center",
            width: 200,
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Autocomplete
                    size="small"
                    options={plots}
                    getOptionLabel={(option) => option.name}
                    fullWidth
                    onChange={handleSearchPlotChange}
                    renderInput={(params) => <TextField {...params} label="Select Plot" variant="outlined" />}
                    onInputChange={(event, value) => { setSearchPlotPage(0); setSearchTerm(value); }}
                />
            </div>
            <div style={{ marginTop: 26 }}>
                <h1>{selectedPlot ? selectedPlot.name : ''} Plant Types</h1>
                <Divider />
                <Box sx={{ height: 540, marginTop: 2, width: "100%", justifyContent: "center", display: "flex" }}>
                    {selectedPlot && (
                        <TableComponent
                            dataSource={plantTypes}
                            columns={columns}
                            totalRecords={plantTypes.length}
                            fetchAllData={getAllPlotPlantTypes}
                            setPage={setPage}
                            setPageSize={setPageSize}
                        />
                    )}
                </Box>
            </div>
        </div>
    );
};
