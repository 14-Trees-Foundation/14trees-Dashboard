import React from 'react'
import { AppBar } from './Appbar';

export const Layout = (props) => {
    return (
        <div>
            <AppBar />
            {props.children}
        </div>
    );
}