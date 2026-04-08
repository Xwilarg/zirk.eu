import { Link, useSearchParams } from "react-router";
import { getNavigationNoHook, isNsfw } from "./utils";

export default function NavigationForm() {
    const nsfwStatus = isNsfw();
    const [searchParams, setSearchParams] = useSearchParams();

    return <nav className="is-flex">
        <Link className="nav-button" to={getNavigationNoHook("/", searchParams)}>Home</Link>
        <Link className="nav-button" to={getNavigationNoHook("/gamejam", searchParams)}>Gamejam</Link>
        <Link className="nav-button" to={getNavigationNoHook("/project", searchParams)}>Project</Link>
        { nsfwStatus == "FullSFW" ? <></> : <Link className="nav-button" to={getNavigationNoHook("/katsis", searchParams)}>Katsis</Link> }
        <Link className="nav-button" to={getNavigationNoHook("/box", searchParams)}>Boxes</Link>
        <Link className="nav-button" to={getNavigationNoHook("/info", searchParams)}>Info</Link>
    </nav>
}