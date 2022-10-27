import React from "react";
import { GoogleLoginButton } from './';
import { DropboxLoginButton } from './';
export default function LoginPage() {
    return (
        <div class="flex flex-col items-center space-y-5 pt-10 ">
            <div class="">
                <h1 class="text-5xl font-bold font-mono">
                    Service Login                </h1>
            </div>

            <div className=" rounded-md border-black border-2 pr-16 pl-16 pt-6 pb-10"> 
                <div >
                    <GoogleLoginButton />
                </div>
                
                <div >
                    <DropboxLoginButton />
                </div>
            </div>

        </div>

    );
}
