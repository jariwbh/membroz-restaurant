import React from 'react';
import { Redirect } from 'react-router-dom';
import { destroySession } from '../Helpers/Auth'

const Logout = () => {
    destroySession()
    return <Redirect to="/login" />
}

export default Logout;