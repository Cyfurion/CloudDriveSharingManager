import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function DeviantFileCard(props) {
    let file = props.data;
    const [permView, setPermView] = useState(false);

    let downIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>;





    let permList = file.permissions.map((permission, index) => (
        <div key={index.toString()} className="w-5/6 flex gap-x-5">
            <h1 className="truncate">Entity: {permission.entity}</h1>
            <h1 className="flex flex-nowrap">Role: {permission.role}</h1>
        </div>
    ));

    const handlePermView = () => {
        setPermView((prevClicked) => !prevClicked);

    }

    return (
        <div key={file.id} className="flex flex-col pl-2">
            <div className="flex gap-x-2 ">
                <h1 className="truncate"> {props.index + 1}.{file.name} </h1>
                <button className=" rounded-full bg-gray-200 hover:bg-gray-300" onClick={handlePermView}> {downIcon} </button> 
            </div>
            {permView && <div className="flex flex-col pl-5 rounded-xl bg-gray-300 font-bold"> {permList} </div>}
        </div>
    )
}