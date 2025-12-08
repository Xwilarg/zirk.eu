import { createElement, useEffect, useRef, type RefObject } from "react";

export default function useGameForm(canvasRef: RefObject<HTMLCanvasElement | null>, resFolder: string, filename: string, version: string) {
    let sketchInstance = useRef<any>(null);
    useEffect(() => {
        if (sketchInstance.current) sketchInstance.current!.Quit().then(() => {
            loadProjectInternal(resFolder, filename, version);
        });
        else loadProjectInternal(resFolder, filename, version);
    }, []);

    

    function loadProjectInternal(resFolder: string, filename: string, version: string)
    {
        const loading = document.createElement("div");
        loading.style = "position: absolute; top: 10px; left: 10px;";
        const text = document.createTextNode("Loading...");
        loading.appendChild(text);

        canvasRef.current!.parentElement!.appendChild(loading);
        //document.getElementById("unity-loading")!.classList.remove("is-hidden");
        //resizeUnityCanvas();

        let buildUrl = /*defaultSketchOverride ? `${resFolder}Build/` : */resFolder;
        let assetsUrl = `${resFolder}StreamingAssets/`;
        let loaderUrl = `${buildUrl}${filename}.loader.js`;

        let config;
        
        if (version === "2021.1.4f1") {
            config = {
                dataUrl: `${buildUrl}${filename}.data`,
                frameworkUrl: `${buildUrl}${filename}.framework.js`,
                codeUrl: `${buildUrl}${filename}.wasm`,
                streamingAssetsUrl: assetsUrl,
                companyName: "Zirk",
                productName: filename,
                productVersion: "1.0",
                showBanner: unityShowBanner,
            };
        } else {
            config = {
                dataUrl: `${buildUrl}${filename}.data.unityweb`,
                frameworkUrl: `${buildUrl}${filename}.framework.js.unityweb`,
                codeUrl: `${buildUrl}${filename}.wasm.unityweb`,
                streamingAssetsUrl: assetsUrl,
                companyName: "Zirk",
                productName: filename,
                productVersion: "1.0",
                showBanner: unityShowBanner,
            };
        }

        const script = document.createElement("script");
        script.src = loaderUrl;
        script.onload = () => {
            console.log(`Canvas dimensions: ${canvasRef.current!.width} x ${canvasRef.current!.height}`);
            // @ts-ignore
            createUnityInstance(canvasRef.current!, config, (_) => {
            }).then((unityInstance: any) => {
                loading.remove();
                sketchInstance = unityInstance;
            }).catch((message: string) => {
                alert(message);
            });
        };

        document.body.appendChild(script);

        /*if (defaultSketchOverride) {
            pinSketch();
            setFullscreen();
        }*/
        /*for (let sketchBtn of document.querySelectorAll(".sketch-button"))
        {
            if (defaultSketchOverride) sketchBtn.classList.add("is-hidden");
            else sketchBtn.classList.remove("is-hidden");
        }*/
    }

    function unityShowBanner(msg: string, type: string) {
        alert(`${type}: ${msg}`);
    }
}