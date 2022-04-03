import { useEffect, useCallback, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import Axios from "../../api/local";
import { Spinner } from "../../components/Spinner";
import { birthdayData } from "../../store/atoms";

export const Events = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const setBirthdayData = useSetRecoilState(birthdayData);

  const fetchData = useCallback(async () => {
    try {
      let response = await Axios.get(`/events/birthday/?id=${id}`);
      if (response.status === 200) {
        setBirthdayData(response.data.data);
      } else {
        navigate("/notfound");
      }
    } catch (error) {
      navigate("/notfound");
    }
    setLoading(false);
  }, [setBirthdayData, navigate, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div>
        <Outlet />
      </div>
    );
  }
};
