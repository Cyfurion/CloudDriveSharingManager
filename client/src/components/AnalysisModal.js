import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SnippetFolderIcon from '@mui/icons-material/SnippetFolder';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';


export default function AnalysisModal() {

    return(
        <div id="defaultModal" tabindex="-1" aria-hidden="true" class="hidden h-modal fixed top-0 right-0 left-0 z-50 w-full overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
            <div class="relative h-full w-full max-w-2xl p-4 md:h-auto">
                
                <div class=" relative rounded-3xl bg-white shadow dark:bg-gray-700 border-2 border-black">
                    

                <div class="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                    <h3 class="text-xl font-mono font-semibold text-gray-900 dark:text-white">Analysis Mode</h3>
                    <button type="button" class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                    <svg aria-hidden="true" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <div class="space-y-6 p-6">
                    <p class="font-mono text-base leading-relaxed text-gray-500 dark:text-gray-400">Select the type of analysis you would like to perform. Doing so will enable Analysis Mode in the main window. Exit this prompt to cancel Analysis Mode.</p>
                    <div class="grid grid-cols-2 grid-rows-2 gap-x-14 gap-y-8">
                    <button class="analysisbtn">
                        <ContentCopyIcon fontSize="large" />
                        <h1> Redundancy Analysis </h1>
                    </button>
                    <button class="analysisbtn">
                        <ReportProblemIcon fontSize="large"/>
                        <h1> Deviancy Analysis </h1>
                    </button>
                    <button class="analysisbtn">
                        <SnippetFolderIcon fontSize="large" />
                        <h1> File-Folder Difference </h1>
                    </button>
                    <button class="analysisbtn">
                        <CameraEnhanceIcon fontSize="large" />
                        <h1> Snapshot Changes </h1>
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </div>

    );
}