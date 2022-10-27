import AdapterContext from '../cloudservices';
import React, { useContext, useState } from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';

export default function WorkSpace() {
    const { adapter } = useContext(AdapterContext);

    const [files, setFiles] = useState(null);

    if (files == null) {
        if (adapter.googleAdapter) {
            adapter.googleAdapter.retrieve().then((value) => {
                setFiles(value);
            });
        } else if (adapter.dropboxAdapter) {
            adapter.dropboxAdapter.retrieve().then((value) => {
                setFiles(value);
            });
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
                        <tr className="filecard border-b-2 hover:bg-gray-100">
                            <td > <InsertDriveFileIcon /> {file.name} </td>
                            <td > {file.owners[0].emailAddress} </td>
                            <td >  {file.createdTime} </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        );
    }
}
