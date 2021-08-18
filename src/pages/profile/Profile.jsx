import { useParams } from "react-router";

export const Profile = () => {
    const { saplingId } = useParams();
    console.log(saplingId);
    return (
        <div className="main-content">
            Profile Page
        </div>
    )
}