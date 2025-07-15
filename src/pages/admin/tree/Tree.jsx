import { useState } from "react";
import { Spinner } from "../../../components/Spinner";

import { TreeNew } from "./table/Tree";
import { ToastContainer } from "react-toastify";

export const Trees = () => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <Spinner text={"Fetching Tree Data!"} />;
  } else {
    return (
      <>
        <ToastContainer />
        <TreeNew />
      </>
    );
  }
};
