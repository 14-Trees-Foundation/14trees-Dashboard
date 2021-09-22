import { useState, Fragment } from "react"

import { AppBar } from "../../stories/AppBar/AppBar";
import { InputBar } from "./InputBar/InputBar";
import { Chip } from "../../stories/Chip/Chip";
import { UserList } from "../../stories/UserList/UserList";
import { OrgList } from "../../stories/OrgList/OrgList";
import { EventList } from "../../stories/EventList/EventList";
import { TreeList } from "../../stories/TreeList/TreeList";
import bg from "../../assets/bg.png";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@mui/material/Button';

export const Search = () => {
    const classes = UseStyle();
    let [key, setKey] = useState("");
    let [results, setResults] = useState(false);
    let [type, setType] = useState("All");

    let intialChipState = {
        "All": "secondary",
        "Individual": "secondary",
        "Tree": "secondary",
        "Event": "secondary",
        "Organization": "secondary"
    }
    let [searchChips, setSearchChips] = useState(intialChipState);
    let [selectedChips, setSelectedChips] = useState("All")

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
    }

    if (!results) {
        return (
            <div className={classes.box}>
                <img alt="bg" src={bg} className={classes.bg} />
                <div className={classes.overlay}>
                    <AppBar />
                    <div className={classes.main}>
                        <div className={classes.header}>
                            <h1 style={{ fontSize: '70px', paddingInlineEnd: '20px', color: '#9BC53D', fontWeight: '550' }}>
                                100+
                            </h1>
                            <p style={{ wordWrap: 'inherit', fontWeight: '500', fontSize: '25px', color: '#ffffff' }}>
                                People employed from local community
                            </p>
                        </div>
                        <div>
                            <div className={classes.inputBox}>
                                <InputBar type={type} setData={handleData} />
                            </div>
                            <p className={classes.sep}>OR</p>
                            <div className={classes.btnGrp}>
                                <Button variant="contained" color="secondary" size="large" className="s-s-btn" onClick={() => onUserClick()}>See all the people</Button>
                                <Button variant="contained" color="secondary" size="large" className="s-s-btn">See all the events</Button>
                                <Button variant="contained" color="secondary" size="large" className="s-s-btn">See all the organization</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="s-box">
                <img alt="bg" src={bg} className="s-img" style={{ "height": "40vh" }} />
                <AppBar>
                    <div className="s-bg s-scroll"
                        style={{
                            "background": "linear-gradient(rgba(31, 54, 37, 0) 5%,rgba(31, 54, 37, 0.636721) 15%, #1F3625 40%, #e5e5e5 40%)"
                        }}>
                        <div className="s-input s-scroll">
                            <div className="s-info">
                                <h1 className="s-header">100+</h1>
                                <p className="s-desc">People employed from local community</p>
                            </div>
                            <div className="s-input-box">
                                <InputBar type={type} setData={handleData} />
                                <div className="s-search-info">
                                    <div className="s-searchby">
                                        Search by:
                                    </div>
                                    <div className="s-search-filter">
                                        {
                                            Object.keys(searchChips).map(key =>
                                                <Chip label={key} mode={searchChips[key]} handleClick={onChipSelect} />
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
                                    (selectedChips === "Individual" || selectedChips === "All") &&
                                    <div>
                                        <div className="s-results-ind">
                                            Individual Found
                                        </div>
                                        <UserList handleClick={onUserClick} />
                                    </div>
                                }
                                {
                                    (selectedChips === "Organization" || selectedChips === "All") &&
                                    <div>
                                        <div className="s-results-ind">
                                            Organization Found
                                        </div>
                                        <OrgList />
                                    </div>
                                }
                                {
                                    (selectedChips === "Event" || selectedChips === "All") &&
                                    <div>
                                        <div className="s-results-ind">
                                            Events Found
                                        </div>
                                        <EventList />
                                    </div>
                                }
                                {
                                    (selectedChips === "Tree" || selectedChips === "All") &&
                                    <div>
                                        <div className="s-results-ind">
                                            Trees Found
                                        </div>
                                        <TreeList />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </AppBar>
            </div>
        )
    }
}

const UseStyle = makeStyles((theme) => ({
    box: {
        width: '100%',
        height: '100vh',
        position: 'relative'
    },
    bg: {
        width: '100%',
        height: '100vh',
        objectFit: 'cover',
    },
    overlay: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(358.58deg, #1F3625 37.04%, rgba(31, 54, 37, 0.636721) 104.2%, rgba(31, 54, 37, 0) 140.95%)',
    },
    main: {
        width: '65vw',
        paddingLeft: '18vw',
        paddingTop: '10vh',
        height: '90vh',
        position: 'relative',
        [theme.breakpoints.down('748')]: {
            width: '80vw',
            paddingLeft: '9vw'
        }
    },
    header: {
        marginTop: '9%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputBox: {
        width: '65vw',
        backgroundColor: '#ffffff',
        borderRadius: '7px',
        alignItems: 'center',
        paddingTop: '2%',
        paddingBottom: '2%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.16), 0 4px 8px rgba(0, 0, 0, 0.23)',
        [theme.breakpoints.down('748')]: {
            width: '80vw',
        }
    },
    sep: {
        color: '#ffffff',
        justifyContent: 'center',
        display: 'flex',
        paddingTop: '3%',
        paddingBottom: '3%',
    },
    btnGrp: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    }
}))