import 'primeflex/primeflex.css';
import './userinfo.scss';
import { InfoChip } from "../../../stories/InfoChip/InfoChip";

export const UserInfo = (props) => {
    return (
        <div className="user">
            <div className="p-grid nested-grid" style={{"padding":'20'}}>
                <div className="p-col-12 p-md-10 p-lg-10" style={{"padding":'0'}}>
                    <div className="p-grid" style={{"padding":0}}>
                        <div className="p-col-6 p-md-6 p-sm-6" style={{"padding":0}}>
                            <img alt="Card" src="https://picsum.photos/523/354" className="img"/>
                        </div>
                        <div className="p-col-6 p-md-6 p-sm-6 desc">
                            <div className="label">Name</div>
                            <div className="data">{props.saplingData.name}</div>
                            <div className="label">Organization</div>
                            <div className="data">{props.saplingData.organisation}</div>
                            <InfoChip count={props.saplingData.treesPlanted.length} label="Trees Planted"/>
                            <InfoChip count={props.saplingData.treesPlanted.length} label="Visits till date"/>
                            <div className="overall">
                                <div className="done" style={{"width":'25%'}}>
                                </div>
                                <div className="count">
                                    {14 - props.saplingData.treesPlanted.length}
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