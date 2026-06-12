import { forwardRef, useState, type ReactElement } from "react";
import { isNsfw } from "../utils";

interface OCItemFormProps
{
    info: OCInfo
    arts: OCArt[]
    name: string
    keyFilter: boolean
    setPreview: React.Dispatch<React.SetStateAction<string[] | null>>
    ocsData: any
}

interface OCArt
{
    character: string
    title: string
    with: string[]
    artist: string
    date: string
    folder: string
    default?: boolean
    images: OCArtImage[]
    type?: string
}

interface OCArtImage
{
    link: string
    nsfw: boolean
    default: boolean
}

interface OCInfo
{
    coauthors: string[]
    gender: string
    location: string
    folder: string
    description: string[]
    history: string[]
    personality: string[]
    sexuality: string[]
    height: number
    species: string
    orientation: string
    power: string
}

type DescriptionType = "Description" | "History" | "Personality" | "Sexuality";

const OCItemForm = forwardRef((
    { info, arts, name, keyFilter, setPreview, ocsData }: OCItemFormProps,
    _
) => {
    const [index, setIndex] = useState(arts.indexOf(arts.filter(x => x.default)[0]));
    const [desc, setDesc] = useState<DescriptionType>("Description");

    const nsfwStatus = isNsfw();

    let imgs: ReactElement[] = [];
    for (let i = 0; i < arts.length; i++)
    {
        const isImgNsfw = arts[i].images.find(x => x.default)!.nsfw;

        if (nsfwStatus === "FullSFW" && isImgNsfw) continue;

        const link = info ? `${arts[i].images.find(x => x.default)!.link}` : null;
        const isVideo = link?.endsWith("mp4");
        const smallImage = info ? `/data/${isVideo ? "img" : "previews"}/ocs/${info.folder}/${link}` : null;
        if (nsfwStatus === "SFW" && isImgNsfw)
        {
            imgs.push(
                <div className="oc-subimg-container" key={`${name}-${i}`}>
                    <img src={smallImage!} className="blur" />
                </div>
            );
        } else if (isVideo) {
            imgs.push(
                <div className="oc-subimg-container" key={`${name}-${i}`}>
                    <video src={smallImage!} onClick={() => {
                        setIndex(i);
                    }} />
                </div>
            );
        } else {
            imgs.push(
                <div className="oc-subimg-container" key={`${name}-${i}`}>
                    <img src={smallImage!} onClick={() => {
                        setIndex(i);
                    }} />
                </div>
            );
        }
    }

    let genderIcon: string;
    if (info.gender === "Male") genderIcon = "male";
    else if (info.gender === "Female") genderIcon = "female";
    else genderIcon = "transgender";

    const image = arts.length > 0 ? `/data/previews/ocs/${info.folder}/${arts[index].images.find(x => x.default)!.link}` : null;
    const imgInfo = arts[index];

    let targetDesc: string[] = [];
    if (desc === "Description") targetDesc = info.description;
    else if (desc === "History") targetDesc = info.history ?? [];
    else if (desc === "Personality") targetDesc = info.personality ?? [];
    else if (desc === "Sexuality") targetDesc = info.sexuality ?? [];

    return (
        <div className={keyFilter ? "card oc-focus oc-card" : "card oc-card"}>
        <div>
            <h3>{name} { info.coauthors.length > 0 ? `(with ${info.coauthors.join()})` : "" }</h3>
            <small>{imgInfo?.title}</small>
            <div className="project-img">
            {
                imgInfo ?
                    <>
                        <a target="_blank" href={Object.entries(ocsData.artists).filter(([key, value]) => key === imgInfo.artist)[0][1]!}>
                            <p className="attribution">Art by {imgInfo.artist}</p>
                        </a>
                        <span className="material-symbols-outlined oc-full-hint">open_in_full</span>
                        {
                            image!.endsWith("mp4") ?
                            <video src={image!} autoPlay loop muted></video>
                            : <img className={imgInfo.type === "pixel" ? "pixel clickable" : "clickable"} src={image!}
                                onClick={e => setPreview(imgInfo.images.filter(x => nsfwStatus === "NSFW" || !x.nsfw).map(x => `/data/img/ocs/${info.folder}/${x.link}`))}
                            />
                        }
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
                        <p>{info.location}</p>
                    </div>
                </div>
                <div className="oc-col is-flex">
                    <div className="oc-item is-flex">
                        <span className="material-symbols-outlined">{ genderIcon }</span>
                        <p>{ info.gender }</p>
                    </div>
                </div>
                <div className="oc-col is-flex">
                    <div className="oc-item is-flex">
                        <span className="material-symbols-outlined">height</span>
                        <p>{ (info.height / 100).toFixed(2) }m</p>
                    </div>
                </div>
                <div className="oc-col is-flex">
                    <div className="oc-item is-flex">
                        <span className="material-symbols-outlined">explicit</span>
                        <p>{ info.orientation }</p>
                    </div>
                </div>
                <div className="oc-col is-flex">
                    <div className="oc-item is-flex">
                        <span className="material-symbols-outlined">person</span>
                        <p>{ info.species }</p>
                    </div>
                </div>
                {
                    info.power ?
                    <div className="oc-col is-flex">
                        <div className="oc-item is-flex">
                            <span className="material-symbols-outlined">visibility</span>
                            <p>{ info.power }</p>
                        </div>
                    </div>
                    : <></>
                }
            </div>
        </div>
        <div className="is-flex oc-buttons">
            <button onClick={() => setDesc("Description")} disabled={desc === "Description"}>Description</button>
            <button onClick={() => setDesc("History")} disabled={desc === "History"}>History</button>
            <button onClick={() => setDesc("Personality")} disabled={desc === "Personality"}>Personality</button>
            {
                nsfwStatus === "NSFW"
                ? <button onClick={() => setDesc("Sexuality")} disabled={desc === "Sexuality"}>Sexuality</button>
                : <></>
            }
        </div>
        <p className="oc-description" dangerouslySetInnerHTML={{ __html: targetDesc.join("<br/>") }}></p>
    </div>)
});

export default OCItemForm;