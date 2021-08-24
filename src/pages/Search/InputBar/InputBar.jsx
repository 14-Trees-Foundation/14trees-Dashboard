import { useState } from "react"
import { SearchBar } from "../../../stories/SearchBar/SearchBar"

export const InputBar = () => {

    let [key, setKey] = useState("");
    const setValue = (value) => {
        setKey(value);
    }
    const handleSubmit = () => {
        console.log(key);
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