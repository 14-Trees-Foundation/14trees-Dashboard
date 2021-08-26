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
    let [results, setResults] = useState(true);
    let [key, setKey] = useState("All");

    const onUserClick = (value) => {
        console.log(value);
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
                                <InputBar/>
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
                            <InputBar/>
                            <div className="s-search-info">
                                <div className="s-searchby">
                                    Search by:
                                </div>
                                <div className="s-search-filter"> 
                                    <Chip label={"All"} mode={"secondary"}/>
                                    <Chip label={"Individual"} mode={"secondary"}/>
                                    <Chip label={"Event"} mode={"secondary"}/>
                                    <Chip label={"Organization"} mode={"secondary"}/>
                                    <Chip label={"Tree"} mode={"secondary"}/>
                                </div>
                            </div>
                        </div>
                        <div className="s-results">
                            <div className="s-results-for">
                                Search Results for: 
                            </div>
                            <div className="s-results-ind">
                                Individual Found
                            </div>
                            <UserList handleClick={onUserClick}/>
                            <div className="s-results-ind">
                                Organisation Found
                            </div>
                            <OrgList/>
                            <div className="s-results-ind">
                                Events Found
                            </div>
                            <EventList/>
                            <div className="s-results-ind">
                                Trees Found
                            </div>
                            <TreeList/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}