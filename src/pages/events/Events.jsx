import { useEffect, useCallback, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import Axios from '../../api/local';
import { Spinner } from "../../components/Spinner";
import { birthdayData } from "../../store/atoms";

export const Events = () => {
    const event_id = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    console.log(event_id.id);
    const setBirthdayData = useSetRecoilState(birthdayData);

    const fetchData = useCallback(async () => {
        try {
            let response = await Axios.get(`/events/birthday/?id=${event_id.id}`);
            console.log(response)
            if (response.status === 200) {
                setBirthdayData(response.data.data)
            } else {
                navigate('/notfound');
            }
        } catch (error) {
            navigate('/notfound');
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    if (loading) {
        return (
            <Spinner />
        )
    } else {
        return (
            <div>
                <Outlet />
            </div>
        )
    }
}