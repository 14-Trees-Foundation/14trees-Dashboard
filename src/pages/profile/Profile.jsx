
import 'primeflex/primeflex.css';
import * as Axios from "../../api/local";
import './profile.scss'

import { useEffect, useState } from "react";
import { NotFound } from '../notfound/NotFound';
import { useParams } from "react-router";
import { UserInfo } from "./UserInfo/UserInfo";
import { Overall } from "./Overall/Overall";
import { Trees } from "./Trees/Trees";
import { Map } from "./Map/Map";
import { Spinner } from "../../stories/Spinner/Spinner";
import { useCallback } from 'react';

export const Profile = () => {
    const { saplingId } = useParams();
    const [saplingData, setSaplingData] = useState({});
    const [overallData, setOverallData] = useState({});
    const delay = ms => new Promise(res => setTimeout(res, ms));

    let [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        
        const response = await Axios.default.get(`/api/v1/profile?id=${saplingId}`);
        console.log(response);
        if(response.status === 200) {
            setSaplingData(response.data);
        }
    
        const overallResponse = await Axios.default.get(`/api/v1/analytics/totaltree`);
        console.log("overall response...", overallResponse);
        if(overallResponse.status === 200) {
            setOverallData(overallResponse.data[0]);                
        }
        await delay(1500);
        setLoading(false);
    }, [saplingId]);

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    if (loading) {
        return <Spinner />
    } else {
        return (
            <div className="main-content">
                {
                    Object.keys(saplingData).length === 0
                    ?
                        <NotFound/>
                    :
                        <div className="p-grid" style={{"marginTop":"15px"}}>
                            <div className="p-col-12 p-md-6 p-sm-12">
                                <UserInfo saplingData={saplingData}/>
                                <Trees trees={saplingData.treesPlanted}/>
                            </div>
                            <div className="p-col-12 p-md-6 p-sm-12">
                                <Overall trees={overallData}/>
                                <Map location={saplingData.treesPlanted}/>
                            </div>
                        </div>
                }
            </div>
        )
    }
}