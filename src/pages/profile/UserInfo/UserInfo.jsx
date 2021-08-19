import { useParams } from "react-router";
import './userinfo.scss';

export const UserInfo = () => {
    const { saplingId } = useParams();
    console.log(saplingId);
    return (
        <div className="user">
            UserInfo
        </div>
    )
}