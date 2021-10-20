import { useState } from "react";
import api from "../../../api/local";
import { SearchBar } from "../../../stories/SearchBar/SearchBar";
import { useSetRecoilState, useRecoilState } from 'recoil';
import { searchResults, searchKey, searchError } from '../../../store/atoms';
import local from "../../../api/local";

export const InputBar = ({ type }) => {

    let [key, setKey] = useRecoilState(searchKey);
    let [localkey, setLocalKey] = useState("");
    let [searchSize, setSearchSize] = useState(10);
    let [currPage, setCurrPage] = useState(1);
    const setSearchResult = useSetRecoilState(searchResults);
    const setSearchError = useSetRecoilState(searchError);

    const setValue = (value) => {
        setKey(value);
    }

    const fetchData = async () => {
        let params = {
            key : key,
            size: searchSize,
            index: currPage
        }
        const res = await api.get('/search/', {
            params : params
        });

        if(res.data.total_results === 0){
            setSearchError(true)
        }

        console.log(res.data)

        if(res.status === 200) {
            setSearchResult(res.data);
        } else {
            console.log("Fetch error")
        }
    }
    const handleSubmit = async () => {
        fetchData();
    }
    return(
        <div>
            <SearchBar
                value={key}
                onClick={setValue}
                onSubmit={handleSubmit}/>
        </div>
    )
}