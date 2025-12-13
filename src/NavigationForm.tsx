import { Link, useLocation } from "react-router";

export default function NavigationForm() {
    const { search } = useLocation();
    return <nav className="is-flex">
        <Link to={`/${search}`}>Home</Link>
        <Link to={`/gamejam${search}`}>Gamejam</Link>
        <Link to={`/info${search}`}>Info</Link>
    </nav>
}