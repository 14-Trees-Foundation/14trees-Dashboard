
import 'primeflex/primeflex.css';
import './profile.scss'

import { useParams } from "react-router";
import { UserInfo } from "./UserInfo/UserInfo";
import { Overall } from "./Overall/Overall";
import { Memories } from "./Memories/Memories";
import { Map } from "./Map/Map";

export const Profile = () => {
    const { saplingId } = useParams();
    return (
        <div className="main-content">
            <div className="p-grid">
                <div className="p-col-12 p-md-6 p-sm-12">
                    <UserInfo/>
                    <Memories/>
                </div>
                <div className="p-col-12 p-md-6 p-sm-12">
                    <Overall/>
                    <Map/>
                </div>
            </div>
        </div>
    )
}