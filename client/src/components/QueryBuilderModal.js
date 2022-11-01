
export default function QueryBuilderModal( props ) {

    const handleClose = () => {
        props.handleQueryBuilderButton();
    }
    const handleClear = () => {
        document.querySelector('#qbsearchbar').value = "";
    }

    const handleSubmit = () => {
        props.fillSearch(document.querySelector('#qbsearchbar').value);
    }

    const handleAddButton = (e, id) => {
        e.stopPropagation();
        let query = document.querySelector(id).value;
        if(query.length !== 0){
            let queryBuilder = id.substring(1, id.length) + ":\""+query + "\"";
            let currentQuery = document.querySelector('#qbsearchbar').value;
            if(currentQuery.length === 0)
                document.querySelector('#qbsearchbar').value = queryBuilder;
            else
                document.querySelector('#qbsearchbar').value = currentQuery + " " + queryBuilder;
            
            document.querySelector(id).value = "";
        }
    }

    return(
        <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="h-modal fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
        <div className="relative h-full w-full max-w-2xl p-4 md:h-auto">
                <div className="relative rounded-3xl bg-yellow-100 shadow dark:bg-gray-700 border-2 border-black">
                    

                <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                    <h3 className="text-xl font-mono font-semibold text-gray-900 dark:text-white"> Query Builder </h3>
                    <button onClick={handleClose} type="button" className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="space-y-6 p-6">
                    <div className="flex justify-center">
                        <input className="p-1 w-full border-2 rounded-lg border-black" type='text' id="qbsearchbar"placeholder='Build your query'/>
                    </div>
                    <div className="flex justify-center gap-x-2">
                        <button onClick={handleSubmit} className="qbbtn"> Submit</button>
                        <button onClick={handleClear}className="bg-red-300 rounded-lg border-2 border-black font-bold px-2"> Clear</button>
                    </div>

                    <div className="flex flex-col items-center gap-y-3">
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="owner" className="font-bold"> Owner: </label>
                            <input placeholder="user" className="qbtextfield" type='text' id="owner"/>
                            <button onClick={(e)=> handleAddButton(e, '#owner')} className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="contains" className="font-bold"> Has the words: </label>
                            <input className="qbtextfield" type='text' id="contains"/>
                            <button onClick={(e)=> handleAddButton(e, '#contains')} className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="drive" className="font-bold"> Drive: </label>
                            <input placeholder="drive" className="qbtextfield" type='text' id="drive"/>
                            <button onClick={(e)=> handleAddButton(e, '#drive')} className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="creator" className="font-bold"> Creator: </label>
                            <input placeholder="user" className="qbtextfield" type='text' id="creator"/>
                            <button onClick={(e)=> handleAddButton(e, '#creator')}className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="from" className="font-bold"> From: </label>
                            <input placeholder="user" className="qbtextfield" type='text' id="from"/>
                            <button onClick={(e)=> handleAddButton(e, '#from')} className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="to" className="font-bold"> To: </label>
                            <input placeholder="user" className="qbtextfield" type='text' id="to"/>
                            <button onClick={(e)=> handleAddButton(e, '#to')} className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="readable" className="font-bold"> Readable: </label>
                            <input placeholder="user" className="qbtextfield" type='text' id="readable"/>
                            <button onClick={(e)=> handleAddButton(e, '#readable')} className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="writable" className="font-bold"> Writable: </label>
                            <input placeholder="user" className="qbtextfield" type='text' id="writable"/>
                            <button onClick={(e)=> handleAddButton(e, '#writable')} className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="name" className="font-bold"> Name: </label>
                            <input placeholder="regex" className="qbtextfield" type='text' id="name"/>
                            <button onClick={(e)=> handleAddButton(e, '#name')} className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="infolder" className="font-bold"> In Folder: </label>
                            <input placeholder="regex" className="qbtextfield" type='text' id="infolder"/>
                            <button onClick={(e)=> handleAddButton(e, '#infolder')} className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="folder" className="font-bold"> Folder: </label>
                            <input placeholder="regex" className="qbtextfield" type='text' id="folder"/>
                            <button onClick={(e)=> handleAddButton(e, '#folder')} className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="path" className="font-bold"> Path: </label>
                            <input placeholder="path" className="qbtextfield" type='text' id="path"/>
                            <button onClick={(e)=> handleAddButton(e, '#path')} className="qbbtn"> Add </button>
                        </div>
                        <div className="flex flex-row items-center gap-x-8">
                            <label htmlFor="sharing" className="font-bold"> Sharing: </label>
                            <input placeholder="none, anyone, user, domain" className="qbtextfield" type='text' id="sharing"/>
                            <button onClick={(e)=> handleAddButton(e, '#sharing')} className="qbbtn"> Add </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </div>

    );
}