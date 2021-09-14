import { Map } from "../UserProfile/Map/Map";

import { useLocation } from "react-router-dom";

export const Trees = () => {

    const location = useLocation();
    console.log(location.state.trees)

    return (
        <div style={{height: 'calc(100vh - 67px)', marginTop: '67px'}}>
            <Map location={location.state.trees}/>
        </div>
    )
}