import OCIntroComponent from "./components/intro/OCIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import ocsData from "../data/json/ocs.json";
import { useEffect, useState, type ReactElement } from "react";
import { isNsfw } from "./utils";

export default function OCForm() {
    const [ocsHtml, setOcsHtml] = useState<ReactElement[]>([]);
    const [imageIndexes, setImageIndexes] = useState<{ [name: string]: number }>({});

    const nsfwStatus = isNsfw();
    
    useEffect(() => {
        let data: ReactElement[] = [];

        for (const [key, value] of Object.entries(ocsData.characters))
        {
            const arts = ocsData.data.filter(x => x.character === key);
            const info = imageIndexes[key] !== undefined ? arts[imageIndexes[key]] : arts.filter(x => x.default)[0];

            let imgs: ReactElement[] = [];
            for (let i = 0; i < 3 && i < arts.length; i++)
            {
                const isImgNsfw = arts[i].images[0].nsfw;

                if (nsfwStatus === "FullSFW" && isImgNsfw) continue;

                if (nsfwStatus === "SFW" && isImgNsfw)
                {
                    imgs.push(
                        <img key={`${key}-${i}`} src={`/data/img/${arts[i].images[0].link}`} className="blur" />
                    );
                } else {
                    imgs.push(
                        <img key={`${key}-${i}`} src={`/data/img/${arts[i].images[0].link}`} onClick={() => {
                            setImageIndexes(x => ({ ...x, [key]: i }));
                        }} />
                    );
                }
            }

            let genderIcon: string;
            if (value.gender === "Male") genderIcon = "male";
            else if (value.gender === "Female") genderIcon = "female";
            else genderIcon = "transgender";
            data.push(<div className="card" key={key}>
                <h3>{key}</h3>
                <small>{info?.title}</small>
                {
                    info ?
                        <div className="project-img">
                            <a target="_blank" href={Object.entries(ocsData.artists).filter(([key, value]) => key === info.artist)[0][1]}><p className="attribution">Art by {info.artist}</p></a>
                            <img src={`/data/img/${info.images[0].link}`} />
                        </div>
                    : <></>
                }
                <div className="oc-subimg">
                    { imgs }
                </div>
                <div className="oc-content flex-columns">
                    <div className="oc-col is-flex">
                        <div className="oc-item is-flex">
                            <span className="material-symbols-outlined">globe</span>
                            <p>{value.location}</p>
                        </div>
                    </div>
                    <div className="oc-col is-flex">
                        <div className="oc-item is-flex">
                            <span className="material-symbols-outlined">{ genderIcon }</span>
                            <p>{ value.gender }</p>
                        </div>
                    </div>
                </div>
                <p className="oc-description" dangerouslySetInnerHTML={{ __html: value.description.join("<br/>") }}></p>
            </div>)
        }

        setOcsHtml(data);
    }, [ imageIndexes ]);

    return <>
        <QuoteComponent/>
        <OCIntroComponent />
        <NavigationComponent />
        <div className="container box is-flex">
            { ocsHtml }
        </div>
    </>
}