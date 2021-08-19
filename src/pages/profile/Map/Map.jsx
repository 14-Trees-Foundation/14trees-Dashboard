import { useParams } from "react-router";
import './maps.scss'

export const Map = () => {
    const { saplingId } = useParams();
    return (
        <div className="map">
            Map section
        </div>
    )
}