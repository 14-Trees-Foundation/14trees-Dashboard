import { useState } from "react"

import { AppBar } from "../../stories/AppBar/AppBar";
import { InputBar } from "./InputBar/InputBar";
import { UserList } from "../../stories/UserList/UserList";
import { useHistory } from "react-router-dom";
import bg from "../../assets/bg.png";

import { createStyles, makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { useRecoilValue } from "recoil";
import { searchResults, searchKey } from "../../store/atoms";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Search = () => {
    const classes = UseStyle();
    let results = useRecoilValue(searchResults);
    let [type, setType] = useState("All");
    const history = useHistory();

    let intialChipState = {
        "All": "secondary",
        "Individual": "secondary",
        "Tree": "secondary",
        "Event": "secondary",
        "Organization": "secondary"
    }
    let [searchChips, setSearchChips] = useState(intialChipState);
    let key = useRecoilValue(searchKey);
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

    if (Object.keys(results.users).length === 0 && key === "") {
        return (
            <div className={classes.box}>
                <img alt="bg" src={bg} className={classes.bg} style={{height: '100vh',}}/>
                <div className={classes.overlay} style={{height: '100vh',}}>
                    <AppBar />
                    <div className={classes.main}>
                        <div className={classes.header}>
                            <h1 className={classes.infoheader}>
                                100+
                            </h1>
                            <p className={classes.infodesc}>
                                People employed from local community
                            </p>
                        </div>
                        <div>
                            <div className={classes.inputBox}>
                                <InputBar type={type}/>
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
            <div className={classes.box}>
                <ToastContainer />
                {/* {searchError &&
                    toast.warn("No results found!")
                } */}
                <img alt="bg" src={bg} className={classes.bg} style={{height: '40vh'}}/>
                <div className={classes.overlay} style={{height: '40vh'}}>
                <AppBar />
                <div className={classes.main} style={{paddingTop: '4%'}}>
                    <div className={classes.header} style={{marginTop: '0'}}>
                        <h1 className={classes.infoheader}>
                            100+
                        </h1>
                        <p className={classes.infodesc}>
                            People employed from local community
                        </p>
                    </div>
                    <div>
                    <div className={classes.inputBox}>
                        <InputBar type={type}/>
                    </div>
                </div>
                </div>
                <div className={classes.result}>
                        {results.total_results === 0 ?
                            <div className={classes.resultsH}>0 Results Found for : {key}</div>
                            :
                            <div className={classes.resultsH}>
                                Search Results for: {key}
                            </div>
                        }
                        {
                            (selectedChips === "Individual" || selectedChips === "All") &&
                            <div>
                                <UserList handleClick={onUserClick} />
                            </div>
                        }
                </div>
                        {/* <div className="s-input-box">
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
                        </div> */}
                    </div>
            </div>
        )
    }
}

const UseStyle = makeStyles((theme) =>
    createStyles({
        box: {
            width: '100%',
            position: 'relative',
            backgroundColor: '#e5e5e5',
            overflow: 'auto',
            minHeight: '100vh',
        },
        bg: {
            width: '100%',
            objectFit: 'cover',
        },
        overlay: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            background: 'linear-gradient(358.58deg, #1F3625 37.04%, rgba(31, 54, 37, 0.636721) 104.2%, rgba(31, 54, 37, 0) 140.95%)',
        },
        main: {
            width: '65vw',
            paddingLeft: '18vw',
            paddingTop: '5%',
            position: 'relative',
            [theme.breakpoints.down('748')]: {
                width: '80vw',
                paddingLeft: '9vw'
            }
        },
        header: {
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        infoheader: {
            fontSize: '80px',
            color: '#9BC53D',
            fontWeight: '550',
            [theme.breakpoints.down('md')]: {
                fontSize: '50px',
            }
        },
        infodesc: {
            fontSize: '24px',
            paddingLeft: '2%',
            color: '#ffffff',
            fontWeight: '500',
            alignItems: 'center',
            textAlign: 'center',
            // lineHeight: '80px',
            [theme.breakpoints.down('md')]: {
                fontSize: '15px',
            }
        },
        infobox: {
            marginTop: '50px',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            [theme.breakpoints.down('md')]: {
                flexWrap: 'wrap',
            }
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
        },
        individual: {
            marginTop: '10px',
        },
        resultsH: {
            fontSize: '16px',
            fontWeight: '400',
            height: '36px',
            paddingTop: '8px',
            paddingLeft: '5px',
            [theme.breakpoints.down('480')]: {
                paddingTop: '4%',
                paddingLeft: '4%',
            }
        },
        result: {
            marginTop: '2%',
            width: '65vw',
            marginLeft: '18vw',
            backgroundColor: '#e5e5e5',
            borderRadius: '10px',
            [theme.breakpoints.down('480')]: {
                width: '90vw',
                marginLeft: '5vw',
            }
        }
    }))