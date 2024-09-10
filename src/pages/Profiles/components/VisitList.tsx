import { FC, useEffect, useState } from "react";
import { Visit } from "../../../types/visits";
import { Box, FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import { Search } from "@mui/icons-material";
import VisitCard from "./VisitCard";

interface VisitListProps {
    list: Visit[]
}

const VisitList: FC<VisitListProps> = ({ list }) => {

    const [searchStr, setSearchStr] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [visits, setVisits] = useState<Visit[]>([])
    const [filteredVisits, setFilteredVisits] = useState<Visit[]>([])

    useEffect(() => {
        setVisits(list);
        setFilteredVisits(list);
    }, [list])

    useEffect(() => {
        let result: Visit[] | null = null;
        if (date) {
            result = visits.filter(visit => new Date(visit.visit_date ?? visit.created_at) >= new Date(date))
        }

        if (searchStr) {
            result = visits.filter(visits => {
                return visits.visit_name?.toLowerCase().includes(searchStr.toLowerCase()) || visits.visit_type.toLowerCase().includes(searchStr.toLowerCase())
            })
        }

        if (result !== null) {
            setFilteredVisits(result);
        } else {
            setFilteredVisits(visits);
        }

    }, [searchStr, date])

    const handleVisitCardClick = (visitsId: number) => {
        const { hostname, host } = window.location;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            window.open("http://" + host + "/visit/" + visitsId);
        } else {
            window.open("https://" + hostname + "/visit/" + visitsId);
        }
    }

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 1,
                marginRight: 1
            }}>
                <FormControl style={{ marginRight: 10, width: '100%', color: 'black' }} variant="outlined" >
                    <OutlinedInput
                        placeholder="Search by visits name/email/phone..."
                        onChange={(e) => { setSearchStr(e.target.value) }}
                        startAdornment={<InputAdornment position="start"><Search /></InputAdornment>}
                        size="small"
                    />
                </FormControl>
                <FormControl style={{ width: '30%' }} variant="outlined" >
                    <OutlinedInput
                        placeholder="Visited After..."
                        onChange={(e) => { setDate(e.target.value) }}
                        size="small"
                        type="date"
                    />
                </FormControl>
            </Box>
            <Box sx={{ justifyContent: 'center', alignItems: 'center', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
                {
                    filteredVisits.map((visit, index) => (
                        <Box key={index} style={{ width: '100%', marginBottom: 10 }} onClick={() => handleVisitCardClick(visit.id)}>
                            <VisitCard
                                visitName={visit.visit_name || ''}
                                visitDate={visit.visit_date as any || ''}
                                numberOfPeople={visit.user_count}
                                numberOfImages={visit.visit_images.length}
                            />
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
};

export default VisitList;