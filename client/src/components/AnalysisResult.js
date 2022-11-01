
export default function AnalysisResult(props) {

    const handleClose = () => {
        props.closeDeviancyAnalysisModal();
    }

    console.log(props.result);
    return (
        <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="h-modal fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
            <div className="relative h-full w-full max-w-2xl p-4 md:h-auto">
                <div className=" relative rounded-3xl bg-white shadow dark:bg-gray-700 border-2 border-black">


                    <div className="flex items-start justify-between border-b rounded-t p-4 dark:border-gray-600">
                        <h3 className="text-xl font-mono font-semibold text-gray-900 dark:text-white">Analysis Result</h3>
                        <button onClick={handleClose} type="button" className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                            <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>


                    </div>

                    <div className="flex flex-col p-4 ">
                        <div className="">
                            Majority Permissions:
                            {props.result.majority[0].map((permission) => (
                                <div className="flex justify-between flex-row">
                                    <h1> Role: {permission.role}</h1>
                                    <h1> Entity: {permission.entity}</h1>
                                </div>
                            ))}
                        </div>
                        <h1> Deviant Files: </h1>
                        <div className="flex accordion flex-col max-h-64 overflow-y-scroll">
                            {props.result.deviants.map((file) => (
                                <div className="accordion-item " id="accordionExample">
                                    <h1 class="accordion-header" id="headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></button>
                                        File Name: {file.name}
                                    </h1>
                                    <div div id="collapseOne" class="accordion-collapse  show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div class="accordion-body py-4 px-5">
                                            {file.permissions.map((permission) => (
                                                <div>
                                                    <h1> Role: {permission.role}</h1>
                                                    <h1> Entity: {permission.entity}</h1>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}