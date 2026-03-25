import SketchForm, { type SketchFormProps } from "./computer/SketchForm"
import { type ReactElement, useEffect, useState } from "react";
import sketchData from "../data/json/sketch.json"
import gamejamData from "../data/json/gamejam.json"
import { getSortedGamejams } from "./GameJamForm";
import CartridgeForm, { type CartridgeType } from "./computer/CartridgeForm";
import { isNsfw } from "./utils";
import type { ButtonInfo } from "./computer/impl/game/GameForm";
import MainIntroComponent from "./components/intro/MainIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
interface CartridgeData
{
    props: SketchFormProps,
    imageUrl: string,
    type: CartridgeType
}

export default function MainForm() {
    let nsfwStatus = isNsfw();
    let [defaultCartridges, setDefaultCartridges] = useState<CartridgeData[]>([
        {
            props: {
                isOn: true,
                loadedGame: {
                    defaultResFolder: "projects/sketch/",
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
                onLoad: null,
            },
            imageUrl: "/img/sketch.png",
            type: "Sketch"
        },{
            props: {
                isOn: true,
                loadedGame: {
                    defaultResFolder: "projects/gameName/",
                    defaultFilename: "GameNameWebGL",
                    defaultEngine: "Unity",
                    defaultUnityVersion: "6000.3.10f1"
                },
                buttons: [],
                isFullscreen: false,
                onLoad: null,
            },
            imageUrl: "/img/gameName.png",
            type: "Project"
        },
        ...getSortedGamejams(gamejamData.jams, "Score").filter(x => x.duration >= 24).slice(0, 5).filter(x => x.sketch !== null && (!x.nsfw || nsfwStatus === "NSFW")).map(x => ({
            props: {
                isOn: true,
                loadedGame: {
                    defaultResFolder: x.sketch!.folder,
                    defaultFilename: x.sketch!.filename as string,
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
                onLoad: null,
            },
            imageUrl: `/data/img/gamejam/${x.name}.${x.format ?? "jpg"}`,
            type: "Gamejam" as const,
        }))
    ])

    let [isOn, setIsOn] = useState<boolean>(false);
    const [computerPropsIndex, setComputerPropsIndex] = useState<number>(0);
    const [cartridges, setCartridges] = useState<ReactElement[]>([]);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const allowedModules = [ "introduction", "navigation", "cartridges", "lifeline" ]

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
            setIsOn(x => true)
            setComputerPropsIndex(-1)
        },
        iconType: "icon",
        disabled: computerPropsIndex === -1,
        gameViewOnly: false
    }, {
        name: isFullscreen ? "collapse_content" : "expand_content",
        type: "Custom",
        scene: () => {
            setIsFullscreen(x => !x);
        },
        iconType: "icon",
        disabled: false,
        gameViewOnly: true
    }, {
        name: "fullscreen",
        type: "Fullscreen",
        scene: () => {},
        iconType: "icon",
        disabled: !isOn || computerPropsIndex === -1,
        gameViewOnly: true
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
    }, [ computerPropsIndex ]);

    useEffect(() => {
        window.isNsfw = nsfwStatus === "NSFW";
    }, []);

    return <>
        <QuoteComponent />
        <MainIntroComponent />
        <NavigationComponent />
        <SketchForm
            isOn={isOn}
            loadedGame={computerPropsIndex === -1 ? null : defaultCartridges[computerPropsIndex].props.loadedGame}
            buttons={(isOn && computerPropsIndex > -1) ? [...buttons, ...defaultCartridges[computerPropsIndex].props.buttons] : buttons}
            isFullscreen={isFullscreen}
            onLoad={computerPropsIndex === -1 ? null : defaultCartridges[computerPropsIndex].props.onLoad}
        />
        <div className="container box">
            <p className="mark">Cartridges</p>
            <div className="is-flex">
                { cartridges }
            </div>
        </div>
    </> 
}