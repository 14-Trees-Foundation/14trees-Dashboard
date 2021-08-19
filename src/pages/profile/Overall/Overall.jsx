import { useParams } from "react-router";
import { Impact } from "../../../stories/Impact/Impact";
import { Bar } from "../../../stories/Progress Bar/Bar";
import './overall.scss';
import 'primeflex/primeflex.css';

export const Overall = () => {
    return (
        <div className="overall">
            <h2>Overall Impact</h2>
            <div className="p-grid">
                <div className="p-col-12 p-md-3 p-sm-6">
                    <Impact/>
                </div>
                <div className="p-col-12 p-md-3 p-sm-6">
                    <Impact/>
                </div>
                <div className="p-col-12 p-md-6 p-sm-12">
                    <Bar/>
                </div>
            </div>
        </div>
    )
}