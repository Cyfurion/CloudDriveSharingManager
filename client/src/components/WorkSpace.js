import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';

export default function WorkSpace( props ) {

    if (props.data === null) {
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
                    {props.data.map((file) => (
                        <tr id={file.id} onClick={ typeof file.files === 'undefined' ? null  : (e) => props.handleClickFolder(e, file)} className="filecard border-b-2 hover:bg-gray-100 ">
                            <td className='max-w-[40vw] text-ellipsis overflow-hidden whitespace-nowrap' >{ typeof file.files === 'undefined' ? <InsertDriveFileIcon /> : <FolderIcon />  }{file.name} </td>
                            <td className='w-[25vw] whitespace-nowrap '> {file.owner} </td>
                            <td className='w-[20vw] whitespace-nowrap '>  {file.createdTime} </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        );
    }
}
