import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as siteActionCreators from "../../../redux/actions/siteActions";
import { Site } from "../../../types/site";
import { Box, Checkbox, Chip, Divider, FormControlLabel, Typography } from "@mui/material";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import { Plot } from "../../../types/plot";
import ApiClient from "../../../api/apiClient/apiClient";
import SitesMap from "./SiteMap";
import { Table, TableColumnType } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import './inventory.css'
import InventoryStats from "./InventoryStats";

const SiteInventory: FC = () => {

    const [sitePage, setSitePage] = useState(0);
    const [siteNameInput, setSiteNameInput] = useState("");
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);
    const [plots, setPlots] = useState<Plot[]>([]);
    const [selectedPlots, setSelectedPlots] = useState<number[]>([]);
    const [includeDeadLostTrees, setIncludeDeadLostTrees] = useState(false);
    const [showAvailablePlots, setShowAvailablePlots] = useState(false);
    const dispatch = useAppDispatch();
    const { getSites } = bindActionCreators(siteActionCreators, dispatch);

    useEffect(() => {
        getSitesData();
    }, [sitePage, siteNameInput]);

    useEffect(() => {
        if (selectedSite) {
            getPlotsData();
        }
    }, [selectedSite]);

    const getPlotsData = async () => {
        if (selectedSite) {
            const apiClient = new ApiClient();
            const response = await apiClient.getPlots(0, -1, [{ columnField: "site_id", value: selectedSite.id, operatorValue: "equals" }]);
            response.results.forEach(plot => plot.key = plot.id);
            setPlots(response.results);
            setSelectedPlots(response.results.map(plot => plot.id));
        }
    }

    const getSitesData = async () => {
        const siteNameFilter = {
            columnField: "name_english",
            value: siteNameInput,
            operatorValue: "contains",
        };

        getSites(sitePage * 10, 10, [siteNameFilter]);
    };

    let sitesList: Site[] = [];
    const siteData = useAppSelector((state) => state.sitesData);

    if (siteData) {
        sitesList = Object.values(siteData.sites);
        sitesList = sitesList.sort((a, b) => {
            return b.id - a.id;
        });
    }

    const calculateSum = (nums: (number | string | undefined)[]) => {
        let sum = 0;
        nums.forEach(num => sum += num ? Number(num) : 0);
        return sum;
    }

    const getAccessibilityStatus = (status: string) => {
        switch (status) {
            case "accessible":
                return "Accessible";
            case "inaccessible":
                return "Inaccessible";
            case "moderately_accessible":
                return "Moderately Accessible";
            default:
                return "Unknown";
        }
    }

    let rowSelection: TableRowSelection<Plot> = {
        type: 'checkbox',
        selectedRowKeys: selectedPlots,
        onChange: (selectedRowKeys) => {
            setSelectedPlots(selectedRowKeys as number[]);
        },
        getCheckboxProps: (record) => {
            return { name: record.id.toString() }
        },
    }

    const columns: TableColumnType<Plot> = [
        {
            title: 'Plot Details',
            children: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    width: 400,
                },
                {
                    title: 'Tags',
                    dataIndex: 'tags',
                    key: 'tags',
                    width: 400,
                    render: (tags: string[]) =>
                        tags && tags.length > 0
                        ? (<div>
                            {tags.map((tag) => (
                                <Chip label={tag} key={tag} style={{ margin: 2 }}/>
                            ))}
                        </div>)
                        : '',
                },
                {
                    title: 'Accessibility',
                    dataIndex: 'accessibility_status',
                    key: 'accessibility_status',
                    width: 300,
                    render: getAccessibilityStatus,
                    filters: [
                        {
                            text: 'Accessible',
                            value: 'accessible',
                        },
                        {
                            text: 'Inaccessible',
                            value: 'inaccessible',
                        },
                        {
                            text: 'Moderately Accessible',
                            value: 'moderately_accessible',
                        },
                        {
                            text: 'Unknown',
                            value: 'unknown',
                        },
                    ],
                    onFilter: (value: string, record: Plot) => (record.accessibility_status === value || (record.accessibility_status === null && value === 'unknown')),
                    sorter: {
                        compare: (a: Plot, b: Plot) => a.accessibility_status?.localeCompare(b.accessibility_status || ''),
                        multiple: 2,
                    },
                },
                {
                    title: 'Area in acres',
                    dataIndex: 'acres_area',
                    key: 'acres_area',
                    width: 150,
                },
                {
                    title: 'Capacity',
                    dataIndex: 'capacity',
                    key: 'capacity',
                    width: 150,
                    align: 'right',
                    render: (value: any, plot: Plot, index: number) => plot.acres_area ? Math.floor(plot.acres_area * 300) : 'Unknown',
                    sorter: {
                        compare: (a: Plot, b: Plot) => (a.acres_area || 0) - (b.acres_area || 0),
                        multiple: 1
                    }
                }
            ]
        },
        {
            title: 'Tree Details',
            children: [
                {
                    title: 'Total',
                    dataIndex: 'total',
                    key: 'total',
                    width: 150,
                    align: 'right',
                    sorter: {
                        compare: (a: Plot, b: Plot) => (a.total || 0) - (b.total || 0),
                        multiple: 1,
                    }
                },
                {
                    title: 'Booked',
                    dataIndex: 'booked',
                    key: 'booked',
                    width: 150,
                    align: 'right',
                    sorter: {
                        compare: (a: Plot, b: Plot) => (a.booked || 0) - (b.booked || 0),
                        multiple: 1,
                    }
                },
                {
                    title: 'Assigned',
                    dataIndex: 'assigned',
                    key: 'assigned',
                    width: 150,
                    align: 'right',
                    sorter: {
                        compare: (a: Plot, b: Plot) => (a.assigned || 0) - (b.assigned || 0),
                        multiple: 1
                    },
                },
                {
                    title: 'Available',
                    dataIndex: 'available',
                    key: 'available',
                    width: 150,
                    align: 'right',
                    sorter: {
                        compare: (a: Plot, b: Plot) => (a.available || 0) - (b.available || 0),
                        multiple: 1,
                    }
                }
            ]
        },
    ]

    const getRowClassName = (plot: Plot) => {
        switch (plot.accessibility_status) {
            case 'accessible':
                return 'accessible-plot';
            case 'inaccessible':
                return 'inaccessible-plot';
            case 'moderately_accessible':
                return 'moderately-accessible-plot';
            default:
                return '';
        }
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ marginBottom: 1 }}>Inventory Management</Typography>
            <Divider sx={{ backgroundColor: "black", marginBottom: 3 }} />
            <InventoryStats />
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
                size="small"
                value={selectedSite}
            />

            {(selectedSite && selectedSite.kml_file_link) && <SitesMap plots={plots} />}

            {selectedSite && <Box>
                <Table
                    style={{ marginTop: 20 }}
                    columns={columns}
                    dataSource={showAvailablePlots ? plots.filter((plot) => plot.available && plot.available > 0) : plots}
                    rowClassName={getRowClassName}
                    summary={() => (
                        <Table.Summary fixed='bottom'>
                            <Table.Summary.Row>
                                <Table.Summary.Cell align="right" index={4} colSpan={5}>
                                    <strong>Summary</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={9} colSpan={5}></Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                                <Table.Summary.Cell align="right" index={4} colSpan={5}>
                                    <strong>Accessible</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={5} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "accessible").map((plot) => plot.acres_area ? Math.floor(plot.acres_area * 300) : 0))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={6} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "accessible").map((plot) => plot.total))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={7} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "accessible").map((plot) => plot.booked))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={8} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "accessible").map((plot) => plot.assigned))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={9} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "accessible").map((plot) => plot.available))}</Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row style={{ backgroundColor: 'rgba(255, 156, 156, 0.2)' }}>
                                <Table.Summary.Cell align="right" index={4} colSpan={5}>
                                    <strong>Inaccessible</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={5} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "inaccessible").map((plot) => plot.acres_area ? Math.floor(plot.acres_area * 300) : 0))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={6} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "inaccessible").map((plot) => plot.total))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={7} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "inaccessible").map((plot) => plot.booked))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={8} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "inaccessible").map((plot) => plot.assigned))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={9} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "inaccessible").map((plot) => plot.available))}</Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row style={{ backgroundColor: 'rgba(255, 219, 153, 0.2)' }}>
                                <Table.Summary.Cell align="right" index={4} colSpan={5}>
                                    <strong>Moderately Accessible</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={5} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "moderately_accessible").map((plot) => plot.acres_area ? Math.floor(plot.acres_area * 300) : 0))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={6} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "moderately_accessible").map((plot) => plot.total))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={7} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "moderately_accessible").map((plot) => plot.booked))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={8} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "moderately_accessible").map((plot) => plot.assigned))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={9} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id) && plot.accessibility_status === "moderately_accessible").map((plot) => plot.available))}</Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                                <Table.Summary.Cell align="right" index={4} colSpan={5}>
                                    <strong>Total</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={5} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id)).map((plot) => plot.acres_area ? Math.floor(plot.acres_area * 300) : 0))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={6} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id)).map((plot) => plot.total))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={7} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id)).map((plot) => plot.booked))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={8} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id)).map((plot) => plot.assigned))}</Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={9} colSpan={1}>{calculateSum(plots.filter((plot) => selectedPlots.includes(plot.id)).map((plot) => plot.available))}</Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                    rowSelection={rowSelection}
                    footer={() =>
                        <div
                            style={{
                                display: "flex",
                                alignItems: 'center',
                                justifyContent: "flex-end",
                            }}
                        >
                            <FormControlLabel
                                control={<Checkbox checked={showAvailablePlots} onChange={() => setShowAvailablePlots(!showAvailablePlots)} />}
                                label="Show only available plots"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={includeDeadLostTrees} onChange={() => setIncludeDeadLostTrees(!includeDeadLostTrees)} />}
                                label="Include Dead/Lost Trees"
                            />
                        </div>
                    }
                />
            </Box>}
        </Box>
    )
}

export default SiteInventory;