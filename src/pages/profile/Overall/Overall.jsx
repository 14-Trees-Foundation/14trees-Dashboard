import { useParams } from "react-router";
import { Impact } from "../../../stories/Impact/Impact";
import { Bar } from "../../../stories/ProgressBar/Bar";
import './overall.scss';
import 'primeflex/primeflex.css';

export const Overall = ({trees}) => {
    return (
        <div className="overall">
            <h2>Overall Impact</h2>
            <div className="p-grid">
                <div className="p-col-12 p-md-3 p-sm-6">
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