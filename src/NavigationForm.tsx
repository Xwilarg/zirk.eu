import { Link } from "react-router";
import { getNavigation } from "./utils";

export default function NavigationForm() {
    return <nav className="is-flex">
        <Link className="nav-button" to={getNavigation("/")}>Home</Link>
        <Link className="nav-button" to={getNavigation("/gamejam")}>Gamejam</Link>
        <Link className="nav-button" to={getNavigation("/project")}>Project</Link>
        <Link className="nav-button" to={getNavigation("/katsis")}>Katsis</Link>
        <Link className="nav-button" to={getNavigation("/life")}>Lifeline</Link>
        <Link className="nav-button" to={getNavigation("/box")}>Boxes</Link>
        <Link className="nav-button" to={getNavigation("/info")}>Info</Link>
    </nav>
}