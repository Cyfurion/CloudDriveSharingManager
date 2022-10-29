import {LoginPage,WorkSpace, TopBar, SideBar, AnalysisModal, QueryBuilderModal} from './';
import AuthContext from '../auth';
import { useContext, useState } from 'react';
import StoreContext from '../store';

export default function SplashScreen() {
    const { auth }  = useContext(AuthContext);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showQBB, setShowQBB] = useState(false);
    const { store } = useContext(StoreContext);

    const handleAnalysisModal = () =>{
        setShowAnalysisModal(!showAnalysisModal);
    };

    const handleQueryBuilderButton = () =>{
        setShowQBB(!showQBB);
    }

    let screen = <div>
                    <TopBar />
                    <div className=" bg-black h-1">  </div>
                    <LoginPage/>
                </div>;

    if (auth.isAuthorized) {
        screen = <div className="flex-nowrap">
                    <TopBar handleQueryBuilderButton={handleQueryBuilderButton} />
                    <div className=" bg-black h-1">  </div>
                    <div className="grid grid-flow-col justify-start">
                        <SideBar handleAnalysisModal={handleAnalysisModal}/>
                        <div className=" w-[85vw] h-[92vh] overflow-y-scroll overflow-x-hidden text-ellipsis break-words">
                            <WorkSpace />
                        </div>
                    </div>
                </div>;
    }
    return ( 
        <div className=" min-w-fit min-h-screen bg-yellow-50 ">
            {showQBB &&  <QueryBuilderModal handleQueryBuilderButton={handleQueryBuilderButton} />}
            {showAnalysisModal && <AnalysisModal handleAnalysisModal={handleAnalysisModal}/>}
            {screen}
        </div>
    );
}
