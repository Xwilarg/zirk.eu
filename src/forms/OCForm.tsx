import { useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import QuoteComponent from "../components/QuoteComponent";

import artists from "../../data/json/ocs/artists.json"
import jsonSanara from "../../data/json/ocs/sanara.json"
import jsonZirk from "../../data/json/ocs/zirk.json"
import jsonYuzu from "../../data/json/ocs/yuzu.json"
import jsonFish from "../../data/json/ocs/fish.json"
import jsonFainir from "../../data/json/ocs/fainir.json"
import OCBox from "../boxes/impl/OCBox";
import ImageGroupModalForm, { type ImageGroupModalInfo } from "../components/modal/ImageGroupModalForm";

export default function OCform() {
    const [preview, setPreview] = useState<ImageGroupModalInfo | null>(null);
    const characters = [
        jsonSanara, jsonZirk, jsonYuzu, jsonFish, jsonFainir
    ]

    return <>
        <QuoteComponent />
        <NavbarComponent />
        <div className="is-flex flex-center-hor">
            <h2>OCs</h2>
        </div>
        <div className="is-flex flex-center-hor">
            {
                characters.sort(x => x.images.length).map(x => <OCBox item={x} setPreview={setPreview} artists={artists} />)
            }
        </div>
        {
            preview !== null ?
            <ImageGroupModalForm images={preview.data} unsetImage={setPreview} creditName={preview.creditName} creditUrl={preview.creditUrl} />
            : <></>
        }
    </>
}