import { useState } from "react"

import { InputBar } from "./InputBar/InputBar";
import { Button } from "../../stories/Button/Button";
import { Chip } from "../../stories/ButtonChips/Chip";
import { UserList } from "../../stories/UserList/UserList";
import { OrgList } from "../../stories/OrgList/OrgList";
import { EventList } from "../../stories/EventList/EventList";
import { TreeList } from "../../stories/TreeList/TreeList";
import bg from "../../assets/bg.png"
import './search.scss'

export const Search = () => {
    let [key, setKey] = useState("");
    let [results, setResults] = useState(true);
    let [type, setType] = useState("All");

    let intialChipState = {
        "All": "secondary",
        "Individual": "secondary",
        "Tree": "secondary",
        "Event": "secondary",
        "Organization": "secondary"
    }
    let [searchChips, setSearchChips] = useState(intialChipState);
    let [selectedChips, setSelectedChips] = useState("")

    const onChipSelect = (value) => {
        setSearchChips(prevState => ({
            ...intialChipState,
            [value]: "primary"
        }));

        setSelectedChips(value);
    }

    const onUserClick = (value) => {
        console.log(value);
    }

    const handleData = (data, key) => {
        setKey(key);
        setResults(data);
        console.log(results);
    }
    
    if (!results){
        return(
            <div className="s-box">
                <img alt="bg" src={bg} className="s-img"/>
                <div className="s-bg">
                    <div className="s-input">
                        <div className="s-info">
                            <h1 className="s-header">100+</h1>
                            <p className="s-desc">People employed from local community</p>
                        </div>
                        <div>
                            <div className="s-input-box">
                                <InputBar type={type} setData={handleData}/>
                            </div>
                            <p className="s-sep">OR</p>
                            <div className="s-s-btn">
                                <Button size={"large"} label={"See all the people"}/>
                                <Button size={"large"} label={"See all the events"}/>
                                <Button size={"large"} label={"See all the organization"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="s-box">
                <img alt="bg" src={bg} className="s-img" style={{"height":"40vh"}}/>
                <div className="s-bg s-scroll"
                    style={{
                        "background": "linear-gradient(rgba(31, 54, 37, 0) 5%,rgba(31, 54, 37, 0.636721) 15%, #1F3625 40%, #e5e5e5 40%)"}}>
                    <div className="s-input s-scroll">
                        <div className="s-info">
                            <h1 className="s-header">100+</h1>
                            <p className="s-desc">People employed from local community</p>
                        </div>
                        <div className="s-input-box">
                            <InputBar type={type} setData={handleData}/>
                            <div className="s-search-info">
                                <div className="s-searchby">
                                    Search by:
                                </div>
                                <div className="s-search-filter">
                                    {
                                        Object.keys(searchChips).map(key => 
                                            <Chip label={key} mode={searchChips[key]} handleClick={onChipSelect}/>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="s-results">
                            <div className="s-results-for">
                                Search Results for: {key}
                            </div>
                            {
                                (selectedChips==="Individual" || selectedChips==="All") && 
                                <div>
                                    <div className="s-results-ind">
                                        Individual Found
                                    </div>
                                    <UserList handleClick={onUserClick}/>
                                </div>
                            }
                            {
                                (selectedChips==="Organization" || selectedChips==="All") && 
                                <div>
                                    <div className="s-results-ind">
                                        Organization Found
                                    </div>
                                    <OrgList/>
                                </div>
                            }
                            {
                                (selectedChips==="Event" || selectedChips==="All") && 
                                <div>
                                    <div className="s-results-ind">
                                        Events Found
                                    </div>
                                    <EventList/>
                                </div>
                            }
                            {
                                (selectedChips==="Tree" || selectedChips==="All") && 
                                <div>
                                    <div className="s-results-ind">
                                        Trees Found
                                    </div>
                                    <TreeList/>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}