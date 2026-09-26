import { Link, useSearchParams } from "react-router"

// @ts-ignore
import "../../css/title.css"
import { getNavigationNoHook } from "../utils";

export default function TitleForm() {
    const [searchParams] = useSearchParams();

    return <div id="title" className="text-center">
        <h1 className="text-center">Zirk</h1>
        <p>
            I'm improving the main page, but on the meantime
        </p>
        <Link to={getNavigationNoHook("/main", searchParams)}>Access main page</Link>
    </div>
}