import { useState } from "react";

export default function SwitchSnapshotModal(props) {
    let snapshotList = [];
    const [currentSS, setCurrentSS] = useState(null);
    const [currentTimestamp, setCurrentTimestamp] = useState(null);



    const handleClick = (e) => {
        let id = e.target.id;
        let timestamp = e.target.innerHTML;
        setCurrentSS( id);
        setCurrentTimestamp(timestamp);

    }
    const handleClose = () => {
        props.closeSwitchSnapshotModal();
    }

    const handleRecentButton = () =>{
        let key = props.result.keys().next().value;
        props.confirmSwitchSnapshot(key); 
    }

    const handleConfirmButton = () =>{
        let ssid = currentSS;
        props.confirmSwitchSnapshot(ssid);
    }
    const handleBlur = (e) =>{
        if(e.target.id === 'modal-container')
            handleClose();
    }

    if (props.result) {
        props.result.forEach((value, key) => (
            snapshotList.push(
                <div onClick={handleClick} key={key} id={key} className="bg-gray-400 w-4/6 border border-black flex justify-center hover:bg-gray-500">
                    {value}
                </div>
            )
        ));
    }

    if(props.result){
    return (  
        <div id="modal-container" onClick={handleBlur} tabIndex="-1" aria-hidden="true" className="bg-black bg-opacity-30 fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full h-50vh">
            <div className="relative min-h-[50vh] min-w-[50vw] max-w-2xl p-4 md:h-auto font-mono " >
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

                    <div className="p-4 flex flex-col items-center max-h-[50vh] overflow-y-auto">
                        {snapshotList}
                    </div>
                    
                    <div className="flex p-4 justify-center">
                        <h1> Selected Snapshot: {currentTimestamp} </h1>
                    </div>

                    <div className="flex p-4 justify-center gap-x-5">
                        <button onClick={handleRecentButton} className="bg-yellow-400 rounded-xl p-1 px-3">
                            Recent
                        </button>
                        <button onClick={handleConfirmButton} className="bg-green-400 rounded-xl p-1 px-3">
                            Confirm
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
    }
}
