import SketchForm, { type SketchFormProps } from "./computer/SketchForm"
import NavigationForm from "./NavigationForm"
import { type ReactElement, useEffect, useState } from "react";
import sketchData from "../data/json/sketch.json"
import gamejamData from "../data/json/gamejam.json"
import { getSortedGamejams } from "./GameJamForm";
import CartridgeForm, { type CartridgeType } from "./computer/CartridgeForm";
import { isNsfw, randInt } from "./utils";
import type { ButtonInfo } from "./computer/impl/game/GameForm";
import IntroComponent from "./components/IntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import LifelineComponent from "./components/LifelineComponent";
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
    "[object Object]"
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
                isFullscreen: false,
                toggleDesktopModule: () => { return false; }
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
                isFullscreen: false,
                toggleDesktopModule: () => { return false; }
            },
            imageUrl: `/data/img/gamejam/${x.name}.${x.format ?? "jpg"}`,
            type: "Gamejam" as const,
        }))
    ])

    let [isOn, setIsOn] = useState<boolean>(false);
    const [computerPropsIndex, setComputerPropsIndex] = useState<number>(0);
    const [cartridges, setCartridges] = useState<ReactElement[]>([]);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    let randomQuote = randInt(quotes.length);

    const allowedModules = [ "introduction", "navigation", "cartridges", "lifeline" ]
    const [modules, setModules] = useState<string[]>([ "introduction", "navigation", "cartridges" ]);

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
        <div id="intro-top">
            <p id="intro-quote" dangerouslySetInnerHTML={{ __html: quotes[randomQuote] }}></p>
        </div>
        {
            modules.includes("introduction") ? <IntroComponent /> : <></>
        }
        {
            modules.includes("navigation") ? <NavigationComponent /> : <></>
        }
        <SketchForm
            isOn={isOn}
            loadedGame={computerPropsIndex === -1 ? null : defaultCartridges[computerPropsIndex].props.loadedGame}
            buttons={(isOn && computerPropsIndex > -1) ? [...buttons, ...defaultCartridges[computerPropsIndex].props.buttons] : buttons}
            isFullscreen={isFullscreen}
            toggleDesktopModule={(cmd: string, args: string) => {
                if (cmd === "module") {
                    const lowerArgs = args.toLowerCase();
                    if (allowedModules.includes(lowerArgs))
                    {
                        setModules(x => {
                            if (x.includes(lowerArgs)) x.splice(x.indexOf(lowerArgs), 1);
                            else x.push(lowerArgs);
                            return [...x];
                        });
                        return true;
                    }
                    return false;
                }
                return false;
            }}
        />
        {
            modules.includes("cartridges") ? 
                <div className="container box">
                    <p className="mark">Cartridges</p>
                    <div className="is-flex">
                        { cartridges }
                    </div>
                </div>
                : <></>
        }
        {
            modules.includes("lifeline") ? <LifelineComponent /> : <></>
        }
    </> 
}