import { SearchBar,QueryBuilderButton, LogOutButton, AppLogo } from "./";

export default function UserNavBar( props ) {
    return (
        <div className="flex flex-nowrap justify-between p-3">
            <div>
                <AppLogo />
            </div>
            <div className="flex gap-x-3">
                <SearchBar operator={props.operator} handleQuery={props.handleQuery}/>
                <QueryBuilderButton fillSearch={props.fillSearch}
                                    handleQueryBuilderButton={props.handleQueryBuilderButton}/>
            </div>
            <div>
                <LogOutButton />
            </div>
        </div>
    );
}
