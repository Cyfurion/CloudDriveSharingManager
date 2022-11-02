import {LoginPage,WorkSpace, TopBar, SideBar, AnalysisModal, QueryBuilderModal, PermissionModal, LoadingScreen,AnalysisResult, FileFolderDiffResult} from './';
import AuthContext from '../auth';
import { useContext, useState } from 'react';
import StoreContext from '../store';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {findDeviantSharing, findFileFolderSharingDifferences} from '../snapshotoperations/SharingAnalysis';


import Query from '../snapshotoperations/Query';

export default function SplashScreen() {
    const { auth }  = useContext(AuthContext);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showQBB, setShowQBB] = useState(false);
    const[ showPermissionsModal, setPermissiosModal] = useState(false);
    const { store } = useContext(StoreContext);
    const [files, setFiles] = useState(null);
    const [selectedIDs, setSelectedIDs] = useState([]);
    const [checkboxVisible, setCheckboxVisible] = useState(false);
    const [showAnalysisResult, setShowAnalysisResult] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showFFDiffModal, setShowFFDiffModal] = useState(false);
    const [ffDiffResut, setFFDiffResult] = useState(null);


    const handleFileCheckBox = (e) =>{
        const checked = e.target.checked;
        if (checked) {
            setSelectedIDs([...selectedIDs, e.target.value]);
        } else {
            const allCheck = document.querySelector('.allfile-checkbox');
            if( allCheck){
                document.querySelector('.allfile-checkbox').checked = false;
            }
            setSelectedIDs(selectedIDs.filter((id) => id !== e.target.value));
        }
    }

    const handleAllFileCheckbox = (e) => {
        const checked = e.target.checked;
        let list = document.querySelectorAll('.file-checkbox');
        let s = [];
        if( checked ){
            setSelectedIDs([]);
            for(let i = 0; i < list.length;i++){
                list[i].checked = true;
                s.push(list[i].value);
            }
            setSelectedIDs(s);
        }
        else{
            for(let i = 0; i < list.length;i++){
                list[i].checked = false;
            }
            setSelectedIDs([]);
        }
    }

    const handleClickFolder= ( e, folder ) => {
        e.stopPropagation();
        setSelectedIDs([]);
        let list = document.querySelectorAll('.file-checkbox');
        for(let i = 0; i < list.length;i++){
            list[i].checked = false;
        }
        document.querySelector('.allfile-checkbox').checked = false;
        store.pushDirectory(folder);
        setFiles(null);
    }

    const handlePermissionModal = () => {
        setCheckboxVisible(true);
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
        setSelectedIDs([]);
        let list = document.querySelectorAll('.file-checkbox');
        for(let i = 0; i < list.length;i++){
            list[i].checked = false;
        }
        document.querySelector('.allfile-checkbox').checked = false;
        store.popDirectory(folder);
        setFiles(null);
    }

    const handleQuery = ( query ) =>{
        let q = new Query(query, store.currentSnapshot);
        setFiles(q.evaluate());
    }

    const fillSearch = ( querybuilder) =>{
        setShowQBB(!showQBB);
        document.querySelector('#default-searchbar').value = querybuilder;
        handleQuery( querybuilder);
    }

    const editPermission = () => {
        console.log("edit permission");
        //last steps after done editing permissions
        setPermissiosModal(false);
        let list = document.querySelectorAll('.file-checkbox');
        for(let i = 0; i < list.length;i++){
            list[i].checked = false;
        }
        document.querySelector('.allfile-checkbox').checked = false;
        setSelectedIDs([]);
    }

    const showEditPermissionModal = () =>{
        if(selectedIDs.length === 0){
            alert("SELECT A FILE OR FOLDER FIRST");
            return;
        }
        setPermissiosModal(true);
        console.log( "edit permissions for ids: " + selectedIDs );
    }

    const hideEditPermissionModal = () => {
        setPermissiosModal(false);
    }

    const handleHideCheckBox = () => {
        setSelectedIDs([]);
        let list = document.querySelectorAll('.file-checkbox');
        for(let i = 0; i < list.length;i++){
            list[i].checked = false;
        }
        document.querySelector('.allfile-checkbox').checked = false;
        setCheckboxVisible(false);
    }

    const deviancyAnalysis = () =>{
        setShowAnalysisModal(false);
        setShowAnalysisResult(true);
        setAnalysisResult(findDeviantSharing(store.getCurrentFolder(), .65));
    }

    const closeDeviancyAnalysisModal = () =>{
        setShowAnalysisResult(false);
        setAnalysisResult(null);
    }
    
    const closeFFDiffModal = () =>{
        setShowFFDiffModal(false);
        setFFDiffResult(null);
    }

    const fileFolderDiff = () =>{
        setShowAnalysisModal(false);
        setShowFFDiffModal(true);
        setFFDiffResult(findFileFolderSharingDifferences(store.getCurrentFolder()));
    }

    const snapshotChanges = () =>{
        console.log('snapshot changes');
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
                        <TopBar handleQuery={handleQuery}
                                handleQueryBuilderButton={handleQueryBuilderButton} />
                        <div className="bg-black h-1"></div>
                        <div className="grid grid-flow-col justify-start">
                            <SideBar    
                                     showEditPermissionModal={showEditPermissionModal}
                                     handleHideCheckBox={handleHideCheckBox}
                                     handlePermissionModal={handlePermissionModal}
                                     handleAnalysisModal={handleAnalysisModal} 
                                     handleHomeButton={handleHomeButton} 
                                     handleHistoryButton={handleHistoryButton}/>
                            <div className=" w-[85vw] h-[92vh] overflow-y-scroll overflow-x-hidden text-ellipsis break-words">
                                <h1 className="font-bold"><button onClick={handleBackButton}><ArrowBackIosIcon fontSize="small"/> </button> directory: {store.getCurrentFolder().path}</h1>
                                <WorkSpace  visible={checkboxVisible}
                                            handleAllFileCheckbox={handleAllFileCheckbox}
                                            handleFileCheckBox={handleFileCheckBox} 
                                            data={files} 
                                            handleClickFolder={handleClickFolder}/>
                            </div>
                        </div>
                    </div>;

            
    }
    return ( 
        <div className=" min-w-fit min-h-screen bg-yellow-50 ">
            {showQBB &&  <QueryBuilderModal fillSearch={fillSearch} handleQueryBuilderButton={handleQueryBuilderButton} />}
            {showAnalysisModal && <AnalysisModal snapshotChanges={snapshotChanges}
                                                 fileFolderDiff={fileFolderDiff}
                                                 deviancyAnalysis={deviancyAnalysis}
                                                 handleAnalysisModal={handleAnalysisModal}/>}
            {showPermissionsModal && <PermissionModal data={selectedIDs} editPermission={editPermission} hideEditPermissionModal={hideEditPermissionModal} />}
            {showAnalysisResult && <AnalysisResult result={analysisResult} closeDeviancyAnalysisModal={closeDeviancyAnalysisModal}/>}
            {showFFDiffModal && <FileFolderDiffResult result={ffDiffResut} closeFFDiffModal={closeFFDiffModal}/>}
            {screen}
        </div>
    );
}
