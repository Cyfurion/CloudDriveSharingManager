import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';

export default function WorkSpace( props ) {
    if (props.data === null) {
        return <div className="font-bold ">{"LOADING"} </div>;
    } else {
        return (
            <table >
                <thead className="border-b-2 border-gray-200">
                    <tr id="heading" className="filecard ">
                        <th id="heading-name" className="pl-6"> Name </th>
                        <th id="heading-owner"> Owner </th>
                        <th id="heading-dateCreated"> Date Created </th>
                    </tr>
                </thead>
                <tbody >
                    {props.data.map((file) => (
                        <tr id={file.id}  className="filecard border-b-2 hover:bg-gray-100">
                            <td className='max-w-[40vw] min-w-[40vw] text-ellipsis overflow-hidden whitespace-nowrap' >{ file.files === undefined ? <InsertDriveFileIcon /> : <FolderIcon />  }
                            <span  className={"" + (file.files !== undefined ? "underline" : "")} onClick={ file.files === undefined ? null  : (e) => props.handleClickFolder(e, file)} >{file.name}</span> </td>
                            <td className='min-w-[25vw] max-w-[25vw] whitespace-nowrap '> {file.owner} </td>
                            <td className='min-w-[20vw] max-w-[20vw] whitespace-nowrap '>  {file.createdTime} </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
