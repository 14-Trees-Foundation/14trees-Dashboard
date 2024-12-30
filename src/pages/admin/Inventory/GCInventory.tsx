import { FC, useEffect, useState } from "react"
import { Box, Button, Divider, Typography } from "@mui/material";
import './inventory.css'
import ApiClient from "../../../api/apiClient/apiClient"
import SiteStats from "./SiteStats"
import MultipleSelect from "../../../components/MultiSelect"
import TagStats from "./TagStats"
import './inventory.css'
import PlantTypeStats from "./PlantTypeStats"
import PlantTypePlotStats from "./PlantTypePlotStats";

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
        case 'Waiting':
            return 'WAITING';
        case 'Cancelled':
            return 'CANCELLED';
        case 'TBD':
            return 'TBD';
        default:
            return null;
    }
}

const GCInventory: FC = () => {

    const [districts, setDistricts] = useState<SiteLocation[]>([]);
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
    const [selectedTalukas, setSelectedTalukas] = useState<string[]>([]);
    const [selectedVillages, setSelectedVillages] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
    const [selectedHabit, setSelectedHabit] = useState<string[]>([]);
    const [selectedLandType, setSelectedLandType] = useState<string[]>([]);

    const getDistricts = async () => {
        const apiClient = new ApiClient();
        const stats = await apiClient.getDistricts();
        setDistricts(stats);
    }

    useEffect(() => {
        getDistricts();
    }, [])

    const getTalukas = (districts: SiteLocation[], selectedDistricts: string[]) => {
        let filteredDistricts = districts;
        if (selectedDistricts.length !== 0) {
            filteredDistricts = filteredDistricts.filter((item) => selectedDistricts.includes(item.district))
        }

        return filteredDistricts
            .map((item) => item.taluka)
            .filter((value, index, self) => value !== '' && self.indexOf(value) === index)
    }

    const getVillages = (districts: SiteLocation[], selectedDistricts: string[], selectedTalukas: string[]) => {

        let filteredDistricts = districts;
        if (selectedDistricts.length !== 0) {
            filteredDistricts = filteredDistricts.filter((item) => selectedDistricts.includes(item.district));
        }
        if (selectedTalukas.length !== 0) {
            filteredDistricts = filteredDistricts.filter((item) => selectedTalukas.includes(item.taluka));
        }

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
        setSelectedLandType([]);
        setSelectedHabit([]);
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ marginBottom: 1 }}>Gifting Inventory</Typography>
            <Divider sx={{ backgroundColor: "black", marginBottom: 3 }} />

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
                    <Box style={{ width: '32%' }}>
                        <Typography variant='subtitle2'>District</Typography>
                        <MultipleSelect
                            options={districts.map((item) => item.district).filter((value, index, self) => value !== '' && self.indexOf(value) === index)}
                            onSelectionChange={(value: string[]) => { setSelectedDistricts(value) }}
                            selected={selectedDistricts}
                            label="Districts"
                        />
                    </Box>

                    <Box style={{ width: '32%' }}>
                        <Typography variant='subtitle2'>Taluka</Typography>
                        <MultipleSelect
                            options={getTalukas(districts, selectedDistricts)}
                            onSelectionChange={(value: string[]) => { setSelectedTalukas(value) }}
                            selected={getTalukas(districts, selectedDistricts).filter(value => selectedTalukas.includes(value))}
                            label="Talukas"
                        />
                    </Box>

                    <Box style={{ width: '32%' }}>
                        <Typography variant='subtitle2'>Village</Typography>
                        <MultipleSelect
                            options={getVillages(districts, selectedDistricts, selectedTalukas)}
                            onSelectionChange={(value: string[]) => { setSelectedVillages(value) }}
                            selected={getVillages(districts, selectedDistricts, selectedTalukas).filter(value => selectedVillages.includes(value))}
                            label="Villages"
                        />
                    </Box>
                </Box>
                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '10px',
                        marginBottom: '10px',
                    }}
                >
                    <Box style={{ width: '24%' }}>
                        <Typography variant='subtitle2'>Plant Type Habitat</Typography>
                        <MultipleSelect
                            options={['Tree', 'Herb', 'Shrub', 'Climber']}
                            onSelectionChange={(value: string[]) => { setSelectedHabit(value) }}
                            selected={selectedHabit}
                            label="Habitats"
                        />
                    </Box>

                    <Box style={{ width: '24%' }}>
                        <Typography variant='subtitle2'>Site Land Type</Typography>
                        <MultipleSelect
                            options={["Foundation", "Cremation", "Farm", "Roadside", "Temple", "Premises", "Gairan", "Forest", "School"]}
                            onSelectionChange={(value: string[]) => { setSelectedLandType(value) }}
                            selected={selectedLandType}
                            label="Site Land Type"
                        />
                    </Box>

                    <Box style={{ width: '24%' }}>
                        <Typography variant='subtitle2'>Site Category</Typography>
                        <MultipleSelect
                            options={['Public', 'Foundation', 'Unknown']}
                            onSelectionChange={(value: string[]) => { setSelectedCategories(value) }}
                            selected={selectedCategories}
                            label="Select Category"
                        />
                    </Box>

                    <Box style={{ width: '24%' }}>
                        <Typography variant='subtitle2'>Site Service Type</Typography>
                        <MultipleSelect
                            options={['Full Maintenance', 'Distribution Only', 'Plantation Only', 'Waiting', 'Cancelled', 'TBD', 'Unknown']}
                            onSelectionChange={(value: string[]) => { setSelectedServiceTypes(value) }}
                            selected={selectedServiceTypes}
                            label="Select Service Type"
                        />
                    </Box>
                </Box>
                <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="success" onClick={handleFilterReset}>Reset FIlters</Button>
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
                <TagStats
                    habits={selectedHabit}
                    landTypes={selectedLandType}
                    talukas={selectedTalukas}
                    villages={selectedVillages}
                    districts={selectedDistricts}
                    categories={selectedCategories.map((item) => item !== 'Unknown' ? item : null)}
                    serviceTypes={selectedServiceTypes.map((item) => getSiteServiceTypeEnum(item))}
                />
                <SiteStats
                    habits={selectedHabit}
                    landTypes={selectedLandType}
                    talukas={selectedTalukas}
                    villages={selectedVillages}
                    districts={selectedDistricts}
                    categories={selectedCategories.map((item) => item !== 'Unknown' ? item : null)}
                    serviceTypes={selectedServiceTypes.map((item) => getSiteServiceTypeEnum(item))}
                />
                <PlantTypePlotStats 
                    habits={selectedHabit}
                    landTypes={selectedLandType}
                    talukas={selectedTalukas}
                    villages={selectedVillages}
                    districts={selectedDistricts}
                    categories={selectedCategories.map((item) => item !== 'Unknown' ? item : null)}
                    serviceTypes={selectedServiceTypes.map((item) => getSiteServiceTypeEnum(item))}
                />
                <PlantTypeStats 
                    habits={selectedHabit}
                    landTypes={selectedLandType}
                    talukas={selectedTalukas}
                    villages={selectedVillages}
                    districts={selectedDistricts}
                    categories={selectedCategories.map((item) => item !== 'Unknown' ? item : null)}
                    serviceTypes={selectedServiceTypes.map((item) => getSiteServiceTypeEnum(item))}
                />
            </Box>
        </Box>
    )
}

export default GCInventory;