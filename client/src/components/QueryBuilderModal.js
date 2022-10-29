import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SnippetFolderIcon from '@mui/icons-material/SnippetFolder';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import StoreContext from '../store';
import { useContext } from 'react';


export default function QueryBuilderModal( props ) {
    const { store } = useContext(StoreContext);
    const handleClose = () => {
        console.log(store);
        props.handleQueryBuilderButton();
    }

    return(
        <div id="defaultModal" tabindex="-1" aria-hidden="true" class="h-modal fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
        <div className="relative h-full w-full max-w-2xl p-4 md:h-auto">
                <div className=" relative rounded-3xl bg-yellow-100 shadow dark:bg-gray-700 border-2 border-black">
                    

                <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                    <h3 className="text-xl font-mono font-semibold text-gray-900 dark:text-white"> Query Builder </h3>
                    <button onClick={handleClose} type="button" className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="space-y-6 p-6">
                    <p className="font-mono text-base leading-relaxed text-gray-500 dark:text-gray-400"> </p>
                    <div className="flex flex-col">
                        <div className="">owner</div>
                        <div className="">has the words</div>
                        <div className="">drive</div>
                        <div className="">creator</div>
                        <div className="">from</div>
                        <div className="">to</div>
                        <div className="">readable</div>
                        <div className="">writable</div>
                        <div className="">name</div>
                        <div className="">In Folder</div>
                        <div className="">folder</div>
                        <div className="">path</div>
                        <div className="">sharing</div>
                    </div>
                </div>
                </div>
            </div>
            </div>

    );
}