import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../Helpers/Auth'
import Layout from './Layout';

function ProtectedRoute({ component: Component, ...rest }) {
    return (
        < Route {...rest} render={props => {
            if (!isAuthenticated()) {
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
            return (
                <Layout>
                    <Component {...rest} />
                </Layout>
            )
        }
        } />
    );
}

export { ProtectedRoute };