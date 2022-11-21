import StoreContext from '../store';
import { useContext} from 'react';
import apis from '../api';
import FileSnapshot from '../classes/filesnapshot-class';

export default function SwitchSnapshotModal(props) {
    const { store } = useContext(StoreContext);    
    let map = null;
    let snapshotList = [];

    const handleClick = async (e) => {
        props.confirmSwitchSnapshot(e);
    }

    const handleClose = () => {
        console.log(props.result.fileSnapshotIDs);
        props.closeSwitchSnapshotModal();
    }

    
    if (props.result) {
        map = new Map(Object.entries(props.result.fileSnapshotIDs));
        map = new Map([...map.entries()].sort().reverse());
        map.forEach((value, key)=>(
            snapshotList.push(
                <p onClick={handleClick} id={key} > {key} {value}</p>
            )
        ));
    }

    
    
    return (<div id="defaultModal" tabIndex="-1" aria-hidden="true" className="h-modal fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
        <div className="relative h-full w-full max-w-2xl p-4 md:h-auto " >
            <div className=" relative rounded-3xl bg-white shadow dark:bg-gray-700 border-2 border-black">


                <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                    <h3 className="text-xl font-mono font-semibold text-gray-900 dark:text-white">Switch Snapshot</h3>
                    <button onClick={handleClose} type="button" className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                        <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div >
                <div className= "max-h-64 overflow-y-scroll">
                {snapshotList}
                </div>
                
            </div>
        </div>
    </div>


    );
}