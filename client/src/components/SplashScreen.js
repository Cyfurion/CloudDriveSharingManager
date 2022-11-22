import {Toast,ValidateACRResult, ACRModal,LoginPage,WorkSpace, TopBar, SideBar, AnalysisModal, QueryBuilderModal, PermissionModal, LoadingScreen,AnalysisResult, FileFolderDiffResult, SwitchSnapshotModal} from './';
import AuthContext from '../auth';
import { ToastContext } from '../toast';
import { useContext, useState } from 'react';
import StoreContext from '../store';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {findDeviantSharing, findFileFolderSharingDifferences} from '../snapshotoperations/SharingAnalysis';
import apis from '../api';
import Query from '../snapshotoperations/Query';
import { v4 as uuidv4 } from 'uuid';

export default function SplashScreen() {
    const {state, dispatch} = useContext(ToastContext);
    const { auth } = useContext(AuthContext);
    const { store } = useContext(StoreContext);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showQBB, setShowQBB] = useState(false);
    const[ showPermissionsModal, setPermissionsModal] = useState(false);
    const [files, setFiles] = useState(null);
    const [selectedIDs, setSelectedIDs] = useState([]);
    const [checkboxVisible, setCheckboxVisible] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [ffDiffResult, setFFDiffResult] = useState(null);
    const [showSnapshots, setShowSnapshots] = useState(null);
    const [showACRModal, setShowACRModal] = useState(null);
    const [validateACRResult, setValidateACRResult] = useState(null);

    const handleRefreshButton = async () =>{
        store.reset();
        await store.takeSnapshot();
        setFiles(null);
    }

    const handleShowACRModal = async () => {
        let currentACRs = (await apis.getUser(store.currentSnapshot.profile)).acrs;
        setShowACRModal( currentACRs );
    }

    const handleCloseACRModal = () => {
        setShowACRModal( null );
    }

    const handleValidateACRButton = async () =>{
        let ACRList = (await apis.getUser(store.currentSnapshot.profile)).acrs;
        let result = store.currentSnapshot.validate(ACRList);
        setValidateACRResult(result);
        
    }

    const handleCloseValidateACR = () =>{
        setValidateACRResult(null);
    }

    const handleFileCheckBox = (e) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedIDs([...selectedIDs, e.target.value]);
        } else {
            const allCheck = document.querySelector('.allfile-checkbox');
            if (allCheck) {
                document.querySelector('.allfile-checkbox').checked = false;
            }
            setSelectedIDs(selectedIDs.filter((id) => id !== e.target.value));
        }
    }

    const handleAllFileCheckbox = (e) => {
        const checked = e.target.checked;
        let list = document.querySelectorAll('.file-checkbox');
        let s = [];
        if (checked) {
            setSelectedIDs([]);
            for (let i = 0; i < list.length; i++) {
                list[i].checked = true;
                s.push(list[i].value);
            }
            setSelectedIDs(s);
        }
        else {
            for (let i = 0; i < list.length; i++) {
                list[i].checked = false;
            }
            setSelectedIDs([]);
        }
    }

    const handleClickFolder = (e, folder) => {
        e.stopPropagation();
        setSelectedIDs([]);
        let list = document.querySelectorAll('.file-checkbox');
        for (let i = 0; i < list.length; i++) {
            list[i].checked = false;
        }
        document.querySelector('.allfile-checkbox').checked = false;
        store.pushDirectory(folder);
        setFiles(null);
    }

    const handlePermissionModal = () => {
        setCheckboxVisible(true);
    }

    const handleAnalysisModal = () => {
        setShowAnalysisModal((prevState) => !prevState);
    };

    const handleQueryBuilderButton = () => {
        setShowQBB( (prevState) => !prevState);
    }

    const handleHomeButton = () => {
        store.setFolder(store.currentSnapshot.root);
        setFiles(null);
    }

    const handleHistoryButton = (folder) => {
        return;
    }

    const handleBackButton = (folder) => {
        setSelectedIDs([]);
        let list = document.querySelectorAll('.file-checkbox');
        for (let i = 0; i < list.length; i++) {
            list[i].checked = false;
        }
        document.querySelector('.allfile-checkbox').checked = false;
        store.popDirectory(folder);
        setFiles(null);
    }

    const handleQuery = (query) => {
        let q = new Query(query, store.currentSnapshot);
        setFiles(q.evaluate());
    }

    const fillSearch = (querybuilder) => {
        setShowQBB( (prevState) => !prevState);
        document.querySelector('#default-searchbar').value = querybuilder;
        handleQuery(querybuilder);
    }

    const editPermission = () => {
        console.log("edit permission");
        //last steps after done editing permissions
        setPermissionsModal(false);
        let list = document.querySelectorAll('.file-checkbox');
        for (let i = 0; i < list.length; i++) {
            list[i].checked = false;
        }
        document.querySelector('.allfile-checkbox').checked = false;
        setSelectedIDs([]);
    }

    const showEditPermissionModal = () => {
        if (selectedIDs.length === 0) {
            dispatch({
                type:"ADD_NOTIFICATION",
                payload : {
                    id: uuidv4(),
                    type: "WARNING",
                    title: "Cannot edit permissions",
                    message: "Please select a file or folder first"
                }
            })
            return;
        }
        setPermissionsModal(true);
        console.log( "edit permissions for ids: " + selectedIDs );
    }

    const hideEditPermissionModal = () => {
        setPermissionsModal(false);
    }

    const showSwitchSnapshotModal = async () => {
        let map = (await apis.getUser(store.currentSnapshot.profile)).fileSnapshotIDs;
        setShowSnapshots(map);
    }
    const closeSwitchSnapshotModal = () => {
        setShowSnapshots(null);
    }
    const confirmSwitchSnapshot = async (ssID) => {
        let id = ssID;
        const snapshot = await apis.getSnapshot(id);
        store.setSnapshot(snapshot);
        setShowSnapshots(null);
        setFiles(null);
    }
    
    const handleHideCheckBox = () => {
        setSelectedIDs([]);
        let list = document.querySelectorAll('.file-checkbox');
        for (let i = 0; i < list.length; i++) {
            list[i].checked = false;
        }
        document.querySelector('.allfile-checkbox').checked = false;
        setCheckboxVisible(false);
    }

    const deviancyAnalysis = (threshold) => {
        setShowAnalysisModal(false);

        if(store.directory.length > 1){
            let result = findDeviantSharing(store.getCurrentFolder(), (threshold/100));
            setAnalysisResult(result);
        }
        else{
            alert("cannot do analysis on current directory");
        }
    }

    const closeDeviancyAnalysisModal = () => {
        setAnalysisResult(null);
    }

    const closeFFDiffModal = () => {
        setFFDiffResult(null);
    }

    const fileFolderDiff = () => {
        setShowAnalysisModal(false);
        if( store.directory.length >= 3){
            setFFDiffResult(findFileFolderSharingDifferences(store.getCurrentFolder()));
        }
        else{
            alert("cannot do analysis on current diretory");
        }
    }

    const snapshotChanges = () => {
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
        <LoginPage />
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
                                     handleRefreshButton={handleRefreshButton}
                                     handleValidateACRButton={handleValidateACRButton}
                                     showSwitchSnapshotModal={showSwitchSnapshotModal}
                                     showEditPermissionModal={showEditPermissionModal}
                                     handleHideCheckBox={handleHideCheckBox}
                                     handlePermissionModal={handlePermissionModal}
                                     handleAnalysisModal={handleAnalysisModal} 
                                     handleHomeButton={handleHomeButton} 
                                     handleHistoryButton={handleHistoryButton}
                                     showACRModal={handleShowACRModal}
                                     />
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
        <div className=" min-w-fit min-h-screen  ">
            <Toast position="bottom-right"/>
            {showQBB &&  <QueryBuilderModal fillSearch={fillSearch} handleQueryBuilderButton={handleQueryBuilderButton} />}
            {showAnalysisModal && <AnalysisModal snapshotChanges={snapshotChanges}
                                                 fileFolderDiff={fileFolderDiff}
                                                 deviancyAnalysis={deviancyAnalysis}
                                                 handleAnalysisModal={handleAnalysisModal}/>}
            {showPermissionsModal && <PermissionModal data={selectedIDs} editPermission={editPermission} hideEditPermissionModal={hideEditPermissionModal} />}
            {analysisResult && <AnalysisResult result={analysisResult} closeDeviancyAnalysisModal={closeDeviancyAnalysisModal}/>}
            {ffDiffResult && <FileFolderDiffResult result={ffDiffResult} closeFFDiffModal={closeFFDiffModal}/>}
            {showSnapshots && <SwitchSnapshotModal result={showSnapshots} closeSwitchSnapshotModal={closeSwitchSnapshotModal} confirmSwitchSnapshot={confirmSwitchSnapshot} />}
            {showACRModal && <ACRModal acr={showACRModal} handleCloseACRModal={handleCloseACRModal} />}
            {validateACRResult && <ValidateACRResult result={validateACRResult} handleCloseValidateACR={handleCloseValidateACR} />}
            {screen}
        </div>
    );
}
