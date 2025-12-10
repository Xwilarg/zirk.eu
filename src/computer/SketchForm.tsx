import { forwardRef, useEffect, useRef, useState } from "react";
import { loadSketch, type ButtonInfo } from "./impl/game/GameForm";
import sketchData from "../../data/json/sketch.json"
import type { AScreen } from "./impl/screensaver/AScreen";
import loadScreenSaver from "./impl/ScreenSaver";

export interface SketchFormProps
{
    isOn: boolean,
    defaultResFolder: string,
    defaultFilename: string,
    defaultUnityVersion: string
}

const SketchForm = forwardRef((
    { isOn, defaultResFolder, defaultFilename, defaultUnityVersion }: SketchFormProps,
    _
) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const screenSaverRef = useRef<AScreen | null>(null);
    const screenSaverDtorRef = useRef<() => void | null>(null);
    let sketchInstance = useRef<any>(null);
    const [sketchButtons, setSketchData] = useState<ButtonInfo[]>(sketchData);
    let [showScreenSaver, setShowScreenSaver] = useState<boolean>(!isOn);

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
            loadSketch(canvasRef, sketchInstance, defaultResFolder, defaultFilename, defaultUnityVersion);
        }

        return () => {
            screenSaverDtorRef.current?.();
        };
    }, [ showScreenSaver ])

    return <>
        <div className="container" id="screen-container">
            <canvas ref={canvasRef} id="screen-canvas"></canvas>
        </div>
        <div className="container is-flex">
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
        <div className="container is-flex"></div>
    </>
});
export default SketchForm;