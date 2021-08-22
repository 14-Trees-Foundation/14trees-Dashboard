import { Memories } from "./Memories/Memories";
import { TreesPlanted } from '../../../stories/TreesPlanted/TreesPlanted';
import './trees.scss'
import 'primeflex/primeflex.css';

export const Trees = (props) => {
    let numTrees = props.trees.length
    return (
        <div className="trees">
            {/* <h2>Trees Planted</h2> */}
            <div className="p-grid nested-grid">
                <div className="p-col-12 p-lg-6 p-md-6" style={{"padding":0}}>
                    <div className="p-grid" style={{"margin":0}}>
                        <div className="p-col-12" style={{"padding":0}}>
                            <h2 style={{"margin":"0 0 5px 0"}}>Trees Planted</h2>
                        </div>
                        <div className="p-col-6 p-lg-6 p-md-6" style={{"padding":0}}>
                            {
                                numTrees > 0
                                ?
                                    <TreesPlanted
                                        id={props.trees[0].sapling_id}
                                        name={props.trees[0].name}
                                        img={props.trees[0].image}
                                        date={props.trees[0].date_added}/>
                                :
                                    <TreesPlanted/>
                            }
                        </div>
                        <div className="p-col-6 p-lg-6 p-md-6" style={{"padding":0}}>
                            {
                                numTrees > 1
                                ?
                                    <TreesPlanted
                                        id={props.trees[1].sapling_id}
                                        name={props.trees[1].name}
                                        img={props.trees[1].image}
                                        date={props.trees[1].date_added}/>
                                :
                                    <TreesPlanted/>
                            }
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-lg-6 p-md-6" style={{"padding":0}}>
                    <div className="p-grid" style={{"margin":0}}>
                        <div className="p-col-12" style={{"padding":0}}>
                            <h2 style={{"margin":"0 0 5px 0"}}>Memories</h2>
                        </div>
                            <div className="p-col-7 p-lg-7 p-md-7" style={{"padding":"0 0.3rem 0 0"}}>
                                <Memories overlay="false"/>
                            </div>
                            <div className="p-col-5 p-lg-5 p-md-5" style={{"padding":"0 0.3rem 0 0"}}>
                                <Memories overlay="false"/>
                            </div>
                            <div className="p-col-7 p-lg-7 p-md-7" style={{"padding":"0 0.3rem 0 0"}}>
                                <Memories overlay="false"/>
                            </div>
                            <div className="p-col-5 p-lg-5 p-md-5" style={{"padding":"0 0.3rem 0 0"}}>
                                <Memories overlay="true"/>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}