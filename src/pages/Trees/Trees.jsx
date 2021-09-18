import { Map } from "../UserProfile/Map/Map";
import TreeInfoCard from "../../stories/TreeInfoCard/TreeInfoCard"

import { useLocation } from "react-router-dom";

export const Trees = () => {

    const location = useLocation();

    return (
        <div style={{'display':'flex'}}>
            <div style={{height: 'calc(100vh - 67px)', width:'67vw', marginTop: '67px'}}>
                <Map trees={location.state.trees}/>
            </div>
            <div style={{width:'35vw', marginTop: '67px', marginLeft:'-10px', zIndex:'1'}}>
                <TreeInfoCard/>
            </div>
        </div>
    )
}