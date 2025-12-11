import { Link } from "react-router";

export default function NavigationForm() {
    return <nav className="is-flex">
        <Link to="/">Home</Link>
        <Link to="/gamejam">Gamejam</Link>
        <Link to="/info">Info</Link>
    </nav>
}