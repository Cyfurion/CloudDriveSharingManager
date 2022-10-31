import {LoginPage,WorkSpace, TopBar, SideBar, AnalysisModal, QueryBuilderModal, PermissionModal, LoadingScreen} from './';
import AuthContext from '../auth';
import { useContext, useState } from 'react';
import StoreContext from '../store';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

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
        store.setFolder(store.currentSnapshot.root);
        setFiles(null);
    }

    const handleHistoryButton = (folder ) => {
        return;
    }

    const handleBackButton = (folder ) => {
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
            setFiles(store.getCurrentFolder().files);
        }
    }

    let screen = <div>
                    <TopBar />
                    <div className=" bg-black h-1">  </div>
                    <LoginPage/>
                </div>;

    if (auth.isAuthorized) {
        screen = store.currentSnapshot === null ?
                    <LoadingScreen />
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
                                <h1 className="font-bold"><button onClick={handleBackButton}><ArrowBackIosIcon fontSize="small"/> </button> directory: {store.getCurrentFolder().path}</h1>
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
