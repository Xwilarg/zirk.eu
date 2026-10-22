import { useEffect, useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import QuoteComponent from "../components/QuoteComponent";

import OCBox from "../boxes/impl/OCBox";
import ImageGroupModalForm, { type ImageGroupModalInfo } from "../components/modal/ImageGroupModalForm";
import GenericBox from "../boxes/GenericBox";
import { useApi } from "../api/useApi";
import type { OCInfo } from "../models/api/OC";

export default function OCform() {
    const api = useApi();

    const [preview, setPreview] = useState<ImageGroupModalInfo | null>(null);
    const [showMore, setShowMore] = useState<boolean>(false);
    const [info, setInfo] = useState<OCInfo>({ artists: {}, ocs: [] });

    useEffect(() => {
        api.getOCs().then(x => setInfo(x));
    }, []);

    return <>
        <QuoteComponent />
        <NavbarComponent />
        <div className="is-flex flex-center-hor">
            {
                info.ocs.filter(x => x.metadata.folder !== null).sort(x => x.images!.length).map(x => <OCBox key={x.name} item={x} setPreview={setPreview} artists={info.artists} />)
            }
            {
                showMore ?
                    info.ocs.filter(x => x.metadata.folder === null).map(x => <GenericBox name={x.name} text={x.metadata.description!.join("\n\n")} nsfw={false} />)
                    : <></>
            }
        </div>
        {
            preview !== null ?
            <ImageGroupModalForm images={preview.data} unsetImage={setPreview} creditName={preview.creditName} creditUrl={preview.creditUrl} />
            : <></>
        }
    </>
}