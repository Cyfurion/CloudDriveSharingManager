import { useState } from "react";

export default function SwitchSnapshotModal(props) {
    let snapshotList = [];
    const [currentSS, setCurrentSS] = useState(null);


    const handleClick = (e) => {
        let selected = e.target.outerText;
        setCurrentSS(selected);

    }
    const handleClose = () => {
        props.closeSwitchSnapshotModal();
    }
    const handleRecent = (e) => {
        let selected = props.result.values().next().value;
        setCurrentSS(selected);
    }
    const handleConfirm = () => {
        // props.confirmSwitchSnapshot(selectedSnapshot);
    }

    if (props.result) {
        props.result.forEach((value, key) => (
            snapshotList.push(
                <p className= "font-mono border-b-2 hover:bg-gray-100" onClick={handleClick} id={key} key={value} >{value}</p>
            )
        ));
    }

    if(props.result){
    return (  
        <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="h-modal fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full h-50vh">
            <div className="relative h-full w-full max-w-2xl p-4 md:h-auto " >
                <div className=" relative rounded-3xl bg-white shadow dark:bg-gray-700 border-2 border-black">
                    <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                        <h3 className="text-xl font-mono font-semibold text-gray-900 dark:text-white">Switch Snapshot</h3>
                        <button onClick={handleClose} type="button" className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className= "max-h-64 w:50%  overflow-y-scroll ">
                        {snapshotList}
                    </div>
                    <h3> Selected Snapshot: {currentSS} </h3>
                    <button id={props.result.keys().next().value} onClick={handleRecent} > Return to Recent Snapshot</button>
                    <button onClick={handleConfirm}> Confirm</button>
                </div>
            </div>
        </div>
    );
    }
}
