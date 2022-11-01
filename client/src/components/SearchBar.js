import { useState } from "react";


export default function SearchBar( props ) {
    const [clearButton , setClearButton] = useState(false);

    const handleSubmit = (e) =>{
        if( document.querySelector('#default-searchbar').value.length !== 0){
            if (e.key === 'Enter') {
                props.handleQuery(document.querySelector('#default-searchbar').value);
            }
        }
    }

    const handleSearchIcon = (e) => {
        e.preventDefault();
        if( document.querySelector('#default-searchbar').value.length !== 0 ){
            props.handleQuery(document.querySelector('#default-searchbar').value);
        }
    }

    const handleClearSearch = (e) => {
        e.preventDefault();
        document.querySelector('#default-searchbar').value = "";
        setClearButton(false);
    }

    const handleQueryBuilder = (e) =>{
        e.preventDefault();
        props.handleQueryBuilderButton();
    }

    const handleShowClear = () =>{
        if(document.querySelector('#default-searchbar').value.length === 0)
            setClearButton(false);
        else
            setClearButton(true);
    }

    return (
    <div className="flex w-6/12 bg-gray-100 rounded-md border p-1 border-black ">
        <div className="flex p-1 rounded-full hover:bg-gray-300">
            <button onClick={handleSearchIcon} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </button>
        </div>

        <input onChange={handleShowClear} onKeyDown={handleSubmit} name='q' id="default-searchbar" className="w-full mx outline-0 bg-inherit " type='text' placeholder="Search in Drive"/>

        <div style={{visibility : clearButton ? 'visible' : 'hidden'}}className="flex p-1 rounded-full hover:bg-gray-300">
            <button onClick={handleClearSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="flex p-1 rounded-full hover:bg-gray-300">
            <button onClick={handleQueryBuilder}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
            </button>
        </div>
    </div>
    );
}
