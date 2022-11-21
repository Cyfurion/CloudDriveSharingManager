import { create } from "@mui/material/styles/createTransitions";
import { useState, useContext } from "react";
import AccessControlRequirement from "../classes/accesscontrolrequirement-class";
import StoreContext from "../store";
import apis from "../api";
import {ACRCreationField, ACRCard} from "./";

export default function ACRModal(props) {
    const {store} = useContext(StoreContext);
    const [AR, setAR] = useState([]);
    const [AW, setAW] = useState([]);
    const [DR, setDR] = useState([]);
    const [DW, setDW] = useState([]);
    const [Grp, setGrp] = useState(false);
    const [createACRScreen, setCreateACRScreen] = useState(false);
    const [acrList, setACRList] = useState(props.acr);

    const handleAddAR = (entity) => {
        if (entity.length !== 0) {
            let list = [...AR];
            list = [...list, entity];
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

    const handleAddAW = (entity) => {
        if (entity.length !== 0) {
            let list = [...AW];
            list = [...list, entity];
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

    const handleAddDR = (entity) => {
        if (entity.length !== 0) {
            let list = [...DR];
            list = [...list, entity];
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

    const handleAddDW = (entity) => {
        if (entity.length !== 0) {
            let list = [...DW];
            list = [...list, entity];
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

    const handleCancelCreationScreen = () => {
        document.querySelector("#acr-search-query").value = "";
        setAR([]);
        setDR([]);
        setAW([]);
        setDW([]);
        setGrp(false);
        setCreateACRScreen(false);
    }

    const handleSubmit = async () => {
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

        for (let i = 0; i < acrList.length; i++) {
            if (acrList[i].query === query) {
                alert("ACR with current query exists. Please try something else");
                return;
            }
        }

        let acr = new AccessControlRequirement(store.currentSnapshot.profile,query, ars, aws, drs, dws, grps);
        let list = [...acrList];
        list = [...list, acr];
        await apis.addACR(acr);

        setACRList(list);
        handleCancelCreationScreen();
    }

    const handleDeleteACR = async (e) => {
        let index = e.currentTarget.id;
        console.log(index);
        if ( index > -1){
            let list = [...acrList];
            list.splice(index, 1);
            await apis.deleteACR(index, store.currentSnapshot.profile);
            setACRList(list);
        }
    }


    let XIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>;

    let plusIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
    </svg>;

    let trashIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>;

    let displayACR = acrList.map((entry, index) => (
        <div className="flex w-full justify-center items-start">
            <ACRCard acr={entry} index={index} />
            <button id={index} onClick={(e)=> handleDeleteACR(e)} className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 ml-2"> {trashIcon} </button>
        </div>
    ))

    let ACRCreationScreen =
        <div className="flex flex-col border-t p-4 gap-y-3 ">

            <div className="flex w-full justify-start items-baseline ">
                <h1 className="p-1 ml-16 pl-2 justify-self-start "> Search Query: </h1>
                <input placeholder="Search Query" className="qbtextfield w-4/6 " type='text' id="acr-search-query" />
            </div>
            
            <ACRCreationField label={"Allowed Reader"} list={AR} inputID={"acr-ar-input-bar"} handleAdd={handleAddAR} handleDelete={handleDeleteAR}/>
            <ACRCreationField label={"Allowed Writer"} list={AW} inputID={"acr-aw-input-bar"} handleAdd={handleAddAW} handleDelete={handleDeleteAW}/>
            <ACRCreationField label={"Denied Readers"} list={DR} inputID={"acr-dr-input-bar"} handleAdd={handleAddDR} handleDelete={handleDeleteDR}/>
            <ACRCreationField label={"Denied Writers"} list={DW} inputID={"acr-dw-input-bar"} handleAdd={handleAddDW} handleDelete={handleDeleteDW}/>

            <div className="flex w-full justify-center gap-x-2">
                Take group membership into account?
                <input checked={Grp} onChange={(e) => setGrp((prevState) => !prevState)} type="checkbox" />
            </div>

            <div className="flex w-full justify-center gap-x-5  ">
                <button onClick={handleSubmit} className="bg-green-600 text-white rounded-xl p-1 px-3 hover:bg-green-700"> Submit </button>
                <button onClick={handleCancelCreationScreen} className="bg-red-600 text-white rounded-xl p-1 px-3 hover:bg-red-700"> Cancel </button>
            </div>

        </div>;

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

                    {createACRScreen ? ACRCreationScreen : <div>
                        <div className="flex justify-center p-4 border-b  ">
                            <button onClick={(e) => setCreateACRScreen(true)} className="bg-blue-600 hover:bg-blue-700 rounded-xl p-2 text-white "> Create ACR </button>
                        </div>
                        <div className="flex flex-col items-center gap-y-2 p-5 h-[50vh] overflow-y-auto"> {displayACR.length === 0 ? <h1> No ACRs found </h1> : displayACR}</div>
                    </div>}


                </div>
            </div>
        </div>

    );
}