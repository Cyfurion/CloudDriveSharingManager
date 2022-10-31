import {LoginPage,WorkSpace, TopBar, SideBar, AnalysisModal, QueryBuilderModal, PermissionModal} from './';
import AuthContext from '../auth';
import { useContext, useState } from 'react';
import StoreContext from '../store';

export default function SplashScreen() {
    const { auth }  = useContext(AuthContext);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showQBB, setShowQBB] = useState(false);
    const [showPermissions, setShowPermissions] = useState(false);
    const { store } = useContext(StoreContext);
    const [files, setFiles] = useState(null);

    const handleClickFolder= ( e, folder ) => {
        e.stopPropagation();
        store.pushDirectory(folder);
        setFiles(null);
    }

    const handlePermissionModal = () => {
        setShowPermissions(!showPermissions)
    }
    const handleAnalysisModal = () =>{
        setShowAnalysisModal(!showAnalysisModal);
    };

    const handleQueryBuilderButton = () =>{
        setShowQBB(!showQBB);
    }

    const handleHomeButton = () =>{
        store.setFolder(store.currentSnapshot.rootFiles);
        setFiles(null);
    }

    const handleHistoryButton = (folder ) => {
        store.popDirectory(folder);
        setFiles(null);
    }

    const handleQuery = ( query ) =>{
        //need implementation
    }

    const fillSearch = ( querybuilder) =>{
        setShowQBB(!showQBB);
        document.querySelector('#default-search').value = querybuilder;
        handleQuery( querybuilder);
    }

    if (files === null) {
        if (store.currentSnapshot === null) {
            store.takeSnapshot();
        } else {
            setFiles(store.directory[store.directory.length - 1].files);
        }
    }

    let screen = <div>
                    <TopBar />
                    <div className=" bg-black h-1">  </div>
                    <LoginPage/>
                </div>;

    if (auth.isAuthorized) {
        screen = store.currentSnapshot === null ?
                    <div class="flex justify-center min-w-fit min-h-screen items-center">
                        <div role="status">
                            <svg class="inline mr-2 w-40 h-40 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                        :
                    <div className="flex-nowrap">
                        <TopBar fillSearch={fillSearch}
                                handleQuery={handleQuery}
                                handleQueryBuilderButton={handleQueryBuilderButton} />
                        <div className=" bg-black h-1">  </div>
                        <div className="grid grid-flow-col justify-start">
                            <SideBar handlePermissionModal={handlePermissionModal}
                                     handleAnalysisModal={handleAnalysisModal} 
                                     handleHomeButton={handleHomeButton} 
                                     handleHistoryButton={handleHistoryButton}/>
                            <div className=" w-[85vw] h-[92vh] overflow-y-scroll overflow-x-hidden text-ellipsis break-words">
                                <h1 className="font-bold"> directory: {store.directory.map((folder)=> folder.name + "/" )} </h1>
                                <WorkSpace data={files} handleClickFolder={handleClickFolder}/>
                            </div>
                        </div>
                    </div>;

            
    }
    return ( 
        <div className=" min-w-fit min-h-screen bg-yellow-50 ">
            {showQBB &&  <QueryBuilderModal fillSearch={fillSearch} handleQueryBuilderButton={handleQueryBuilderButton} />}
            {showAnalysisModal && <AnalysisModal handleAnalysisModal={handleAnalysisModal}/>}
            {showPermissions && <PermissionModal handlePermissionModal={handlePermissionModal} />}
            {screen}
        </div>
    );
}
