/**
 * This file handles authentication between the user and the cloud service.
 */

import { GoogleCloudServiceAdapter } from '../cloudservices/GoogleCloudServiceAdapter';
import { gapi } from 'gapi-script';
import React, { createContext, useEffect, useState } from 'react';

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

    useEffect(() => {
        function initClient() {
            gapi.client.init({
                'apiKey': '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',
                'clientId': '51282406360-evee6rmf1ttv4ni30be7l0dhme9p61ou.apps.googleusercontent.com',
                'scope': 'https://www.googleapis.com/auth/drive'
            });
        }
        gapi.load('client:auth2', initClient);
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

    auth.setGoogleEndpoint = function () {
        authReducer({
            type: AuthActionType.SET_ENDPOINT,
            payload: gapi
        });
        // testing
        let adapter = new GoogleCloudServiceAdapter(gapi);
        adapter.retrieve();
    }

    return (
        <AuthContext.Provider value={{ auth }}>
            { props.children }
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };
