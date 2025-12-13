import { forwardRef, useEffect, useRef, useState } from "react";
import { loadSketch, type ButtonInfo } from "./impl/game/GameForm";
import type { AScreen } from "./impl/screensaver/AScreen";
import loadScreenSaver from "./impl/ScreenSaver";

export interface SketchFormProps
{
    isOn: boolean,
    defaultResFolder: string,
    defaultFilename: string,
    defaultEngine: string,
    defaultUnityVersion: string,
    buttons: ButtonInfo[]
}

const SketchForm = forwardRef((
    { isOn, defaultResFolder, defaultFilename, defaultEngine, defaultUnityVersion, buttons }: SketchFormProps,
    _
) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasRefUnity2018 = useRef<HTMLDivElement | null>(null);
    const screenSaverRef = useRef<AScreen | null>(null);
    const screenSaverDtorRef = useRef<() => void | null>(null);
    let sketchInstance = useRef<any>(null);
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
        } else {
            screenSaverDtorRef.current?.();
            screenSaverDtorRef.current = null;
            try
            {
                loadSketch(canvasRef, sketchInstance, loadedScripts, defaultResFolder, defaultFilename, defaultEngine, defaultUnityVersion);
            }
            catch
            {
                alert("Something went wrong when leaving game, reloading the page to clear context...");
                window.location.reload();
            }
        }

        return () => {
            screenSaverDtorRef.current?.();
            if (sketchInstance.current !== null) {
                try
                {
                    if (sketchInstance.current.Quit) {
                        sketchInstance.current.Quit();
                    } else {
                        canvasRefUnity2018.current!.innerHTML = "";
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
    }, [ showScreenSaver, defaultResFolder ]);

    useEffect(() => {
        setShowScreenSaver(!isOn);
    }, [ isOn ]);

    useEffect(() => {
        setSketchButtons(buttons);
    }, [ buttons ]);

    return <>
        <div className="container box" id="screen-container">
            <div ref={canvasRefUnity2018} id="screen-canvas-unity-2018"></div>
            <canvas ref={canvasRef} id="screen-canvas"></canvas>
        </div>
        <div className="container box is-flex">
            <button className="button-icon" onClick={ _ => setShowScreenSaver(x => !x) }><span className="material-symbols-outlined">power_settings_new</span></button>
            <button className="button-icon" disabled={true}><span className="material-symbols-outlined">eject</span></button>
            {
                showScreenSaver ? <></> :
                sketchButtons.map(x =>
                    <button className={x.type === "icon" ? "button-icon" : ""} key={x.name} onClick={() => { sketchInstance.current!.SendMessage('LevelLoader', 'LoadScene', x.scene) }}>
                        {
                            x.type === "icon" ? <span className="material-symbols-outlined">{x.name}</span>
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