import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useAuth } from "../src/pages/admin/context/auth";


function PrivateRoute({ component: Component, ...rest }) {
    const { authTokens } = useAuth();
    let navigate = useNavigate();

    return (
        <Route
            {...rest}
            render={props =>
                authTokens ? (
                    <Component {...props} />
                ) : (
                    navigate('/login')
                )
            }
        />
    );
}

export default PrivateRoute;