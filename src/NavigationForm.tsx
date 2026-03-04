import { Link } from "react-router";
import { getNavigation, isNsfw } from "./utils";

export default function NavigationForm() {
    const nsfwStatus = isNsfw();

    return <nav className="is-flex">
        <Link className="nav-button" to={getNavigation("/")}>Home</Link>
        <Link className="nav-button" to={getNavigation("/gamejam")}>Gamejam</Link>
        <Link className="nav-button" to={getNavigation("/project")}>Project</Link>
        { nsfwStatus == "FullSFW" ? <></> : <Link className="nav-button" to={getNavigation("/katsis")}>Katsis</Link> }
        <Link className="nav-button" to={getNavigation("/life")}>Lifeline</Link>
        <Link className="nav-button" to={getNavigation("/box")}>Boxes</Link>
        <Link className="nav-button" to={getNavigation("/info")}>Info</Link>
    </nav>
}