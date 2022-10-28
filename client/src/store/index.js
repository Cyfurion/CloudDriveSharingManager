/**
 * This file handles current snapshot and directory information.
 */
import AdapterContext from '../cloudservices';

import React, { createContext, useContext, useState } from 'react';

// Create store context.
const StoreContext = createContext();

// This is every type of update to the store state that can be processed.
export const StoreActionType = {
    SET_FOLDER: "SET_FOLDER",
    SET_SNAPSHOT: "SET_SNAPSHOT"
}

function StoreContextProvider(props) {
    const [store, setStore] = useState({
        currentFolder: null,
        currentSnapshot: null
    });

    const adapter = useContext(AdapterContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case StoreActionType.SET_FOLDER:
                return setStore({
                    currentFolder: payload,
                    currentSnapshot: store.currentSnapshot
                });
            case StoreActionType.SET_SNAPSHOT:
                return setStore({
                    currentFolder: null,
                    currentSnapshot: payload
                });
            default:
                throw new Error("Invalid StoreActionType: " + type);
        }
    }

    store.setFolder = function (folder) {
        storeReducer({
            type: StoreActionType.SET_FOLDER,
            payload: folder
        });
    }
    store.setSnapshot = function (snapshot) {
        storeReducer({
            type: StoreActionType.SET_SNAPSHOT,
            payload: snapshot
        });
    }
    store.takeSnapshot = async function () {
        if (adapter.adapter) {
            let snapshot = await adapter.adapter.makeSnapshot();
            store.setSnapshot(snapshot);
        }
    }

    return (
        <StoreContext.Provider value={{ store }}>
            { props.children }
        </StoreContext.Provider>
    );
}

export default StoreContext;
export { StoreContextProvider };
