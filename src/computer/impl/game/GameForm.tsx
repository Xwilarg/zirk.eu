export default function useGameForm() {
    function loadProjectInternal(resFolder: string, filename: string, version: string, defaultSketchOverride: boolean)
    {
        document.getElementById("unity-loading")!.classList.remove("is-hidden");

        const canvas = document.querySelector("#unity-canvas") as HTMLCanvasElement;
        resizeUnityCanvas();

        let buildUrl = defaultSketchOverride ? `${resFolder}Build/` : resFolder;
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
            console.log(`Canvas dimensions: ${canvas.width} x ${canvas.height}`);
            // @ts-ignore
            createUnityInstance(canvas, config, (_) => {
            }).then((unityInstance: any) => {
                sketchInstance = unityInstance;
                document.getElementById("unity-loading")!.classList.add("is-hidden");
                document.getElementById("screen-on")!.classList.remove("is-hidden");
            }).catch((message: string) => {
                alert(message);
            });
        };

        loadedScript = document.body.appendChild(script);

        if (defaultSketchOverride) {
            pinSketch();
            setFullscreen();
        }
        for (let sketchBtn of document.querySelectorAll(".sketch-button"))
        {
            if (defaultSketchOverride) sketchBtn.classList.add("is-hidden");
            else sketchBtn.classList.remove("is-hidden");
        }
    }

    function unityShowBanner(msg: string, type: string) {
        const warningBanner = document.querySelector("#unity-warning") as HTMLElement;
        function updateBannerVisibility() {
            warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        var div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.setAttribute("style", "background: red; padding: 10px;");
        else {
            if (type == 'warning') div.setAttribute("style", "background: yellow; padding: 10px;");
            setTimeout(function () {
                warningBanner.removeChild(div);
                updateBannerVisibility();
            }, 5000);
        }
        updateBannerVisibility();
    }
}