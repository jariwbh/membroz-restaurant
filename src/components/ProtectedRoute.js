import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { isAuthenticated } from '../Helpers/Auth'

function ProtectedRoute({ component: Component, ...rest }) {
    return (
        < Route {...rest} render={props => {
            if (!isAuthenticated()) {
                // not logged in so redirect to login page with the return url
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }

            return <Component {...rest} />
        }
        } />
    );
}

export { ProtectedRoute };