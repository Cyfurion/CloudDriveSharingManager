import {LoginPage,WorkSpace, TopBar, SideBar} from './';
import AuthContext from '../auth';
import { useContext } from 'react';

export default function SplashScreen() {
    const { auth }  = useContext(AuthContext);

    let screen = <div>
                    <TopBar />
                    <div className=" bg-black h-1">  </div>
                    <LoginPage/>
                </div>;

    if (auth.isAuthorized) {
        screen = <div class="flex-nowrap">
                    <TopBar />
                    <div className=" bg-black h-1">  </div>
                    <div className="grid grid-flow-col justify-start">
                        <SideBar />
                        <div class=" w-[102rem] h-[54rem] flex flex-col overflow-y-scroll">
                            <WorkSpace />
                        </div>
                    </div>
                </div>;
    }
    return ( 
        <div class=" min-w-fit min-h-screen bg-yellow-50 "> 
            {screen}
        </div>
    );
}
