import { useState } from "react";
import { Impact } from "../../../stories/Impact/Impact";
import { Bar } from "../../../stories/ProgressBar/Bar";
import { Popup } from "../../../stories/Popup/Popup";
import { PopupItem } from "../../../stories/PopupItem/PopupItem";
import './overall.scss';
import 'primeflex/primeflex.css';

export const Overall = ({trees}) => {

    const [popup, setPopup] = useState(true);

    const togglePopup = () => {
        setPopup(!popup);
    }

    const getPonds = () => {
        setPopup(!popup)
    }

    return (
        <div className="overall">
            <Popup display={popup} toggle={togglePopup}>
                <PopupItem/>
            </Popup>
            <h2>Overall Impact</h2>
            <div className="p-grid">
                <div
                    className="p-col-12 p-md-3 p-sm-6"
                    style={{"cursor":"pointer"}}
                    onClick={() => getPonds()}>
                    <Impact count={trees.count} text={"Trees Planted by visitors till date"}/>
                </div>
                <div className="p-col-12 p-md-3 p-sm-6">
                    <Impact count={"100+"} text={"People employed from local community."}/>
                </div>
                <div className="p-col-12 p-md-6 p-sm-12">
                    <Bar/>
                </div>
            </div>
        </div>
    )
}