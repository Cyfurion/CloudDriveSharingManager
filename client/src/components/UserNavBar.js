import { SearchBar, QueryBuilderButton, LogOutButton, AppLogo } from "./";
export default function UserNavBar() {
    return (
        <div className="flex flex-nowrap justify-between p-3">
            <div>
                <AppLogo />
            </div>
            <div className="flex">
                <SearchBar />
                <QueryBuilderButton />
            </div>
            <div>
                <LogOutButton />
            </div>
        </div>
    );
}
