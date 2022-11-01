import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import { useContext } from 'react';
import StoreContext from '../store';

export default function WorkSpace( props ) {
    const { store } = useContext(StoreContext);
        return (
            <table >
                <thead className="border-b-2 border-gray-200">
                    <tr id="heading" className="filecard ">
                        <th> 
                            <input
                                className="allfile-checkbox" 
                                onChange={props.handleAllFileCheckbox}
                                type='checkbox'
                                style={{visibility : store.directory.length === 1 ? 'hidden' : props.visible ? 'visible' : 'hidden'}}
                                /> 
                        </th>
                        <th id="heading-name" className="pl-6"> Name </th>
                        <th id="heading-owner"> Owner </th>
                        <th id="heading-dateCreated"> Date Created </th>
                    </tr>
                </thead>
                <tbody >
                    {props.data.map((file) => (
                        <tr key={file.id}  className="filecard border-b-2 hover:bg-gray-100">
                            <th> 
                                <input 
                                style={{visibility : store.directory.length === 1 ? 'hidden' : props.visible ? 'visible' : 'hidden'}}
                                className="file-checkbox"
                                value={file.id}
                                onChange={props.handleFileCheckBox}
                                type='checkbox' /> 
                            </th>
                            <td className='max-w-[40vw] min-w-[40vw] text-ellipsis overflow-hidden whitespace-nowrap' >{ file.owner === 'SYSTEM' ? <FolderSpecialIcon/> : (file.files === undefined ? <InsertDriveFileIcon /> : <FolderIcon />)  }
                            <span  className={"" + (file.files !== undefined ? "underline" : "")} onClick={ file.files === undefined ? null  : (e) => props.handleClickFolder(e, file)} >{file.name}</span> </td>
                            <td className='min-w-[25vw] max-w-[25vw] text-ellipsis overflow-hidden whitespace-nowrap '> {file.owner} </td>
                            <td className='min-w-[20vw] max-w-[20vw] text-ellipsis overflow-hidden whitespace-nowrap '>  {file.createdTime} </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
}
