import React, { Fragment } from "react";
import { Button } from "primereact/button";
import { MenuButton } from "./MenuButton/menubutton";
import logo from '../../assets/logo_light.png';
import './navbar.scss'

export const Navbar = (props) => {
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
                        icon="pi pi-wallet"
                        iconPos="right"
                        label="Connect"
                        // onClick={onClickHandler}
                    />
                </div>
            </nav>
        </Fragment>
    )
}