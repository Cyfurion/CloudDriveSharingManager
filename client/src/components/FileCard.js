import StoreContext from "../store";
import { useContext, useState } from "react";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';


export default function FileCard(props) {
    const { store } = useContext(StoreContext);
    const [clicked, setClicked] = useState(false);
    let file = props.file;

    const handleClicked = (e) => {
        e.preventDefault();
        if (e.target.getAttribute('type') !== 'SYSTEM') {
            setClicked((prevClicked) => !prevClicked);
        }

    }

    return (
        <tr key={file.id} className="filecard border-b-2 hover:bg-gray-100">
            <th>
                <input
                    style={{ visibility: store.directory.length === 1 ? 'hidden' : props.visible ? 'visible' : 'hidden' }}
                    className="file-checkbox"
                    value={file.id}
                    onChange={props.handleFileCheckBox}
                    type='checkbox' />
            </th>
            <td onClick={(e) => handleClicked(e)} className='max-w-[40vw] min-w-[40vw] text-ellipsis overflow-hidden whitespace-nowrap' type={"" + file.owner}>{file.owner === 'SYSTEM' ? <FolderSpecialIcon /> : (file.files === undefined ? <InsertDriveFileIcon /> : <FolderIcon />)}
                <span className={"" + (file.files !== undefined ? "underline" : "")} onClick={file.files === undefined ? null : (e) => props.handleClickFolder(e, file)} >{file.name}</span>
                {clicked && <div className="pl-8"> Permissions: {file.permissions.length === 0 ? "No Permissions" : file.permissions.map((permission) => (
                    <div className="pl-5 py-1">
                        <h1> Entity: {permission.entity} </h1>
                        <h1> Role: {permission.role}</h1>
                        {permission.isInherited === undefined ? "" : <h1> isInherited: {permission.isInherited} </h1>}
                    </div>
                ))}
                </div>}
            </td>
            <td className='min-w-[25vw] max-w-[25vw] text-ellipsis overflow-hidden whitespace-nowrap '> {file.owner} </td>
            <td className='min-w-[20vw] max-w-[20vw] text-ellipsis overflow-hidden whitespace-nowrap '>  {file.createdTime} </td>
        </tr>
    )
}