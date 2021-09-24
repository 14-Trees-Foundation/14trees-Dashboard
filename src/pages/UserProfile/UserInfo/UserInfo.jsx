import 'primeflex/primeflex.css';
import './userinfo.scss';
import { InfoChip } from "../../../stories/InfoChip/InfoChip";

import { useSetRecoilState } from 'recoil';
import { navIndex } from '../../../store/atoms';

export const UserInfo = (props) => {

    const setIndex = useSetRecoilState(navIndex);
    const handleTreeClick = () => {
        setIndex(2);
    }
    return (
        <div className="user">
            <div className="p-grid nested-grid" style={{ "padding": '20' }}>
                <div className="p-col-12 p-md-10 p-lg-10" style={{ "padding": '0' }}>
                    <div className="p-grid" style={{ "padding": 0 }}>
                        <div className="p-col-6 p-md-6 p-sm-6" style={{ "padding": 0 }}>
                            <img
                                alt="Card"
                                src={props.saplingData.user.profile_image === "" ? "https://picsum.photos/523/354" : props.saplingData.user.profile_image[0]}
                                className="img" />
                        </div>
                        <div className="p-col-6 p-md-6 p-sm-6 desc">
                            <div className="label">Name</div>
                            <div className="data">{props.saplingData.user.user.name}</div>
                            <div className="label">Organization</div>
                            <div className="data">{props.saplingData.user.user.org}</div>
                            <InfoChip count={props.saplingData.trees.length} label="Trees Planted" onClick={handleTreeClick} />
                            <InfoChip count={props.saplingData.trees.length} label="Visits till date" />
                            <div className="overall">
                                <div className="done" style={{ "width": '25%' }}>
                                </div>
                                <div className="count">
                                    {14 - props.saplingData.trees.length}
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