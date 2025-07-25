let sketchInstance: any;
let isSketchLoaded = false;

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
        document.getElementById("screen-off")!.classList.add("is-hidden");
        document.getElementById("screen-on")!.classList.remove("is-hidden");
        loadSketch();
    });

    document.getElementById("fullscreen")!.addEventListener("click", _ => {
        document.getElementById("fullscreen")!.classList.add("is-hidden");
        document.getElementById("card-sketch")!.classList.add("fullscreen-view");
        document.querySelector("#target-main-container .break").classList.remove("is-hidden");

        resizeUnityCanvas();
    });
    document.getElementById("keep")!.addEventListener("click", _ => {
        document.getElementById("keep")!.classList.add("is-hidden");

        let outerDiv = document.getElementById("target-main-container");
        let innerDiv = document.getElementById("card-sketch");
        let targetDiv = document.getElementById("pinned-sketch");

        targetDiv.appendChild(outerDiv.removeChild(innerDiv));

        window.scrollTo({top: 0, behavior: 'smooth'});
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

function resizeUnityCanvas()
{
    const canvas = document.querySelector("#unity-canvas") as HTMLCanvasElement;
    const container = document.getElementById("unity-container")!;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.width = `${container.clientWidth}px`;
    canvas.style.height = `${container.clientHeight}px`;
}

function loadSketch() {
    // Don't load things twice
    if (isSketchLoaded) return;
    isSketchLoaded = true;

    const canvas = document.querySelector("#unity-canvas") as HTMLCanvasElement;

    var buildUrl = "sketch";
    var loaderUrl = buildUrl + "/Sketch.loader.js";
    var config = {
        dataUrl: buildUrl + "/Sketch.data.unityweb",
        frameworkUrl: buildUrl + "/Sketch.framework.js.unityweb",
        codeUrl: buildUrl + "/Sketch.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "Zirk",
        productName: "Sketch",
        productVersion: "1.0",
        showBanner: unityShowBanner,
    };

    resizeUnityCanvas();

    const script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
        // @ts-ignore
        createUnityInstance(canvas, config, (_) => {
        }).then((unityInstance: any) => {
            sketchInstance = unityInstance;
            document.getElementById("unity-loading")!.hidden = true;
        }).catch((message: string) => {
            alert(message);
        });
    };

    document.body.appendChild(script);
}