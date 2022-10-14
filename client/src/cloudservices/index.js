import { DropboxCloudServiceAdapter } from '../cloudservices/DropboxCloudServiceAdapter';
import { GoogleCloudServiceAdapter } from '../cloudservices/GoogleCloudServiceAdapter';

import React, { createContext, useEffect, useState } from 'react';

// Create adapter context.
const AdapterContext = createContext();

// This is every type of update to the adapter state that can be processed.
export const AdapterActionType = {
    SET_DROPBOX_ADAPTER: "SET_DROPBOX_ADAPTER",
    SET_GOOGLE_ADAPTER: "SET_GOOGLE_ADAPTER"
}

function AdapterContextProvider(props) {
    const [adapter, setAdapter] = useState({
        dropboxAdapter: null,
        googleAdapter: null
    });

    const adapterReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AdapterActionType.SET_DROPBOX_ADAPTER:
                return setAdapter({
                    dropboxAdapter: payload,
                    googleAdapter: null
                });
            case AdapterActionType.SET_GOOGLE_ADAPTER:
                return setAdapter({
                    dropboxAdapter: null,
                    googleAdapter: payload
                });
            default:
                return adapter;
        }
    }

    adapter.setDropboxAdapter = function (endpoint) {
        adapterReducer({
            type: AdapterActionType.SET_DROPBOX_ADAPTER,
            payload: new DropboxCloudServiceAdapter(endpoint)
        });
    }

    adapter.setGoogleAdapter = function (endpoint) {
        adapterReducer({
            type: AdapterActionType.SET_GOOGLE_ADAPTER,
            payload: new GoogleCloudServiceAdapter(endpoint)
        });
    }

    useEffect(() => {
        async function retrieve() {
            if (adapter.dropboxAdapter) {
                console.log(await adapter.dropboxAdapter.retrieve());
            } else if (adapter.googleAdapter) {
                console.log(await adapter.googleAdapter.retrieve());
            }
        }
        retrieve();
    }, [adapter]);

    return (
        <AdapterContext.Provider value={{ adapter }}>
            { props.children }
        </AdapterContext.Provider>
    );
}

export default AdapterContext;
export { AdapterContextProvider };
