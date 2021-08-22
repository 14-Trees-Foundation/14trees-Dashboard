
import 'primeflex/primeflex.css';
import * as Axios from "../../api/local";
import './profile.scss'

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { UserInfo } from "./UserInfo/UserInfo";
import { Overall } from "./Overall/Overall";
import { Trees } from "./Trees/Trees";
import { Map } from "./Map/Map";

export const Profile = () => {
    const { saplingId } = useParams();
    const [saplingData, setSaplingData] = useState({});
    const [overallData, setOverallData] = useState({});

    useEffect(() => {
        async function fetchData() {
          const response = await Axios.default.get(`/api/v1/profile?id=${saplingId}`);
          console.log(response);
          if(response.status === 200) {
            setSaplingData(response.data);
          }
        }
        fetchData();
    
        async function fetchTreeOverall() {
            const overallResponse = await Axios.default.get(`/api/v1/analytics/totaltree`);
            console.log("overall response...", overallResponse);
        }
        fetchTreeOverall();
        
    }, [saplingId]);
    console.log(Object.keys(saplingData).length);

    return (
        <div className="main-content">
            {
                Object.keys(saplingData).length === 0 ?
                    <div>Not found</div>
                    :
                    <div className="p-grid" style={{"marginTop":"15px"}}>
                        <div className="p-col-12 p-md-6 p-sm-12">
                            <UserInfo saplingData={saplingData}/>
                            <Trees trees={saplingData.treesPlanted}/>
                        </div>
                        <div className="p-col-12 p-md-6 p-sm-12">
                            <Overall/>
                            <Map/>
                        </div>
                    </div>
            }
        </div>
    )
}