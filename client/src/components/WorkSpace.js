import StoreContext from '../store';

import React, { useContext, useState } from 'react';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function WorkSpace() {
    const { store } = useContext(StoreContext);

    const [files, setFiles] = useState(null);

    if (files === null) {
        if (store.currentSnapshot === null) {
            store.takeSnapshot();
        } else {
            setFiles(store.currentSnapshot.rootFiles.files);
        }
    }

    if (files === null) {
        return <div className="font-bold ">{"LOADING"} </div>;
    } else {
        return (
            <table >
                <thead className="border-b-2 border-gray-200">
                    <tr className="filecard ">
                        <th > Name </th>
                        <th > Owner </th>
                        <th > Date Created </th>
                    </tr>
                </thead>
                <tbody >
                    {files.map((file) => (
                        <tr className="filecard border-b-2 hover:bg-gray-100 ">
                            <td className='max-w-[40vw] text-ellipsis overflow-hidden whitespace-nowrap' > <InsertDriveFileIcon /> {file.name} </td>
                            <td className='w-[25vw] whitespace-nowrap '> {file.owner.emailAddress} </td>
                            <td className='w-[20vw] whitespace-nowrap '>  {file.createdTime} </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        );
    }
}
