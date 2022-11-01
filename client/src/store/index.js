/**
 * This file handles current snapshot and directory information.
 */
import api from '../api';
import { findDeviantSharing } from '../snapshotoperations/SharingAnalysis'
import AdapterContext from '../cloudservices';

import React, { createContext, useContext, useState } from 'react';

// Create store context.
const StoreContext = createContext();

// This is every type of update to the store state that can be processed.
export const StoreActionType = {
    PUSH_DIRECTORY: "PUSH_DIRECTORY",
    POP_DIRECTORY: "POP_DIRECTORY",
    SET_FOLDER: "SET_FOLDER",
    SET_SNAPSHOT: "SET_SNAPSHOT"
}

function StoreContextProvider(props) {
    const [store, setStore] = useState({
        directory: [],
        currentSnapshot: null
    });

    const { adapter } = useContext(AdapterContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case StoreActionType.PUSH_DIRECTORY:
                return setStore({
                    directory: [...store.directory, payload],
                    currentSnapshot: store.currentSnapshot
                });
            case StoreActionType.POP_DIRECTORY:
                return setStore({
                    directory: store.directory.slice(0, store.directory.length - 1),
                    currentSnapshot: store.currentSnapshot
                })
            case StoreActionType.SET_FOLDER:
                return setStore({
                    directory: [payload],
                    currentSnapshot: store.currentSnapshot
                });
            case StoreActionType.SET_SNAPSHOT:
                return setStore({
                    directory: [payload.root],
                    currentSnapshot: payload
                });
            default:
                throw new Error("Invalid StoreActionType: " + type);
        }
    }

    store.pushDirectory = function (folder) {
        storeReducer({
            type: StoreActionType.PUSH_DIRECTORY,
            payload: folder
        });
    }
    store.popDirectory = function (folder) {
        if (store.directory.length !== 1) {
            storeReducer({
                type: StoreActionType.POP_DIRECTORY,
                payload: folder
            });
        }
    }

    store.setFolder = function (folder) {
        storeReducer({
            type: StoreActionType.SET_FOLDER,
            payload: folder
        });
    }
    store.getCurrentFolder = function () {
        return store.directory[store.directory.length - 1];
    }
    store.setSnapshot = function (snapshot) {
        storeReducer({
            type: StoreActionType.SET_SNAPSHOT,
            payload: snapshot
        });
    }
    store.takeSnapshot = async function () {
        if (adapter.adapter) {
            let snapshot = await adapter.adapter.takeSnapshot();
            store.setSnapshot(snapshot);
            findDeviantSharing(snapshot.root.files[0].files[7], 0.6);
            // api.addSnapshot(snapshot);
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
