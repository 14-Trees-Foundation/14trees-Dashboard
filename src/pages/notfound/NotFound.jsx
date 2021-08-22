import React from 'react'
import 'primeflex/primeflex.css';
import tree from "../../assets/14trees.jpeg";
import notfound from "../../assets/user.png";
import "./notfound.scss"

export const NotFound = () => {
    return(
        <div className="p-grid">
            <div className="p-col-12">
                <img src={notfound} alt="Page Not Found" className="lostimg"/>
            </div>
            <div className="p-col-12 textdesc">
                The requested page is lost in the Forest!
                <br></br>
                Please check if you planted a Tree
            </div>
        </div>
    );
}