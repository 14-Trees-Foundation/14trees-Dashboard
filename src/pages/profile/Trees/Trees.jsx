import { useParams } from "react-router";
import { Memories } from "./Memories/Memories";
import { TreesPlanted } from '../../../stories/TreesPlanted/TreesPlanted';
import './trees.scss'
import 'primeflex/primeflex.css';

export const Trees = () => {
    const { saplingId } = useParams();
    return (
        <div className="memories">
            <h2>Trees Planted</h2>
            <div className="p-grid">
                <div className="p-lg-3 p-md-3" style={{"padding":"0.2rem"}}>
                    <TreesPlanted/>
                </div>
                <div className="p-lg-3 p-md-3" style={{"padding":"0.2rem"}}>
                    <TreesPlanted/>
                </div>    
            </div>
        </div>
    )
}