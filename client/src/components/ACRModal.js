import { useState } from "react";
import AccessControlRequirement from "../classes/accesscontrolrequirement-class";


export default function ACRModal(props) {
    const [AR, setAR] = useState([]);
    const [AW, setAW] = useState([]);
    const [DR, setDR] = useState([]);
    const [DW, setDW] = useState([]);
    const [Grp, setGrp] = useState(false);
    const [createACRScreen, setCreateACRScreen] = useState(false);


    let XIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>;

    let plusIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
    </svg>;



    const handleAddAR = () => {
        let entity = document.querySelector("#acr-ar-input-bar").value;
        if (entity.length !== 0) {
            let list = [...AR];
            list = [...list, entity];
            document.querySelector("#acr-ar-input-bar").value = "";
            setAR(list);
        }
    }

    const handleDeleteAR = (e) => {
        e.preventDefault();
        let index = e.target.id;
        if (index > -1) {
            let list = [...AR];
            list.splice(index, 1);
            setAR(list);
        }
    }

    const handleAddAW = () => {
        let entity = document.querySelector("#acr-aw-input-bar").value;
        if (entity.length !== 0) {
            let list = [...AW];
            list = [...list, entity];
            document.querySelector("#acr-aw-input-bar").value = "";
            setAW(list);
        }
    }

    const handleDeleteAW = (e) => {
        e.preventDefault();
        let index = e.target.id;
        if (index > -1) {
            let list = [...AW];
            list.splice(index, 1);
            setAW(list);
        }
    }

    const handleAddDR = () => {
        let entity = document.querySelector("#acr-dr-input-bar").value;
        if (entity.length !== 0) {
            let list = [...DR];
            list = [...list, entity];
            document.querySelector("#acr-dr-input-bar").value = "";
            setDR(list);
        }
    }

    const handleDeleteDR = (e) => {
        e.preventDefault();
        let index = e.target.id;
        if (index > -1) {
            let list = [...DR];
            list.splice(index, 1);
            setDR(list);
        }
    }

    const handleAddDW = () => {
        let entity = document.querySelector("#acr-dw-input-bar").value;
        if (entity.length !== 0) {
            let list = [...DW];
            list = [...list, entity];
            document.querySelector("#acr-dw-input-bar").value = "";
            setDW(list);
        }
    }

    const handleDeleteDW = (e) => {
        e.preventDefault();
        let index = e.target.id;
        if (index > -1) {
            let list = [...DW];
            list.splice(index, 1);
            setDW(list);
        }
    }

    const handleClose = () => {
        props.handleCloseACRModal();
    }

    const handleSubmit = () => {
        let query = document.querySelector("#acr-search-query").value;
        let ars = [...AR];
        let aws = [...AW];
        let drs = [...DR];
        let dws = [...DW];
        let grps = Grp;

        if (query.length === 0) {
            alert("Please fill in a search query to make ACR");
            return;
        }

        if (ars.length === 0 && aws.length === 0 && drs.length === 0 && dws.length === 0) {
            alert("one of the fields must be filled: AR, AW, DR, DW");
            return;
        }

        let acr = new AccessControlRequirement(query, ars, aws, drs, dws, grps);
        alert(acr);

    }

    let ACRCreationScreen =
        <div className="flex flex-col border-t p-4 gap-y-3">
            <div className="flex w-full justify-center">
                <h1 className="p-1"> Search Query: </h1>
                <input placeholder="Search Query" className="qbtextfield w-4/6" type='text' id="acr-search-query" />
            </div>

            <div className="flex flex-col items-center gap-y-1">
                <div className="flex w-full justify-center">
                    <h1 className="p-1"> Allowed Readers: </h1>
                    <input placeholder="johndoe@gmail.com" id="acr-ar-input-bar" className="qbtextfield w-4/6" type='text' />
                    <button onClick={handleAddAR} className="bg-green-600 text-white rounded-xl px-2 ml-3 hover:bg-green-700"> {plusIcon} </button>
                </div>
                {AR.map((entry, index) => (
                    <div className="bg-green-600 rounded-xl flex justify-between w-1/3 px-3 font-bold p-1">
                        <h1 className="truncate">
                            {index + 1}. Entity: {entry}
                        </h1>
                        <button onClick={handleDeleteAR} id={index} className="rounded-xl hover:bg-gray-400" >
                            {XIcon}
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center gap-y-1">
                <div className="flex w-full justify-center">
                    <h1 className="p-1"> Allowed Writers: </h1>
                    <input placeholder="johndoe@gmail.com" id="acr-aw-input-bar" className="qbtextfield w-4/6" type='text' />
                    <button onClick={handleAddAW} className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-2 ml-3"> {plusIcon} </button>
                </div>
                {AW.map((entry, index) => (
                    <div className="bg-green-600 rounded-xl flex justify-between w-1/3 px-3 font-bold p-1">
                        <h1 className="truncate">
                            {index + 1}. Entity: {entry}
                        </h1>
                        <button onClick={handleDeleteAW} id={index} className="rounded-xl hover:bg-gray-400" >
                            {XIcon}
                        </button>
                    </div>
                ))}
            </div>


            <div className="flex flex-col items-center gap-y-1">
                <div className="flex w-full justify-center">
                    <h1 className="p-1"> Denied Reader: </h1>
                    <input placeholder="johndoe@gmail.com" id="acr-dr-input-bar" className="qbtextfield w-4/6" type='text' />
                    <button onClick={handleAddDR} className="bg-green-600  hover:bg-green-700 text-white rounded-xl px-2 ml-3"> {plusIcon} </button>
                </div>
                {DR.map((entry, index) => (
                    <div className="bg-green-600 rounded-xl flex justify-between w-1/3 px-3 font-bold p-1">
                        <h1 className="truncate">
                            {index + 1}. Entity: {entry}
                        </h1>
                        <button onClick={handleDeleteDR} id={index} className="rounded-xl hover:bg-gray-400" >
                            {XIcon}
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center gap-y-1">
                <div className="flex w-full justify-center">
                    <h1 className="p-1"> Denied Writers: </h1>
                    <input placeholder="johndoe@gmail.com" id="acr-dw-input-bar" className="qbtextfield w-4/6" type='text' />
                    <button onClick={handleAddDW} className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-2 ml-3"> {plusIcon} </button>
                </div>
                {DW.map((entry, index) => (
                    <div className="bg-green-600 rounded-xl flex justify-between w-1/3 px-3 font-bold p-1">
                        <h1 className="truncate">
                            {index + 1}. Entity: {entry}
                        </h1>
                        <button onClick={handleDeleteDW} id={index} className="rounded-xl hover:bg-gray-400" >
                            {XIcon}
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex w-full justify-center gap-x-2">
                Take group membership into account?
                <input checked={Grp} onChange={(e) => setGrp((prevState) => !prevState)} type="checkbox" />
            </div>

            <div className="flex w-full justify-center gap-x-5  ">
                <button onClick={handleSubmit} className="bg-green-600 text-white rounded-xl p-1 px-3 hover:bg-green-700"> Submit </button>
                <button onClick={(e) => setCreateACRScreen(false)} className="bg-red-600 text-white rounded-xl p-1 px-3 hover:bg-red-700"> Cancel </button>
            </div>

        </div>

    return (
        <div id="defaultModal" tabIndex="-1" aria-hidden="true" className=" fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
            <div className="flex justify-center  relative min-h-[50vh] min-w-[50vw] max-w-2xl p-4 md:h-auto font-mono">
                <div className=" relative rounded-3xl bg-white shadow w-full dark:bg-gray-700 border-2 border-black">


                    <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                        <h3 className="text-xl font-mono font-semibold text-gray-900 dark:text-white">Access Control Requirements</h3>
                        <button onClick={handleClose} type="button" className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="flex justify-center p-4 border-b  ">
                        <button onClick={(e) => setCreateACRScreen(true)} className="bg-blue-600 hover:bg-blue-700 rounded-xl p-2 text-white "> Create ACR </button>
                    </div>
                    {createACRScreen ? ACRCreationScreen : <div></div>}


                </div>
            </div>
        </div>

    );
}