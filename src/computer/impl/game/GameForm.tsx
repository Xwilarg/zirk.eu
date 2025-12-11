import { type RefObject } from "react";

export interface ButtonInfo
{
    name: string;
    type: string;
    scene: string;
}

export function loadSketch(canvasRef: RefObject<HTMLCanvasElement | null>, sketchInstance: RefObject<any>,
    resFolder: string, filename: string, version: string
) {
    if (sketchInstance.current) sketchInstance.current!.Quit().then(() => {
        loadProjectInternal(canvasRef, sketchInstance, resFolder, filename, version);
    });
    else loadProjectInternal(canvasRef, sketchInstance, resFolder, filename, version);
}

function loadProjectInternal(canvasRef: RefObject<HTMLCanvasElement | null>, sketchInstance: RefObject<any>, resFolder: string, filename: string, version: string)
{
    const loading = document.createElement("div");
    loading.style = "position: absolute; top: 10px; left: 10px;";
    const text = document.createTextNode("Loading...");
    loading.appendChild(text);

    canvasRef.current!.parentElement!.appendChild(loading);

    let buildUrl = resFolder;
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
            showBanner: (msg: string, type: string) => `${type}: ${msg}`,
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
            showBanner: (msg: string, type: string) => `${type}: ${msg}`,
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
            sketchInstance.current = unityInstance;
        }).catch((message: string) => {
            text.textContent = `Failed to load: ${message}`
        });
    };

    document.body.appendChild(script);
}