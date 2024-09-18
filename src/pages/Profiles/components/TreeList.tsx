import { FC, useEffect, useState } from "react";
import { Tree } from "../../../types/tree";
import { Box, FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import { Search } from "@mui/icons-material";
import TreeCard from "./TreeCard";

interface TreeListProps {
    list: Tree[]
}

const TreeList: FC<TreeListProps> = ({ list }) => {

    const [searchStr, setSearchStr] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [trees, setTrees] = useState<Tree[]>(list)
    const [filteredTrees, setFilteredTrees] = useState<Tree[]>(list)

    useEffect(() => {
        setTrees(list);
        setFilteredTrees(list);
    }, [list])

    useEffect(() => {
        let result: Tree[] | null = null;
        if (date) {
            result = trees.filter(tree => new Date(tree.created_at) >= new Date(date))
        }

        if (searchStr) {
            result = (result ?? trees).filter(tree => {
                return tree.sapling_id.toLowerCase().includes(searchStr.toLowerCase()) || tree.plant_type?.toLowerCase().includes(searchStr.toLowerCase())
            })
        }

        if (result !== null) {
            setFilteredTrees(result);
        } else {
            setFilteredTrees(trees);
        }

    }, [searchStr, date])

    const handleTreeCardClick = (saplingId: string) => {
        const { hostname, host } = window.location;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            window.open("http://" + host + "/tree/" + saplingId);
        } else {
            window.open("https://" + hostname + "/tree/" + saplingId);
        }
    }

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 1,
                marginRight: 1
            }}>
                <FormControl style={{ marginRight: 10, width: '70%', color: 'black' }} variant="outlined" >
                    <OutlinedInput
                        placeholder="Search by sapling or plant type..."
                        onChange={(e) => { setSearchStr(e.target.value) }}
                        startAdornment={<InputAdornment position="start"><Search /></InputAdornment>}
                        size="small"
                    />
                </FormControl>
                <FormControl style={{ width: '30%' }} variant="outlined" >
                    <OutlinedInput
                        placeholder="Planted After..."
                        onChange={(e) => { setDate(e.target.value) }}
                        size="small"
                        type="date"
                    />
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
                {
                    filteredTrees.map((tree, index) => (
                        <Box key={index} style={{ flexGrow: 1, marginRight: 10, marginBottom: 10 }} onClick={() => handleTreeCardClick(tree.sapling_id)}>
                            <TreeCard
                                imageUrl={tree.image}
                                title={tree.sapling_id}
                                subtitle={tree.plant_type || ''}
                                date={(tree.created_at as any).split('T')[0]}
                            />
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
};

export default TreeList;