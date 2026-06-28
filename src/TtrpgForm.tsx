import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import { useEffect, useState, type ReactElement } from "react";
import TtrpgIntroComponent from "./components/intro/TtrpgIntroComponent";

export default function TtrpgForm() {
    const [tabIndex, setTabIndex] = useState<number>(0)

    return <>
        <QuoteComponent/>
        <TtrpgIntroComponent />
        <NavigationComponent />
        <div className="container box is-flex" id="ttrpg">
            <p className="mark">TTRPG</p>

            <embed src="/files/ttrpg/character_sheet.pdf" width="500" height="375" type="application/pdf"></embed>
        </div>
    </>
}