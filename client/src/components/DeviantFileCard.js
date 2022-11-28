import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function DeviantFileCard(props) {
    let file = props.data;
    const [permView, setPermView] = useState(false);

    let downIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
  
    let removedPermissionsList = file.removedPermissions.map((permission, index) => (
        <div key={uuidv4()} className="w-5/6 flex gap-x-5">
            <h1 className="truncate">- Entity: {permission.entity}</h1>
            <h1 className="flex flex-nowrap">Role: {permission.role}</h1>
        </div>
    ));

    let addedPermissionsList = file.addedPermissions.map((permission, index) => (
        <div key={uuidv4()} className="w-5/6 flex gap-x-5">
            <h1 className="truncate">+ Entity: {permission.entity}</h1>
            <h1 className="flex flex-nowrap">Role: {permission.role}</h1>
        </div>
    ));

    let samePermissionsList = file.samePermissions.map((permission, index) => (
        <div key={uuidv4()} className="w-5/6 flex gap-x-5">
            <h1 className="truncate">Entity: {permission.entity}</h1>
            <h1 className="flex flex-nowrap">Role: {permission.role}</h1>
        </div>
    ));

    const handlePermView = () => {
        setPermView((prevClicked) => !prevClicked);

    }

    return (
        <div key={file.file.id} className="flex flex-col pl-2">
            <div className="flex gap-x-2 ">
            <button className=" rounded-full bg-gray-200 hover:bg-gray-300" onClick={handlePermView}> {downIcon} </button> 
                <h1 className="truncate"> {file.file.name} </h1>
            </div>
            {/* {permView && <div className="flex flex-col pl-5 rounded-xl bg-gray-300 font-bold"> {permList} </div>} */}
            {permView && <div className="flex flex-col pl-5 rounded-xl bg-red-300 font-bold"> {removedPermissionsList} </div>} 
            {permView && <div className="flex flex-col pl-5 rounded-xl bg-red-300 font-bold"> {addedPermissionsList} </div>}
            {permView && <div className="flex flex-col pl-5 rounded-xl bg-gray-300 font-bold"> {samePermissionsList} </div>}
        </div>
    )
}