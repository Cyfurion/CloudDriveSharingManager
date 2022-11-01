import { useContext } from "react";
import StoreContext from "../store";

export default function PermissionModal( props ) {
    const { store } = useContext(StoreContext);

    let folder = store.getCurrentFolder();
    let files = [];
    for(let i = 0; i < folder.files.length;i++){
        if( props.data.includes( folder.files[i].id))
            files.push({ name: folder.files[i].name, permissions: folder.files[i].permissions});
    }
    console.log(files);
    
    const handleProceed = (e) =>{
        e.preventDefault();
        props.editPermission();
    }

    const handleClose = () => {
        props.hideEditPermissionModal();
    }

    return(
    <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="h-modal fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
        <div className="relative h-full w-full max-w-2xl p-4 md:h-auto">
                <div className=" relative rounded-3xl bg-white shadow dark:bg-gray-700 border-2 border-black">
                    

                <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                    <h3 className="text-xl font-mono font-semibold text-gray-900 dark:text-white">Edit Permissions</h3>
                    <button onClick={handleClose} type="button" className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 justify-center px-6">
                    <div className="flex gap-2 flex-col pr-4 pt-4 pb-4 border-r max-h-[70vh] overflow-y-scroll dark:border-gray-600">
                        {files.map((file)=>(

                            file.permissions.map((permission)=>(
                                <div className="permission-card"> 
                                    <label title={permission.entity} className=" text-ellipsis overflow-hidden"> {permission.entity} </label>
                                    <label className="font-bold"> {permission.role} </label>
                                </div>   
                            ))
                        ))}
                    </div>
                    <div className="flex flex-col gap-2 items-stretch pl-4 pt-4 pb-4 dark:border-gray-600"> 
                        <div className="pb-2"> <h1 className="text-sm"> What would you like to do</h1></div>
                        <div className="flex flex-row rounded-md p-1 bg-gray-200">
                            <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                            </div>
                            <input className="block p-1 pl-1 w-full text-sm bg-gray-200 " placeholder="Add Email" type="text" id="add-email-text"/>
                        </div>

                        <button className="rounded-md p-1 font-bold flex self-center bg-green-400"> Submit </button>   
                        
                        <div className="flex flex-row rounded-md p-1 bg-gray-200">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                </svg>

                            </div>
                            <input className="block p-1 pl-1 w-full text-sm bg-gray-200 " placeholder="Remove Email" type="text" id="remove-email-text"/>
                        </div>
                        <button className="rounded-md p-1 font-bold flex self-center bg-green-400"> Submit </button>

                        <div className="pt-10 self-center">
                            <button onClick={handleProceed} className="rounded-md p-1 px-5 font-bold flex self-center bg-green-500"> Proceed </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    );
}