import React from 'react'
import { ApplicationBar } from './appbar';

export const Layout = (props) => {
    const {children}  =props;
    return (
        <div className="base-layout">
            <ApplicationBar />
            {children}
        </div>
    );
}