/**
 * This file handles authentication between the user and the cloud service.
 */

import { gapi } from 'gapi-script';
import React, { createContext, useState } from 'react';

// Create authentication context.
const AuthContext = createContext();

// This is every type of update to the authentication state that can be processed.
export const AuthActionType = {
    SET_ENDPOINT: "SET_ENDPOINT"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        authEndpoint: null
    });

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.SET_ENDPOINT: {
                return setAuth({
                    authEndpoint: payload
                });
            }
            default:
                return auth;
        }
    }

    auth.initGoogleEndpoint = function (clientID) {
        gapi.load('auth2', function () {
            gapi.auth2.init({
                client_id: clientID
            }).then(function () {
                authReducer({
                    type: AuthActionType.SET_ENDPOINT,
                    payload: gapi
                });
            }, function () { alert('FATAL: Error 10'); });
        });
    }

    return (
        <AuthContext.Provider value={{ auth }}>
            { props.children }
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };
