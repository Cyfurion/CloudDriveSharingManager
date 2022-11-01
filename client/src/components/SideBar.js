import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import HistoryIcon from '@mui/icons-material/History';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import ScreenLockLandscapeIcon from '@mui/icons-material/ScreenLockLandscape';
import LockResetIcon from '@mui/icons-material/LockReset';
import HomeIcon from '@mui/icons-material/Home';
import { useState } from 'react';

export default function SideBar( props ) {
    const [permissionView, setPermissionView] = useState(false);

    const handlePermissionButton = () => {
        setPermissionView(true);
        props.handlePermissionModal();
    }

    const handleAnalysisButton = () => {
        props.handleAnalysisModal();
    }

    const handleHomeButton = () =>{
        props.handleHomeButton();
    }

    const handleHistoryButton = () =>{
        props.handleHistoryButton();
    }

    const cancelPermissionMode = () =>{
        setPermissionView(false);
        props.handleHideCheckBox();
    }

    const editPermissionButton = () => {
        props.showEditPermissionModal();
    }

    if (permissionView){
        return (
            <div className="flex flex-col justify-start mt-4 mx-5 gap-y-4">
                <button onClick={editPermissionButton} type="button" className="sidebar-greenbtn"> Edit Permissions </button>
                <button onClick={cancelPermissionMode} type="button" className="sidebar-redbtn "> Exit </button>
           </div>
        )
    }

    return (
            <div className="flex flex-col justify-start mt-4 mx-5 gap-y-4">
                <button onClick={handleAnalysisButton}type="button" className="sidebarbtn" >
                    <TroubleshootIcon fontSize="small" sx={{color: 'black'}}/>
                    Analysis
                </button>

                <button onClick={handlePermissionButton}className="sidebarbtn flex" >
                    <LockIcon fontSize="small" sx={{color: 'black'}}/>
                    Permissions
                </button>

                <button className="sidebarbtn" >
                    <RefreshIcon fontSize="small" sx={{color: 'black'}}/> 
                    Refresh
                </button>

                <button onClick={handleHistoryButton} className="sidebarbtn" >
                    <HistoryIcon fontSize="small" sx={{color: 'black'}}/>
                    History
                </button>

                <button className="sidebarbtn" >
                    <FlipCameraIosIcon fontSize="small" sx={{color: 'black'}}/>
                    Switch Snapshot
                </button>

                <button className="sidebarbtn" >
                    <ScreenLockLandscapeIcon fontSize="small" sx={{color: 'black'}}/>
                    Access Control Requirement
                </button>

                <button className="sidebarbtn" >
                    <LockResetIcon fontSize="small" sx={{color: 'black'}}/>
                    Validate ACR
                </button>

                <button onClick={handleHomeButton} className="sidebarbtn" >
                    <HomeIcon fontSize="small" sx={{color: 'black'}}/>
                    Home
                </button>
           </div>
    );
}
