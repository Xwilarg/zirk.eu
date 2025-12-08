import { useEffect, useRef, useState } from "react";
import { AScreen } from "./screensaver/AScreen";
import { BallsScreen } from "./screensaver/BallsScreen";

export default function ScreenSaverForm() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [screenSaver, setScreenSaver] = useState<AScreen | null>(null);
    
    useEffect(() => {
        const sc = new BallsScreen(canvasRef.current!, 0);
        setScreenSaver(sc);

        document.addEventListener("mousemove", sc.handleMouse.bind(sc));
        window.requestAnimationFrame(updateLoop);
    }, []);

    function updateLoop() {
        console.log(screenSaver)
        screenSaver?.updateCanvas();
        window.requestAnimationFrame(updateLoop);
    }

    console.log("refresh")

    return <canvas ref={canvasRef} style={{
        height: 500
    }}></canvas>
}