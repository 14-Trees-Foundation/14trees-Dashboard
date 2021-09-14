import React, { Fragment } from "react";
import { Button } from "primereact/button";
import { MenuButton } from "./MenuButton/menubutton";
import logo from '../../assets/logo_light.png';
import './appbar.scss'

export const AppBar = (props) => {
    return (
        <Fragment>
            <nav className="navbar">
                <div className="logo">
                    <img src={logo} alt="logo banner" />
                </div>
                <div className="right-section">
                    <MenuButton label="Home"/>
                    <MenuButton label="Events"/>
                    <MenuButton label="Search"/>
                    <MenuButton label="About"/>
                    <Button
                        className="navbar-button"
                        iconPos="right"
                        label="Connect"
                        // onClick={onClickHandler}
                    />
                </div>
            </nav>
        </Fragment>
    )
}