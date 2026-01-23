import { Link } from "react-router";
import { getNavigation } from "./utils";

export default function NavigationForm() {
    return <nav className="is-flex">
        <Link to={getNavigation("/")}>Home</Link>
        <Link to={getNavigation("/gamejam")}>Gamejam</Link>
        <Link to={getNavigation("/info")}>Info</Link>
        <Link to={getNavigation("/life")}>Lifeline</Link>
    </nav>
}