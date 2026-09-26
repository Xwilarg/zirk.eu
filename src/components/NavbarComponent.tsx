import { Link, useSearchParams } from "react-router";
import { getNavigationNoHook } from "../utils";

export interface Navigation
{
    label: string
    to: string
}

export const NavigationLinks: Navigation[] = [{
    label: "Gamejam",
    to: "/gamejam"
}, {
    label: "Projects",
    to: "/project"
}, {
    label: "Games",
    to: "/game"
}, {
    label: "OCs",
    to: "/oc"
}, {
    label: "Info",
    to: "/info"
}]

export default function NavbarComponent() {
    const [searchParams] = useSearchParams();
    return <div>
        <Link to={getNavigationNoHook("/main", searchParams)} rel="me">Back</Link>
    </div>
}
