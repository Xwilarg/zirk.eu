import OCIntroComponent from "./components/intro/OCIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import ocsData from "../data/json/ocs.json";
import { useEffect, useState, type ReactElement } from "react";
import ImageGroupModalForm from "./modal/ImageGroupModalForm";
import { useSearchParams } from "react-router";
import OCItemForm from "./item/OCItemForm";

export default function OCForm() {
    const [ocsHtml, setOcsHtml] = useState<ReactElement[]>([]);
    const [preview, setPreview] = useState<string[] | null>(null);

    const [searchParams, setSearchParams] = useSearchParams();
    
    useEffect(() => {
        const character = searchParams.get("share")?.toUpperCase();
        const keyFilter = character !== null && Object.keys(ocsData.characters).some(x => x.toUpperCase() == character)
            ? Object.keys(ocsData.characters).find(x => x.toUpperCase() == character)
            : null;
        
        let data: ReactElement[] = [];

        for (const [key, value] of Object.entries(ocsData.characters))
        {
            if (keyFilter && key !== keyFilter) continue;

            const arts = ocsData.data.filter(x => x.character === key).sort((a, b) => new Date(b.date ?? "1970-01-01").getTime() - new Date(a.date ?? "1970-01-01").getTime());

            data.push(<OCItemForm key={key} name={key} info={value} arts={arts} keyFilter={keyFilter} setPreview={setPreview} ocsData={ocsData} />);
        }

        setOcsHtml(data);
    }, []);

    return <>
        <QuoteComponent/>
        <OCIntroComponent />
        <NavigationComponent />
        <div className="container box is-flex">
            <p className="mark">Character</p>
            { ocsHtml }
        </div>
        {
            preview !== null ?
            <ImageGroupModalForm images={preview} unsetImage={setPreview} />
            : <></>
        }
    </>
}