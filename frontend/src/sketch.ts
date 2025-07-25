let sketchInstance: any;
let isSketchLoaded = false;
let isPinned = false;

function explanation_show_sketch(id: string) {
    return;

    document.querySelectorAll("#unity-explanations div").forEach(e => (e as HTMLElement).hidden = true);
    document.getElementById(`${id}-expl`)!.hidden = false;
}

function setupSketchButton(data: HTMLElement) {
    if (data.dataset.scene) {
        document.getElementById(data.id)!.addEventListener("click", _ => {
            sketchInstance.SendMessage('LevelLoader', 'LoadScene', data.dataset.scene);
            explanation_show_sketch(data.id);
        });
    }
}

export function setupSketch() {
    for (let b of document.querySelectorAll("#unity-buttons > button")) {
        setupSketchButton(b as HTMLElement);
    }

    document.getElementById("screen-power")!.addEventListener("click", _ => {
        loadSketch();
    });

    document.getElementById("fullscreen")!.addEventListener("click", _ => {
        document.getElementById("fullscreen")!.classList.add("is-hidden");
        document.getElementById("card-sketch")!.classList.add("fullscreen-view");
        document.querySelector("#target-main-container .break").classList.remove("is-hidden");

        resizeUnityCanvas();
    });
    document.getElementById("keep")!.addEventListener("click", _ => {
        pinSketch();
    });
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

function pinSketch() {
    if (!isPinned)
    {
        isPinned = true;

        document.getElementById("keep")!.classList.add("is-hidden");

        let outerDiv = document.getElementById("target-main-container");
        let innerDiv = document.getElementById("card-sketch");
        let targetDiv = document.getElementById("pinned-sketch");

        targetDiv.appendChild(outerDiv.removeChild(innerDiv));

        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

function resizeUnityCanvas()
{
    const canvas = document.querySelector("#unity-canvas") as HTMLCanvasElement;
    const container = document.getElementById("unity-container")!;

    if (container.clientWidth === 0 || container.clientHeight === 0) {
        requestAnimationFrame(resizeUnityCanvas);
    } else {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        canvas.style.width = `${container.clientWidth}px`;
        canvas.style.height = `${container.clientHeight}px`;
    }
}

function loadSketch() {
    // Don't load things twice
    if (isSketchLoaded) return;
    isSketchLoaded = true;

    sketch_loadProject("sketch/", "Sketch", false);

    resizeUnityCanvas();
}

let loadedScript: HTMLScriptElement | null = null;

export function sketch_loadProject(resFolder: string, filename: string, pinAuto: boolean)
{
    document.getElementById("screen-off")!.classList.add("is-hidden");
    document.getElementById("screen-on")!.classList.remove("is-hidden");

    const canvas = document.querySelector("#unity-canvas") as HTMLCanvasElement;
    resizeUnityCanvas();

    var buildUrl = resFolder;
    var loaderUrl = `${buildUrl}${filename}.loader.js`;
    var config = {
        dataUrl: `${buildUrl}${filename}.data.unityweb`,
        frameworkUrl: `${buildUrl}${filename}.framework.js.unityweb`,
        codeUrl: `${buildUrl}${filename}.wasm.unityweb`,
        streamingAssetsUrl: "StreamingAssets",
        companyName: "Zirk",
        productName: filename,
        productVersion: "1.0",
        showBanner: unityShowBanner,
    };

    const script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
        console.log(`Canvas dimensions: ${canvas.width} x ${canvas.height}`);
        // @ts-ignore
        createUnityInstance(canvas, config, (_) => {
        }).then((unityInstance: any) => {
            sketchInstance = unityInstance;
            document.getElementById("unity-loading")!.hidden = true;
        }).catch((message: string) => {
            alert(message);
        });
    };

    loadedScript = document.body.appendChild(script);

    if (pinAuto) pinSketch();
}