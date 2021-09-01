import { useState } from "react"
import api from "../../../api/local";
import { SearchBar } from "../../../stories/SearchBar/SearchBar"

export const InputBar = ({ type, setData }) => {

    let [key, setKey] = useState("");
    let [searchSize, setSearchSize] = useState(10);
    let [currPage, setCurrPage] = useState(1);

    const setValue = (value) => {
        setKey(value);
    }

    const fetchData = async () => {
        let params = {
            term : key,
            size: searchSize,
            index: currPage
        }
        const res = await api.get('/api/v1/search/searchall', {
            params : params
        });

        if(res.status === 200) {
            setData(res, key);
        } else {
            console.log("Fetch error")
        }
    }
    const handleSubmit = () => {
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