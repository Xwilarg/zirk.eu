import { forwardRef, useEffect, useRef, useState, type RefObject } from "react";
import { loadSketch, type ButtonInfo } from "./game/GameForm";
import type { AScreen } from "./screensaver/AScreen";
import loadScreenSaver from "./screensaver/ScreenSaver";

export interface LoadedGame
{
    defaultResFolder: string,
    defaultFilename: string,
    defaultEngine: string,
    defaultUnityVersion: string,
}

export interface SketchFormProps
{
    isOn: boolean,
    loadedGame: LoadedGame | string | null,
    buttons: ButtonInfo[],
    isFullscreen: boolean,
    onLoad: ((instance: RefObject<any> | null) => void) | null
}

const SketchForm = forwardRef((
    { isOn, loadedGame, buttons, isFullscreen, onLoad }: SketchFormProps,
    _
) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasRefUnity2019 = useRef<HTMLDivElement | null>(null);
    const screenSaverRef = useRef<AScreen | null>(null);
    const screenSaverDtorRef = useRef<() => void | null>(null);
    let sketchInstance = useRef<any>(null);
    let [isTrace, setIsTrace] = useState<boolean>(false); // Desktop screen
    const [sketchButtons, setSketchButtons] = useState<ButtonInfo[]>(buttons);
    let [showScreenSaver, setShowScreenSaver] = useState<boolean>(!isOn);
    let loadedScripts = useRef<HTMLScriptElement[]>([]);

    useEffect(() => {
        window.indexedDB.open = (name: string, version?: number | undefined) => { console.warn("DB access to page refused"); return null; };
    }, []);

    useEffect(() => {
        let canvasParent = canvasRef.current!.parentElement;
        canvasRef.current!.remove();
        canvasRef.current = document.createElement("canvas");
        canvasRef.current.id = "canvas";
        canvasParent!.appendChild(canvasRef.current);
        if (showScreenSaver) {
            screenSaverDtorRef.current = loadScreenSaver(canvasRef, screenSaverRef)
        } else if (loadedGame && !isTrace && typeof loadedGame !== "string") {
            loadSketch(canvasRef, sketchInstance, loadedScripts, loadedGame.defaultResFolder, loadedGame.defaultFilename, loadedGame.defaultEngine, loadedGame.defaultUnityVersion, onLoad);
        }

        return () => {
            screenSaverDtorRef.current?.();
            if (sketchInstance.current !== null) {
                try
                {
                    if (sketchInstance.current.Quit) {
                        sketchInstance.current.Quit();
                    } else {
                        alert("Unity ≤2019 requires page reload to clear context...");
                        window.location.reload();
                    }
                }
                catch
                {
                    alert("Something went wrong when leaving game, reloading the page to clear context...");
                    window.location.reload();
                }
                sketchInstance.current = null;
            }

            for (let s of loadedScripts.current!) s.remove();

            // Context imported by GB Studio
            try
            {
                // @ts-ignore
                Emulator.stop();
            } catch { }
        };
    }, [ showScreenSaver, loadedGame, isTrace ]);

    useEffect(() => {
        setShowScreenSaver(!isOn);
    }, [ isOn ]);

    useEffect(() => {
        setSketchButtons(buttons);
    }, [ buttons ]);

    let isCanvasUsed = !isOn || (loadedGame !== null && !isTrace);
    return <>
        <div className={isFullscreen ? "fullscreen" : ""} id="screen-container">
            <span className={isCanvasUsed ? "" : "hidden"} id="mainarea">
                <div ref={canvasRefUnity2019} id="canvas-unity-2019"></div>
                <canvas ref={canvasRef} id="canvas"></canvas>
                {
                    isCanvasUsed && typeof loadedGame === "string"
                    ? <div id="iframe-container"><iframe allowFullScreen={true} src={loadedGame}></iframe></div>
                    : <></>
                }
            </span>
            
        </div>
        { /* For GB Studio */ }
        <div>
            <div id="customControls"></div>
            <div id="controller"></div>
            <div id="controller_dpad"></div>
            <div id="controller_select"></div>
            <div id="controller_start"></div>
            <div id="controller_b"></div>
            <div id="controller_a"></div>
        </div>
        { /* For Unreal Engine */ }
        <div>
			<div id="fullscreen_request"></div>
        </div>
    </>
});
export default SketchForm;