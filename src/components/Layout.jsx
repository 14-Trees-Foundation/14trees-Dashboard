import React from 'react'
import { AppBar } from './AppBar';

export const Layout = (props) => {
    return (
        <div>
            <AppBar />
            {props.children}
        </div>
    );
}