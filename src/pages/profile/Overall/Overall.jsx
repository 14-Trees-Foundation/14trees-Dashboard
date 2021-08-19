import { useParams } from "react-router";
import './overall.scss';

export const Overall = () => {
    const { saplingId } = useParams();
    return (
        <div className="overall">
            OverAll score here
        </div>
    )
}