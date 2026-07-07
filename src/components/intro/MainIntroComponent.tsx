import { Link, useSearchParams } from "react-router"
import { useState } from "react";
import sheepData from "../../../data/json/sheep.json"
import { getNavigationNoHook } from "../../utils";
import ImageModalForm from "../../modal/ImageModalForm";

interface SheepLinkInfo
{
    name: string
    value: string
}

interface SheepInfo
{
    name: string
    image: string
    link: SheepLinkInfo
}

interface MainIntroComponentProps
{
    preview: string | null
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
}

export default function MainIntroComponent({preview, setPreview}: MainIntroComponentProps) {
    let [showSheep, setShowSheep] = useState<boolean>(false);
    let [sheep, setSheep] = useState<SheepInfo[]>(sheepData);
    const [searchParams, setSearchParams] = useSearchParams();

    return <div className="container box">
        <p className="mark">Introduction</p>
        <div className={showSheep ? "enlarged" : ""} id="intro">
            <h3>Welcome on <span className="gradient-highlight">my amazing website</span>, I am Zirk, a game and software developer<br/></h3>
            <br/>
            I am probably mostly known for <span className="katsis-highlight">Katsis</span> (which I co-created with Fractal) and <Link to={getNavigationNoHook("/gamejam", searchParams)}>participating at gamejams</Link><br/>
            <br/>
            I overall like to work on lot of different projects, this website being on of them!<br/>
            There are plenty to look around so I hope you enjoy your time here :)<br/>
            <br/>
            If you scrolled down there, why not contributing to my <a onClick={_ => setShowSheep(x => !x)}>sheep collection</a>?<br/>
            Send me your best drawn sheep at <a href="mailto:xwilarg@protonmail.com">xwilarg@protonmail.com</a> or on Discord (zirk)<br/>
            {
                showSheep ?
                <>
                    <br/>
                    <div className="is-flex">
                        {
                            sheep.map(x =>
                                <div className="sheep-img" key={x.name}>
                                    {
                                        x.link.value.startsWith("https://")
                                        ? <a className="ignore" target="_blank" href={x.link.value}><p>{x.name}</p></a>
                                        : <p onClick={() => { alert(`${x.link.name}: ${x.link.value}`); }}>{x.name}</p>
                                    }
                                    <img src={`/data/img/sheep/${x.image}`} onClick={() => setPreview(`/data/img/sheep/${x.image}`)} />
                                </div>
                            )
                        }
                    </div>
                </>
                : <></>
            }
        </div>
        {
            preview !== null ?
            <ImageModalForm image={preview} unsetImage={setPreview} />
            : <></>
        }
    </div>
}
