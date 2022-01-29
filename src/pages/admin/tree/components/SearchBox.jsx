import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSetRecoilState } from 'recoil';

import Axios from '../../../../api/local';
import { searchTreeData } from '../../../../store/adminAtoms';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    // height: '90%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(2.5, 1, 1, 1),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '16ch',
            '&:focus': {
                width: '22ch',
            },
        },
    },
}));

export const SearchBox = ({ setLoading }) => {

    const [key, setKey] = useState("");
    const setTreeData = useSetRecoilState(searchTreeData);

    const gettree = async () => {
        setLoading(true);
        try {
            let res = await Axios.get(`/trees/gettree/?sapling_id=${key}`);
            setTreeData(res.data);
            setLoading(false);
            toast.success("Tree found!")
        } catch (error) {
            setLoading(false);
            if (error.response.status === 404) {
                toast.error("Sapling ID doesn't exist!")
            } else {
                toast.error(error)
            }
        }
    }

    const handleKeyPress = (key) => {
        if (key === 'Enter') {
            gettree();
        }
    }
    return (
        <Search>
            <ToastContainer />
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Sapling ID"
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e.key)}
            />
        </Search>
    )
}