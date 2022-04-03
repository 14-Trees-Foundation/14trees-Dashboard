import { Map } from "../UserProfile/Map/Map";
import { Navigator } from "./Navigator";
import TreeInfoCard from "../../stories/TreeInfoCard/TreeInfoCard";

import { useRecoilValue } from "recoil";
import { usersData } from "../../store/atoms";

import { useState } from "react";

export const Maps = () => {
  const userinfo = useRecoilValue(usersData);

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInfoChange = (i) => {
    setActiveStep(i);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ height: "100vh", width: "100%", marginLeft: "-9px" }}>
        <Map
          trees={userinfo.trees}
          currentInfo={activeStep}
          handleInfoChange={handleInfoChange}
        />
      </div>
      <div style={{ width: "25vw", marginLeft: "-9px", zIndex: "1" }}>
        <TreeInfoCard
          trees={userinfo.trees}
          activeStep={activeStep}
          setIndex={setActiveStep}
        >
          <Navigator
            activeStep={activeStep}
            maxSteps={userinfo.trees.length}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        </TreeInfoCard>
      </div>
    </div>
  );
};
