import { Map } from "../UserProfile/Map/Map";
import { Navigator } from "./Navigator";
import TreeInfoCard from "../../stories/TreeInfoCard/TreeInfoCard"

import { useLocation } from "react-router-dom";

import { useState } from 'react';

export const Trees = () => {

    const location = useLocation();

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleInfoChange = (i) => {
        setActiveStep(i)
    }

    return (
        <div style={{'display':'flex'}}>
            <div style={{height: 'calc(100vh - 67px)', width:'67vw', marginTop: '67px'}}>
                <Map
                    trees={location.state.trees}
                    currentInfo={activeStep}
                    handleInfoChange={handleInfoChange}
                />
            </div>
            <div style={{width:'35vw', marginTop: '67px', marginLeft:'-10px', zIndex:'1'}}>
                <TreeInfoCard
                    trees={location.state.trees}
                    activeStep={activeStep}
                >
                    <Navigator
                        activeStep={activeStep}
                        maxSteps={location.state.trees.length}
                        handleBack={handleBack}
                        handleNext={handleNext}
                    />
                </TreeInfoCard>
            </div>
        </div>
    )
}