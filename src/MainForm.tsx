import { Link } from "react-router"
import SketchForm, { type SketchFormProps } from "./computer/SketchForm"
import NavigationForm from "./NavigationForm"
import { type ReactElement, useEffect, useState } from "react";
import sheepData from "../data/json/sheep.json"
import sketchData from "../data/json/sketch.json"
import gamejamData from "../data/json/gamejam.json"
import { getSortedGamejams } from "./GameJamForm";
import CartridgeForm, { type CartridgeType } from "./computer/CartridgeForm";
import { getNavigation, isNsfw, randInt } from "./utils";
import type { ButtonInfo } from "./computer/impl/game/GameForm";

interface SheepInfo
{
    name: string,
    image: string
}

interface CartridgeData
{
    props: SketchFormProps,
    imageUrl: string,
    type: CartridgeType
}

const quotes = [
    "Now with 20% more minipis!",
    "Still awaiting Indra new website",
    "Fighting to get a better UX than Fractal since 2023 (I'm not winning)",
    "Red and green gives yellow",
    "<a href='/secret/quote' class='ignore'>Of course you can't click this quote!</a>",
    "[object Object]",
    "My favorite ice creams are pistachio and rum raisin"
]

export default function MainForm() {
    let nsfwStatus = isNsfw();
    let [defaultCartridges, setDefaultCartridges] = useState<CartridgeData[]>([
        {
            props: {
                isOn: true,
                loadedGame: {
                    defaultResFolder: "sketch/",
                    defaultFilename: "Sketch",
                    defaultEngine: "Unity",
                    defaultUnityVersion: "6000.2.12f1"
                },
                buttons: sketchData.map(x => ({
                    name: x.name,
                    iconType: x.type,
                    scene: x.scene,
                    type: "ChangeScene",
                    disabled: false,
                    gameViewOnly: true
                })),
                isFullscreen: false
            },
            imageUrl: "/img/sketch.png",
            type: "Sketch"
        },
        ...getSortedGamejams(gamejamData.jams, "Score").filter(x => x.duration >= 24).slice(0, 5).filter(x => x.sketch !== null && (!x.nsfw || nsfwStatus === "NSFW")).map(x => ({
            props: {
                isOn: true,
                loadedGame: {
                    defaultResFolder: x.sketch!.folder,
                    defaultFilename: `Build/${x.sketch!.filename}`,
                    defaultEngine: x.engine,
                    defaultUnityVersion: x.version
                },
                buttons: [{
                    name: "help",
                    type: "GiveInfo" as const,
                    scene: `Controls:\n${x.controls.join("\n")}`,
                    iconType: "icon",
                    disabled: false,
                    gameViewOnly: true
                }],
                isFullscreen: false
            },
            imageUrl: `/data/img/gamejam/${x.name}.${x.format ?? "jpg"}`,
            type: "Gamejam" as const,
        }))
    ])

    let [isOn, setIsOn] = useState<boolean>(false);
    let [showSheep, setShowSheep] = useState<boolean>(false);
    let [sheep, setSheep] = useState<SheepInfo[]>(sheepData);
    const [computerPropsIndex, setComputerPropsIndex] = useState<number>(0);
    const [cartridges, setCartridges] = useState<ReactElement[]>([]);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    let randomQuote = randInt(quotes.length);

    const buttons: Array<ButtonInfo> = [{
        name: "power_settings_new",
        type: "Custom",
        scene: () => {
            setIsOn(x => !x)
        },
        iconType: "icon",
        disabled: false,
        gameViewOnly: false
    }, {
        name: "eject",
        type: "Custom",
        scene: () => {
            setIsOn(x =>true)
            setComputerPropsIndex(-1)
        },
        iconType: "icon",
        disabled: computerPropsIndex === -1,
        gameViewOnly: false
    }, {
        name: isFullscreen ? "fullscreen_exit" : "fullscreen",
        type: "Custom",
        scene: () => {
            setIsFullscreen(x => !x);
        },
        iconType: "icon",
        disabled: false,
        gameViewOnly: false
    }]

    useEffect(() => {
        let data: ReactElement[] = [];

        for (let i = 0; i < defaultCartridges.length; i++)
        {
            if (i === computerPropsIndex) continue;

            data.push(
                <CartridgeForm key={defaultCartridges[i].imageUrl} onClick={() => {
                    setComputerPropsIndex(i);
                    setIsOn(true);
                }} imageUrl={defaultCartridges[i].imageUrl} type={defaultCartridges[i].type} />
            );
        }

        setCartridges(data);
    }, [ computerPropsIndex ])

    return <>
        <div id="intro-top" className="container box">
            <p id="intro-quote" dangerouslySetInnerHTML={{ __html: quotes[randomQuote] }}></p>
            <div className={showSheep ? "enlarged" : ""} id="intro">
                Welcome on my website, I am Zirk, a game and software developer<br/>
                <br/>
                I am probably mostly known for <span className="katsis-highlight">Katsis</span> (which I co-created with Fractal) and <Link to={getNavigation("/gamejam")}>participating at gamejams</Link><br/>
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
        </div>
        <div className="container box">
            <NavigationForm />
        </div>
        <SketchForm
            isOn={isOn}
            loadedGame={computerPropsIndex === -1 ? null : defaultCartridges[computerPropsIndex].props.loadedGame}
            buttons={(isOn && computerPropsIndex > -1) ? [...buttons, ...defaultCartridges[computerPropsIndex].props.buttons] : buttons}
            isFullscreen={isFullscreen}
        />
        <div className="container box is-flex">
            { cartridges }
        </div>
    </> 
}