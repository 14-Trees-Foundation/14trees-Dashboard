import { Table } from "antd"
import { FC, useEffect, useState } from "react"
import ApiClient from "../../../api/apiClient/apiClient"
import { Box, Button, Typography } from "@mui/material"
import DistrictStats from "./DistrictStats"
import TalukaStats from "./TalukaStats"
import VillageStats from "./VillageStats"
import SiteStats from "./SiteStats"
import MultipleSelect from "../../../components/MultiSelect"
import TagStats from "./TagStats"
import PlotStats from "./PlotStats"
import { GridFilterItem } from "@mui/x-data-grid"
import './inventory.css'
import CorporateStats from "./CorporateStats"

interface SiteLocation {
    district: string;
    taluka: string;
    village: string;
}

const getSiteServiceTypeEnum = (serviceType: string): string | null => {
    switch (serviceType) {
        case 'Full Maintenance':
            return 'FULL_MAINTENANCE';
        case 'Plantation Only':
            return 'PLANTATION_ONLY';
        case 'Distribution Only':
            return 'DISTRIBUTION_ONLY';
        default:
            return null;
    }
}

const InventoryStats: FC = () => {

    const [aggregatedData, setAggregatedData] = useState<any[]>([]);

    const [districts, setDistricts] = useState<SiteLocation[]>([]);
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
    const [selectedTalukas, setSelectedTalukas] = useState<string[]>([]);
    const [selectedVillages, setSelectedVillages] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);

    const [filteredTalukas, setFilteredTalukas] = useState<string[]>([]);
    const [filteredVillages, setFilteredVillages] = useState<string[]>([]);

    useEffect(() => {

        if (selectedDistricts.length === 0) {
            setFilteredTalukas([]);
            setFilteredVillages([]);
        } else {
            if (selectedVillages.length !== 0) setFilteredVillages(selectedVillages);
            else setFilteredVillages(getVillages(districts, selectedDistricts, selectedTalukas));

            if (selectedTalukas.length !== 0) setFilteredTalukas(selectedTalukas);
            else setFilteredTalukas(getTalukas(districts, selectedDistricts));
        }

    }, [districts, selectedDistricts, selectedTalukas, selectedVillages])

    const getTreesCountForCategories = async () => {
        const apiClient = new ApiClient();

        const filters: GridFilterItem[] = []
        if (selectedCategories.length > 0) {
            const categories: (string | null)[] = []
            selectedCategories.forEach((item) => {
                if (item !== 'Unknown') categories.push(item)
                else categories.push(null)
            })
            filters.push({ columnField: 'category', value: categories, operatorValue: 'isAnyOf' })
        }
        if (selectedServiceTypes.length > 0) {
            const serviceTypes: (string | null)[] = selectedServiceTypes.map((item) => getSiteServiceTypeEnum(item))
            filters.push({ columnField: 'maintenance_type', value: serviceTypes, operatorValue: 'isAnyOf' })
        }
        if (selectedVillages.length > 0 || filteredVillages.length > 0) {
            filters.push({ columnField: 'village', value: selectedVillages.length > 0 ? selectedVillages : filteredVillages, operatorValue: 'isAnyOf' })
        }

        const stats = await apiClient.getTreesCountForPlotCategories(filters);

        const overall = {
            category: 'Overall',
            total: 0,
            booked: 0,
            assigned: 0,
            available: 0
        }

        for (const item of stats.results) {
            overall.total += parseInt(item.total || '0')
            overall.booked += parseInt(item.booked || '0')
            overall.assigned += parseInt(item.assigned || '0')
            overall.available += parseInt(item.available || '0')
        }

        const finalList: any[] = [];
        const item = stats.results.find((item: any) => item.category === 'Public');
        if (item) finalList.push(item)

        const item2 = stats.results.find((item: any) => item.category === 'Foundation');
        if (item2) finalList.push(item2)

        const item3 = stats.results.find((item: any) => item.category === null);
        if (item3) finalList.push(item3)

        setAggregatedData([...finalList, overall]);
    }

    const getDistricts = async () => {
        const apiClient = new ApiClient();
        const stats = await apiClient.getDistricts();
        setDistricts(stats);
    }

    useEffect(() => {
        getTreesCountForCategories();
    }, [filteredVillages, selectedVillages, selectedCategories, selectedServiceTypes])

    useEffect(() => {
        getDistricts();
    }, [])

    const commonDataColumn = [
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            align: 'right',
        },
        {
            title: "Booked",
            dataIndex: "booked",
            key: "booked",
            align: 'right',
        },
        {
            title: "Assigned",
            dataIndex: "assigned",
            key: "assigned",
            align: 'right',
        },
        {
            title: "Available",
            dataIndex: "available",
            key: "available",
            align: 'right',
        },
    ]

    const aggregatedDataColumn: any = [
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (value: any) => value ? value : 'Unknown'
        },
        ...commonDataColumn
    ]

    const getTalukas = (districts: SiteLocation[], selectedDistricts: string[]) => {
        return districts
            .filter((item) => selectedDistricts.includes(item.district))
            .map((item) => item.taluka)
            .filter((value, index, self) => value !== '' && self.indexOf(value) === index)
    }

    const getVillages = (districts: SiteLocation[], selectedDistricts: string[], selectedTalukas: string[]) => {

        let filteredDistricts = districts.filter((item) => selectedDistricts.includes(item.district))
        if (selectedTalukas.length !== 0) filteredDistricts = filteredDistricts.filter((item) => selectedTalukas.includes(item.taluka))
        return filteredDistricts
            .map((item) => item.village)
            .filter((value, index, self) => value !== '' && self.indexOf(value) === index)
    }

    const handleFilterReset = () => {
        setSelectedDistricts([]);
        setSelectedTalukas([]);
        setSelectedVillages([]);
        setSelectedCategories([]);
        setSelectedServiceTypes([]);
    }

    return (
        <div>

            <Box style={{
                zIndex: 1,
                paddingBottom: 10,
                marginBottom: '10px',

            }}>
                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '10px',
                        marginBottom: '10px',
                    }}
                >
                    <Box style={{ width: '19%' }}>
                        <Typography variant='subtitle2'>District</Typography>
                        <MultipleSelect
                            options={districts.map((item) => item.district).filter((value, index, self) => value !== '' && self.indexOf(value) === index)}
                            onSelectionChange={(value: string[]) => { setSelectedDistricts(value) }}
                            selected={selectedDistricts}
                            label="Districts"
                        />
                    </Box>

                    <Box style={{ width: '19%' }}>
                        <Typography variant='subtitle2'>Taluka</Typography>
                        <MultipleSelect
                            options={getTalukas(districts, selectedDistricts)}
                            onSelectionChange={(value: string[]) => { setSelectedTalukas(value) }}
                            selected={getTalukas(districts, selectedDistricts).filter(value => selectedTalukas.includes(value))}
                            label="Talukas"
                        />
                    </Box>

                    <Box style={{ width: '19%' }}>
                        <Typography variant='subtitle2'>Village</Typography>
                        <MultipleSelect
                            options={getVillages(districts, selectedDistricts, selectedTalukas)}
                            onSelectionChange={(value: string[]) => { setSelectedVillages(value) }}
                            selected={getVillages(districts, selectedDistricts, selectedTalukas).filter(value => selectedVillages.includes(value))}
                            label="Villages"
                        />
                    </Box>

                    <Box style={{ width: '19%' }}>
                        <Typography variant='subtitle2'>Category</Typography>
                        <MultipleSelect
                            options={['Public', 'Foundation', 'Unknown']}
                            onSelectionChange={(value: string[]) => { setSelectedCategories(value) }}
                            selected={selectedCategories}
                            label="Category"
                        />
                    </Box>

                    <Box style={{ width: '19%' }}>
                        <Typography variant='subtitle2'>Service Type</Typography>
                        <MultipleSelect
                            options={['Full Maintenance', 'Distribution Only', 'Plantation Only', 'Unknown']}
                            onSelectionChange={(value: string[]) => { setSelectedServiceTypes(value) }}
                            selected={selectedServiceTypes}
                            label="Service Type"
                        />
                    </Box>
                </Box>
                <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" size="small" onClick={handleFilterReset}>Reset FIlters</Button>
                </Box>
            </Box>

            <Box
                style={{
                    height: '65vh',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none', // For Firefox
                    '&::-webkit-scrollbar': { display: 'none' } // For Chrome, Safari
                }}
            >
                <Box>
                    <Typography variant="h6">Overall site stats</Typography>
                    <Table
                        rowClassName={(record, index) => !record.category ? 'pending-item' : ''}
                        columns={aggregatedDataColumn}
                        dataSource={aggregatedData}
                    />
                </Box>

                <DistrictStats
                    districts={selectedDistricts}
                    categories={selectedCategories.map((item) => item !== 'Unknown' ? item : null)}
                    serviceTypes={selectedServiceTypes.map((item) => getSiteServiceTypeEnum(item))}
                />
                <TalukaStats
                    talukas={filteredTalukas}
                    categories={selectedCategories.map((item) => item !== 'Unknown' ? item : null)}
                    serviceTypes={selectedServiceTypes.map((item) => getSiteServiceTypeEnum(item))}
                />
                <VillageStats
                    villages={filteredVillages}
                    categories={selectedCategories.map((item) => item !== 'Unknown' ? item : null)}
                    serviceTypes={selectedServiceTypes.map((item) => getSiteServiceTypeEnum(item))}
                />
                <TagStats
                    villages={filteredVillages}
                    categories={selectedCategories.map((item) => item !== 'Unknown' ? item : null)}
                    serviceTypes={selectedServiceTypes.map((item) => getSiteServiceTypeEnum(item))}
                />
                <SiteStats
                    villages={filteredVillages}
                    categories={selectedCategories.map((item) => item !== 'Unknown' ? item : null)}
                    serviceTypes={selectedServiceTypes.map((item) => getSiteServiceTypeEnum(item))}
                />
                <PlotStats />
                <CorporateStats />
            </Box>
        </div>
    )
}

export default InventoryStats;