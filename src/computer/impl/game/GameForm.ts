import { type RefObject } from "react";

export interface ButtonInfo
{
    name: string;
    iconType: string;
    scene: string | (() => void);
    type: ButtonType;
    disabled: boolean;
    gameViewOnly: boolean
}

export type ButtonType = "ChangeScene" | "GiveInfo" | "Custom"

export function loadSketch(canvasRef: RefObject<HTMLCanvasElement | null>, sketchInstance: RefObject<any>, loadedScripts: RefObject<HTMLScriptElement[]>,
    resFolder: string, filename: string, engine: string, version: string
) {
    loadProjectInternal(canvasRef, sketchInstance, loadedScripts, resFolder, filename, engine, version);
}

export function getLoaderFiles(resFolder: string, filename: string, engine: string, version: string): string[] // Used by desktop mode
{
    if (engine == "GB Studio")
    {
        return [ `${resFolder}binjgb.js`, `${resFolder}js/script.js` ];
    }

    const versionNumber = parseInt(version.split('.')[0]);
    if (versionNumber <= 2019) {
        return [ `${resFolder}Build/UnityLoader.js` ];
    }

    return [ `${resFolder}${filename}.loader.js` ];
}

function loadProjectInternal(canvasRef: RefObject<HTMLCanvasElement | null>, sketchInstance: RefObject<any>, loadedScripts: RefObject<HTMLScriptElement[]>, resFolder: string, filename: string, engine: string, version: string)
{
    const loading = document.createElement("div");
    loading.style = "position: absolute; top: 10px; left: 10px;";
    const text = document.createTextNode("Loading...");
    loading.appendChild(text);

    try
    {
        if (engine === "GB Studio")
        {
            loadGBStudioProjectInternal(canvasRef, sketchInstance, loadedScripts, resFolder, filename, version, loading);
        }
        else
        {
            loadUnityProjectInternal(canvasRef, sketchInstance, loadedScripts, resFolder, filename, version, loading);
        }
    }
    catch (e)
    {
        loading.textContent = `Failed to load: ${e}`;
    }
}

function loadGBStudioProjectInternal(canvasRef: RefObject<HTMLCanvasElement | null>, sketchInstance: RefObject<any>, loadedScripts: RefObject<HTMLScriptElement[]>, resFolder: string, filename: string, version: string, loading: HTMLDivElement)
{
    const script1 = document.createElement("script");
    loadedScripts.current!.push(script1);
    script1.src = `${resFolder}binjgb.js`;
    script1.onload = () => {
        fetch(`${resFolder}js/script.js`)
            .then(resp => resp.text())
            .then(text => {
                const script2 = document.createElement("script");
                loadedScripts.current!.push(script2);
                script2.textContent = text.replace('const ROM_FILENAME = "rom/game.gb";', `const ROM_FILENAME = "${resFolder}rom/game.gb";`);
                script2.textContent += "const customControls = {}";
                script2.onload = () => {
                    loading.remove();
                };
                script2.onerror = (e) => { loading.textContent = `Failed to load: ${e}`; }
                document.body.appendChild(script2);
            });
    };
    script1.onerror = (e) => { loading.textContent = `Failed to load: ${e}`; }
    document.body.appendChild(script1);
}

function loadUnityProjectInternal(canvasRef: RefObject<HTMLCanvasElement | null>, sketchInstance: RefObject<any>, loadedScripts: RefObject<HTMLScriptElement[]>, resFolder: string, filename: string, version: string, loading: HTMLDivElement)
{
    canvasRef.current!.parentElement!.appendChild(loading);

    let buildUrl = resFolder;
    let assetsUrl = `${resFolder}StreamingAssets/`;
    let loaderUrl = `${buildUrl}${filename}.loader.js`;

    let config;

    const versionNumber = parseInt(version.split('.')[0]);
    if (versionNumber <= 2019) {
        config = null;
        loaderUrl = `${buildUrl}Build/UnityLoader.js`;
    } else if (version === "2021.1.4f1") {
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
    loadedScripts.current!.push(script);
    script.src = loaderUrl;
    script.onload = () => {
        console.log(`Canvas dimensions: ${canvasRef.current!.width} x ${canvasRef.current!.height}`);
        if (versionNumber <= 2019) {
            canvasRef.current!.classList.add("hidden");
            loading.remove();
            // @ts-ignore
            sketchInstance.current = UnityLoader.instantiate(
                "screen-canvas-unity-2019",
               `${buildUrl}${filename}.json`
            );
        }
        else
        {
            canvasRef.current!.classList.remove("hidden");
            // @ts-ignore
            createUnityInstance(canvasRef.current!, config, (progress) => {
                loading.textContent = `Loading... ${Math.trunc(parseFloat(progress) * 100)}%`
            }).then((unityInstance: any) => {
                loading.remove();
                sketchInstance.current = unityInstance;
            }).catch((message: string) => {
                loading.textContent = `Failed to load: ${message}`
            });
        }
    };
    script.onerror = (e) => { loading.textContent = `Failed to load: ${e}`; }

    document.body.appendChild(script);
}