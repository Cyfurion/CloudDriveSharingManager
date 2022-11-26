import { useContext } from 'react';
import StoreContext from '../store';
import { FileCard } from './';

export default function WorkSpace(props) {
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
                            style={{ visibility: props.visible ? 'visible' : 'hidden' }} //
                        />
                    </th>
                    <th id="heading-name" className="pl-6"> Name </th>
                    <th id="heading-owner"> Owner </th>
                    <th id="heading-dateCreated"> Date Created </th>
                </tr>
            </thead>
            <tbody >
                {props.data.map((file) => (
                    <FileCard 
                        key={file.id}
                        file={file}
                        visible={props.visible}
                        handleFileCheckBox={props.handleFileCheckBox}
                        handleClickFolder={props.handleClickFolder} />
                ))}
            </tbody>
        </table>
    );
}
