import { useParams } from "react-router";
import './memories.scss'

export const Memories = () => {
    const { saplingId } = useParams();
    return (
        <div className="memories">
            Memories
        </div>
    )
}