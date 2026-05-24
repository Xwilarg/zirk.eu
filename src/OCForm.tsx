import OCIntroComponent from "./components/intro/OCIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import ocsData from "../data/json/ocs.json";
import { useEffect, useState, type ReactElement } from "react";
import { isNsfw } from "./utils";
import ImageGroupModalForm from "./modal/ImageGroupModalForm";

export default function OCForm() {
    const [ocsHtml, setOcsHtml] = useState<ReactElement[]>([]);
    const [imageIndexes, setImageIndexes] = useState<{ [name: string]: number }>({});
    const [preview, setPreview] = useState<string[] | null>(null);

    const nsfwStatus = isNsfw();
    
    useEffect(() => {
        let data: ReactElement[] = [];

        for (const [key, value] of Object.entries(ocsData.characters))
        {
            const arts = ocsData.data.filter(x => x.character === key).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const info = imageIndexes[key] !== undefined ? arts[imageIndexes[key]] : arts.filter(x => x.default)[0];

            let imgs: ReactElement[] = [];
            for (let i = 0; i < arts.length; i++)
            {
                const isImgNsfw = arts[i].images[0].nsfw;

                if (nsfwStatus === "FullSFW" && isImgNsfw) continue;

                const smallImage = info ? `/data/img/ocs/${value.folder}/${arts[i].images.find(x => x.default)!.link}` : null;
                if (nsfwStatus === "SFW" && isImgNsfw)
                {
                    imgs.push(
                        <div className="oc-subimg-container">
                            <img key={`${key}-${i}`} src={smallImage!} className="blur" />
                        </div>
                    );
                } else {
                    imgs.push(
                        <div className="oc-subimg-container">
                            <img key={`${key}-${i}`} src={smallImage!} onClick={() => {
                                setImageIndexes(x => ({ ...x, [key]: i }));
                            }} />
                        </div>
                    );
                }
            }

            let genderIcon: string;
            if (value.gender === "Male") genderIcon = "male";
            else if (value.gender === "Female") genderIcon = "female";
            else genderIcon = "transgender";

            const image = info ? `/data/img/ocs/${value.folder}/${info.images.find(x => x.default)!.link}` : null;

            data.push(<div className="card" key={key}>
                <h3>{key}</h3>
                <small>{info?.title}</small>
                <div className="project-img">
                {
                    info ?
                        <>
                            <a target="_blank" href={Object.entries(ocsData.artists).filter(([key, value]) => key === info.artist)[0][1]}><p className="attribution">Art by {info.artist}</p></a>
                            <img className={info.type === "pixel" ? "pixel clickable" : "clickable"} src={image!}
                                onClick={e => setPreview(info.images.map(image => `/data/img/ocs/${value.folder}/${image.link}`))}
                            />
                        </>
                    : <></>
                }
                </div>
                <div className="oc-subimg is-flex">
                    { imgs }
                </div>
                <div className="oc-content is-flex flex-columns">
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
                    {
                        value.power ?
                        <div className="oc-col is-flex">
                            <div className="oc-item is-flex">
                                <span className="material-symbols-outlined">visibility</span>
                                <p>{ value.power }</p>
                            </div>
                        </div>
                        : <></>
                    }
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