
import 'primeflex/primeflex.css';
import './profile.scss'

import { useState } from "react";
import { NotFound } from '../notfound/NotFound';
import { UserInfo } from "./UserInfo/UserInfo";
import { Overall } from "./Overall/Overall";
import { Trees } from "./Trees/Trees";
import { Map } from "./Map/Map";

import { useRecoilValue } from 'recoil';
import { usersData, overallData, pondsImages } from '../../store/atoms';

export const Profile = () => {

    const userinfo = useRecoilValue(usersData);
    const overallinfo = useRecoilValue(overallData);
    const pondsimages = useRecoilValue(pondsImages);
    const [activeStep, setActiveStep] = useState(0);

    const handleInfoChange = (i) => {
        setActiveStep(i)
    }

    return (
        <div className="main-content">
            {
                Object.keys(userinfo).length === 0
                    ?
                    <NotFound />
                    :
                    <div className="p-grid" style={{ "marginTop": "15px" }}>
                        <div className="p-col-12 p-md-6 p-sm-12">
                            <UserInfo saplingData={userinfo} />
                            <Trees />
                        </div>
                        <div className="p-col-12 p-md-6 p-sm-12">
                            <div style={{ height: '54vh' }}>
                                <h2 style={{ marginTop: '18px' }}>Site Map</h2>
                                <Trees />
                                <Map
                                    trees={userinfo.trees}
                                    currentInfo={activeStep}
                                    handleInfoChange={handleInfoChange}
                                />
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}