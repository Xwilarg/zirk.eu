import { useEffect, useRef } from "react";
import { AScreen } from "./screensaver/AScreen";
import { BallsScreen } from "./screensaver/BallsScreen";
import { ParticleOrbits } from "./screensaver/ParticleOrbit";
import { randInt } from "../../utils";

export default function ScreenSaverForm() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const screenSaverRef = useRef<AScreen | null>(null);
    
    useEffect(() => {
        const elems = [ParticleOrbits, BallsScreen];
        const sc = new elems[randInt(elems.length)](canvasRef.current!);
        screenSaverRef.current = sc;

        document.addEventListener("mousemove", sc.handleMouse.bind(sc));
        window.requestAnimationFrame(updateLoop);

        window.addEventListener("resize", sc.updateBounds.bind(sc));
    }, []);

    function updateLoop() {
        screenSaverRef.current?.updateCanvas();
        window.requestAnimationFrame(updateLoop);
    }

    return <canvas ref={canvasRef} id="screensaver-canvas"></canvas>
}