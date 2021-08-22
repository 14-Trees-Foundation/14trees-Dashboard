import 'primeflex/primeflex.css';
import './userinfo.scss';
import { InfoChip } from "../../../stories/InfoChip/InfoChip";

export const UserInfo = (props) => {
    return (
        <div className="user">
            <div className="p-grid nested-grid" style={{"padding":0}}>
                <div className="p-col-12 p-md-10 p-lg-10" style={{"padding":0}}>
                <div className="p-grid" style={{"padding":0}}>
                    <div className="p-col-12 p-md-5 p-lg-5" style={{"padding":0}}>
                        <img alt="Card" src="https://picsum.photos/523/354" className="img"/>
                    </div>
                    <div className="p-col-12 p-md-7 p-lg-7 desc">
                        <div className="label">Name</div>
                        <div className="data">{props.saplingData.name}</div>
                        <div className="label">Organization</div>
                        <div className="data">{props.saplingData.organisation}</div>
                        <InfoChip/>
                        <InfoChip/>
                        <div className="overall">
                            <div className="done" style={{"width":'25%'}}>
                            </div>
                            <div className="count">
                                12
                            </div>
                            <div className="label">
                                Trees away from neutralising your carbon footprint
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}