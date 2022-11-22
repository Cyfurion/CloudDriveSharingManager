import { useContext, useState } from "react";
import { v4 as uuidv4} from "uuid";
import { ToastContext } from '../toast';

export default function GroupSSModal(props) {
    const {state, dispatch} = useContext(ToastContext);
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleClose = () => {
        props.handleCloseGroupSSModal();
    }

    const handleUpload = (e) => {
        let filepath = e.target.value;
        const allowedExtensions = /(\.html)$/i;
        if ( !allowedExtensions.exec(filepath)){
            dispatch({
                type:"ADD_NOTIFICATION",
                payload : {
                    id: uuidv4(),
                    type: "WARNING",
                    title: "Cannot edit permissions",
                    message: "Please select a file or folder first"
                }
            })
            setUploadedFile( null);
            return;
        }
        else{
            let file = e.target.files[0];
            setUploadedFile( file);
        }
    }

    const handleCreateSnapshot = () =>{
        let name = document.querySelector("#group-ss-name").value;
        if(name.length === 0){
            dispatch({
                type:"ADD_NOTIFICATION",
                payload : {
                    id: uuidv4(),
                    type: "DANGER",
                    title: "Cannot make group snapshot",
                    message: "Make sure group name field is filled"
                }
            })
            return;
        }


        if( uploadedFile === null){
            dispatch({
                type:"ADD_NOTIFICATION",
                payload : {
                    id: uuidv4(),
                    type: "DANGER",
                    title: "Cannot make group snapshot",
                    message: "Please upload a .html file"
                }
            })
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) =>{
            console.log(e.target.result);
        }
        reader.readAsText(uploadedFile);
        
    }

    return (
        <div id="defaultModal" tabIndex="-1" aria-hidden="true" className=" fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
            <div className="flex justify-center  relative min-h-[60vh] min-w-[50vw] max-w-2xl p-4 md:h-auto text-mono">
                <div className=" relative rounded-3xl bg-white shadow w-full dark:bg-gray-700 border-2 border-black">


                    <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                        <h3 className="text-xl font-mono font-semibold text-gray-900 dark:text-white">Group Memberships</h3>
                        <button onClick={handleClose} type="button" className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="flex flex-col border-t p-4 gap-y-3 items-center border-b-2 ">
                        <div className="flex w-full justify-start items-baseline ">
                            <h1 className="p-1 ml-16 pl-2 justify-self-start ">  Group Name: </h1>
                            <input className="qbtextfield w-4/6 " type='text' id="group-ss-name" />
                        </div>

                        <div className="flex w-full justify-center items-baseline ">
                            <h1 className="p-1 ml-16 pl-2 justify-self-start ">  Upload HTML: </h1>
                            <input onChange={handleUpload} type="file" />
                        </div>

                        <div className="flex w-full justify-center items-baseline ">
                            <button onClick={handleCreateSnapshot} className=" bg-green-500 rounded-xl p-1 px-4 hover:bg-green-600 text-white"> Create group membership</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
}