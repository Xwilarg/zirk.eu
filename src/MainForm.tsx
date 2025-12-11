import { Link } from "react-router"
import SketchForm, { type SketchFormProps } from "./computer/SketchForm"
import NavigationForm from "./NavigationForm"
import { type ReactElement, useEffect, useState } from "react";
import sheepData from "../data/json/sheep.json"
import sketchData from "../data/json/sketch.json"
import gamejamData from "../data/json/gamejam.json"
import { getSortedGamejams } from "./GameJamForm";
import CartridgeForm from "./computer/CartridgeForm";
import { isNsfw } from "./utils";

interface SheepInfo
{
    name: string,
    image: string
}

interface CartridgeData
{
    props: SketchFormProps,
    imageUrl: string,
    color: string
}

export default function MainForm() {
    let nsfwStatus = isNsfw();
    let [defaultCartridges, setDefaultCartridges] = useState<CartridgeData[]>([
        {
            props: {
                isOn: true,
                defaultResFolder: "sketch/",
                defaultFilename: "Sketch",
                defaultEngine: "Unity",
                defaultUnityVersion: "6000.2.12f1",
                buttons: sketchData
            },
            imageUrl: "/img/sketch.png",
            color: "green"
        },
        ...getSortedGamejams(gamejamData.jams, "Score").slice(0, 5).filter(x => x.sketch !== null && (!x.nsfw || nsfwStatus === "NSFW")).map(x => ({
            props: {
                isOn: true,
                defaultResFolder: x.sketch!.folder,
                defaultFilename: `Build/${x.sketch!.filename}`,
                defaultEngine: x.engine,
                defaultUnityVersion: x.version,
                buttons: []
            },
            imageUrl: `/data/img/gamejam/${x.name}.${x.format ?? "jpg"}`,
            color: "blue"
        }))
    ])

    let [isUsingDefaultCartridge, setIsUsingDefaultCartridge] = useState<boolean>(true);
    let [showSheep, setShowSheep] = useState<boolean>(false);
    let [sheep, setSheep] = useState<SheepInfo[]>(sheepData);
    const [computerPropsIndex, setComputerPropsIndex] = useState<number>(0);
    const [cartridges, setCartridges] = useState<ReactElement[]>([]);

    useEffect(() => {
        let data: ReactElement[] = [];

        for (let i = 0; i < defaultCartridges.length; i++)
        {
            if (i === computerPropsIndex) continue;

            data.push(
                <CartridgeForm key={defaultCartridges[i].imageUrl} onClick={() => {
                    setComputerPropsIndex(i);
                    setIsUsingDefaultCartridge(false);
                }} imageUrl={defaultCartridges[i].imageUrl} color={defaultCartridges[i].color} />
            );
        }

        setCartridges(data);
    }, [ computerPropsIndex ])

    return <>
        <NavigationForm />
        <div className={showSheep ? "container box enlarged" : "container box"} id="intro">
            Welcome on my website, I am Zirk, a game and software developer<br/>
            <br/>
            I am probably mostly known for <span className="katsis-highlight">Katsis</span> (which I co-created with Fractal) and <Link to="/gamejam">participating at gamejams</Link><br/>
            I like lot of others little hobbies that I might hide around on this website at a future date<br/>
            <br/>
            And speaking of this website, ta-da here you are, it's still a big work in progress but hopefully it should come closer to an aesthetic I like<br/>
            On the meantime, I hope you enjoy your stay here :)<br/>
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
                                    <p>{x.name}</p>
                                    <img src={`/data/img/sheep/${x.image}`} />
                                </div>
                            )
                        }
                    </div>
                </>
                : <></>
            }
        </div>
        <SketchForm
            isOn={isUsingDefaultCartridge ? false : defaultCartridges[computerPropsIndex].props.isOn}
            defaultResFolder={defaultCartridges[computerPropsIndex].props.defaultResFolder}
            defaultFilename={defaultCartridges[computerPropsIndex].props.defaultFilename}
            defaultEngine={defaultCartridges[computerPropsIndex].props.defaultEngine}
            defaultUnityVersion={defaultCartridges[computerPropsIndex].props.defaultUnityVersion}
            buttons={defaultCartridges[computerPropsIndex].props.buttons}
        />
        <div className="container box is-flex">
            { cartridges }
        </div>
    </> 
}