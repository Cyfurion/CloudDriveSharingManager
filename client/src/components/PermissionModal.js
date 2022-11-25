import { useContext, useState } from "react";
import StoreContext from "../store";
import { ToastContext } from "../toast";
import Permission from "../classes/permission-class";
import { v4 as uuidv4 } from 'uuid';
import AdapterContext from "../cloudservices";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function PermissionModal(props) {
    const { dispatch } = useContext(ToastContext);

    const [type, setType] = useState("Type");
    const { store } = useContext(StoreContext);
    const [readerList, setReaderList] = useState([]);
    const [writerList, setWriterList] = useState([]);
    const [removeList, setRemoveList] = useState([]);
    const [typeOpen, setTypeOpen] = useState(false);

    let XIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>;

    let folder = store.getCurrentFolder();
    let files = [];

    for (let i = 0; i < folder.files.length; i++) {
        if (props.data.includes(folder.files[i].id)) {
            files.push(folder.files[i]);
        }

    }

    const handleChange = (e) => {
        console.log(e.target.value);
    }

    const handleAddReader = (e) => {
        let readerEmail = document.querySelector("#add-email-text").value;

        if (readerEmail.length === 0) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    id: uuidv4(),
                    type: "DANGER",
                    title: "Cannot add permission",
                    message: "Please provide an entity"
                }
            })
            return;
        }

        if (type === 'Type') {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    id: uuidv4(),
                    type: "DANGER",
                    title: "Cannot add permission",
                    message: "Please provide an type for entity"
                }
            })
            return;
        }

        let list = [...readerList];
        list = [...list, { entity: readerEmail, type: type }];
        console.log(list);
        document.querySelector("#add-email-text").value = "";
        setType("Type");
        setReaderList(list);

    }

    const handleAddWriter = (e) => {
        let writerEmail = document.querySelector("#add-email-text").value;

        if (writerEmail.length === 0) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    id: uuidv4(),
                    type: "DANGER",
                    title: "Cannot add AR",
                    message: "Please provide an entity"
                }
            })
            return;
        }

        if (type === 'Type') {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    id: uuidv4(),
                    type: "DANGER",
                    title: "Cannot add permission",
                    message: "Please provide an type for entity"
                }
            })
            return;
        }


        let list = [...writerList];
        list = [...list, { entity: writerEmail, type: type }];
        document.querySelector("#add-email-text").value = "";
        setType("Type");
        setWriterList(list);
    }

    const handleAddRemoveList = (e) => {
        e.preventDefault();
        let email = document.querySelector("#remove-email-text").value;

        if (email.length !== 0) {
            let list = [...removeList];
            list = [...list, email];
            document.querySelector("#remove-email-text").value = "";
            setRemoveList(list);
        }
        else {

        }
    }

    const handleRemoveReader = (e) => {

        let index = e.currentTarget.id;
        if (index > -1) {
            let list = [...readerList];
            list.splice(index, 1);
            setReaderList(list);
        }
    }

    const handleRemoveWriter = (e) => {
        let index = e.currentTarget.id;

        if (index > -1) {
            let list = [...writerList];
            list.splice(index, 1);
            setWriterList(list);
        }

    }

    const handleDeleteRemoveList = (e) => {
        let index = e.currentTarget.id;

        if (index > -1) {
            let list = [...removeList];
            list.splice(index, 1);
            setRemoveList(list);
        }

    }

    const handleProceed = async (e) => {
        let readers = [...readerList];
        let writers = [...writerList];
        let deletePermissions = [...removeList];
        if (readers.length === 0 && writers.length === 0 && deletePermissions.length === 0) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    id: uuidv4(),
                    type: "DANGER",
                    title: "Cannot edit permissions",
                    message: "No permission changes provided"
                }
            })
            return;
        }
        let addPermissions = [];
        readers.forEach((entry) => addPermissions.push(new Permission(entry.type, entry.entity, 'reader')));
        writers.forEach((entry) => addPermissions.push(new Permission(entry.type, entry.entity, 'writer')));
        let payload = { files: files, deletePermissions: deletePermissions, addPermissions : addPermissions};
        props.editPermission(payload);
    }

    const handleClose = () => {
        props.hideEditPermissionModal();
    }

    const handleBlur = (e) => {
        if (e.target.id === 'modal-container')
            handleClose();
    }

    const handleClick = (e) => {
        setType(e.target.id);
        setTypeOpen(false);
    }

    return (
        <div id="modal-container" onClick={handleBlur} tabIndex="-1" aria-hidden="true" className="bg-black bg-opacity-30 fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
            <div className="flex justify-center  relative min-h-[70vh] min-w-[85vw] max-w-2xl p-4 md:h-auto font-mono">
                <div className=" relative rounded-3xl bg-white shadow w-full dark:bg-gray-700 border-2 border-black">

                    <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                        <h3 className="text-xl font-mono font-semibold text-gray-900 dark:text-white">Edit Permissions</h3>
                        <button onClick={handleClose} type="button" className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 justify-center px-6">
                        <div className="flex gap-2 flex-col pr-4 pt-4 pb-4 max-h-[70vh] border-r overflow-y-auto dark:border-gray-600">
                            {files.map((file) => (
                                <div className=" p-2 border-b border-black">
                                    <h1 className="font-bold underline"> {file.files !== undefined ? "Folder:" : "File:"} {file.name}</h1>
                                    <div className="p-2 ">
                                        <h1 className="font-bold"> Permission:</h1>
                                        {file.permissions.map((permission, index) => (
                                            <h1 className="pl-3"> {index + 1}. Entity: {permission.entity}, Role: {permission.role}</h1>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 items-stretch pl-4 pt-4 pb-4 dark:border-gray-600 ">

                            <div className="flex flex-col h-[40vh]  overflow-y-auto">
                                <div className="flex flex-col gap-y-1 border-b border-gray-200 pb-2">
                                    Add Permissions:
                                    <div className="grid grid-cols-2">
                                        <div className="flex flex-col p-2 gap-y-1"> Reader:
                                            <div className=" max-h-52 gap-y-1 flex flex-col overflow-y-auto text-sm">
                                                {readerList.map((entry, index) => (
                                                    <div key={index} className="add-perm-card ">
                                                        <div className="flex flex-col ">
                                                            <h1 className="truncate"> Type: {entry.type}</h1>
                                                            <h1 title={entry.entity} className="truncate max-w-xs"> Entity: {entry.entity}</h1>
                                                        </div>
                                                        <button className="rounded-xl hover:bg-gray-400" id={index} onClick={handleRemoveReader} > {XIcon} </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col p-2 gap-y-1 border-l" > Writer:
                                            <div className=" max-h-52 gap-y-1 flex flex-col overflow-y-auto text-sm">
                                                {writerList.map((entry, index) => (
                                                    <div key={index} className="add-perm-card ">
                                                        <div className="flex flex-col ">
                                                            <h1 className="truncate"> Type: {entry.type}</h1>
                                                            <h1 title={entry.entity} className="truncate max-w-xs"> Entity: {entry.entity}</h1>
                                                        </div>
                                                        <button className="rounded-xl hover:bg-gray-400" id={index} onClick={handleRemoveWriter} > {XIcon} </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="flex flex-col gap-y-1">
                                    Remove Permissions:
                                    <div className="flex flex-col p-2 gap-y-1">
                                        {removeList.map((entry, index) => (
                                            <div key={index} className="remove-perm-card">
                                                <h1 title={entry} className="truncate"> {entry} </h1>
                                                <button className="rounded-xl hover:bg-gray-400" id={index} onClick={(e) => handleDeleteRemoveList(e)} > {XIcon} </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row rounded-md p-1 bg-gray-200">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </div>
                                <input className="block p-1 pl-1 w-full text-sm bg-gray-200 " placeholder="Add Entity" type="text" id="add-email-text" />
                            </div>

                            <div className="flex flex-row w-1/3 self-center ">

                            </div>

                            <div className="flex flex-row justify-center gap-x-3">
                                <button onClick={handleAddReader} className="rounded-md p-1 font-bold flex self-center bg-green-400 hover:bg-green-500"> Add Reader </button>
                                <button onClick={handleAddWriter} className="rounded-md p-1 font-bold flex self-center bg-green-400 hover:bg-green-500"> Add Writer </button>
                                <div className="bg-white ">
                                    <button onClick={(e) => setTypeOpen((prev) => !prev)} className="block h-8 w-20 border-2 rounded-lg focus: focus:rounded-t-lg border-gray-400 focus:border-blue-400 "> {type} </button>
                                    {typeOpen &&
                                        <div className="absolute bg-white border border-gray-400 p-1 rounded-b-lg">
                                            <ul onClick={handleClick} id="domain" className="block px-2 py-1 hover:bg-blue-400 hover:text-white"> domain </ul>
                                            <ul onClick={handleClick} id="group" className="block px-2 py-1 hover:bg-blue-400 hover:text-white"> group </ul>
                                            <ul onClick={handleClick} id="user" className="block px-2 py-1 hover:bg-blue-400 hover:text-white"> user </ul>
                                        </div>}
                                </div>
                            </div>



                            <div className="flex flex-row rounded-md p-1 bg-gray-200">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                    </svg>

                                </div>
                                <input className="block p-1 pl-1 w-full text-sm bg-gray-200 " placeholder="Remove Entity" type="text" id="remove-email-text" />
                            </div>

                            <div className="p-1 flex flex-row justify-center gap-x-3 border-b border-black">
                                <button onClick={handleAddRemoveList} className="rounded-md p-1 font-bold flex self-center bg-red-400 hover:bg-red-500"> Add Entity </button>
                            </div>

                            <div className="self-center">
                                <button onClick={handleProceed} className="rounded-md p-1 px-5 font-bold flex self-center bg-green-500 hover:bg-green-600"> Proceed </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}