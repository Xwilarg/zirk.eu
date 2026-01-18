import { forwardRef, useEffect, useRef, useState } from "react";
import { loadSketch, type ButtonInfo } from "./impl/game/GameForm";
import type { AScreen } from "./impl/screensaver/AScreen";
import loadScreenSaver from "./impl/ScreenSaver";
import DesktopForm from "./impl/DesktopForm";

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
    loadedGame: LoadedGame | null,
    buttons: ButtonInfo[],
    isFullscreen: boolean,
    toggleDesktopModule: ((cmd: string, args: string) => boolean)
}

const SketchForm = forwardRef((
    { isOn, loadedGame, buttons, isFullscreen, toggleDesktopModule }: SketchFormProps,
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
        let canvasParent = canvasRef.current!.parentElement;
        canvasRef.current!.remove();
        canvasRef.current = document.createElement("canvas");
        canvasRef.current.id = "screen-canvas";
        canvasParent!.appendChild(canvasRef.current);
        if (showScreenSaver) {
            screenSaverDtorRef.current = loadScreenSaver(canvasRef, screenSaverRef)
        } else if (loadedGame && !isTrace) {
            loadSketch(canvasRef, sketchInstance, loadedScripts, loadedGame.defaultResFolder, loadedGame.defaultFilename, loadedGame.defaultEngine, loadedGame.defaultUnityVersion);
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
        <div className={isFullscreen ? "box fullscreen" : "box container"} id="screen-container">
            <span className={isCanvasUsed ? "" : "hidden"}>
                <div ref={canvasRefUnity2019} id="screen-canvas-unity-2019"></div>
                <canvas ref={canvasRef} id="screen-canvas"></canvas>
            </span>
            {
                !isCanvasUsed ?
                    <div id="screen-desktop">
                        <DesktopForm tracedGame={loadedGame} updateTrace={(value: boolean) => {
                            setIsTrace(value);
                        }} toggleModule={toggleDesktopModule} />
                    </div>
                    : <></>
            }
            
        </div>
        <div className="container box is-flex">
            {
                sketchButtons.filter(x => !isTrace || !x.gameViewOnly).map(x =>
                    <button className={x.iconType === "icon" ? "button-icon" : ""} key={x.name} disabled={x.disabled} onClick={() => {
                            if (x.type === "ChangeScene") sketchInstance.current!.SendMessage('LevelLoader', 'LoadScene', x.scene);
                            else if (x.type === "Custom") (x.scene as (() => void))();
                            else alert(x.scene); 
                        }}>
                        {
                            x.iconType === "icon" ? <span className="material-symbols-outlined">{x.name}</span>
                            : x.name
                        }
                    </button>
                )
            }
        </div>
        { /* For GB Studio */ }
        <div>
            <div id="controller"></div>
            <div id="controller_dpad"></div>
            <div id="controller_select"></div>
            <div id="controller_start"></div>
            <div id="controller_b"></div>
            <div id="controller_a"></div>
        </div>
    </>
});
export default SketchForm;