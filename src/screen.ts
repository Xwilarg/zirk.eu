let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let x: number;
let y: number;
let vx = -1;
let vy = -1;
let size = 25;

let speed = 2;

let refTime: number;

export function setupScreen()
{
    canvas = document.getElementById("screen-canvas") as HTMLCanvasElement;
    const targetWidth = document.getElementById("screen-container")!.clientWidth;
    canvas.width = targetWidth;
    canvas.height = 450;

    ctx = canvas.getContext("2d");
    updateFillColor();

    x = Math.floor(canvas.width / 2);
    y = Math.floor(canvas.height / 2);

    refTime = Date.now();
    window.requestAnimationFrame(updateCanvas);
}

function randInt(max: number): number {
    return Math.floor(Math.random() * max);
}

function updateFillColor() {
    ctx.fillStyle = `rgb(${randInt(256)} ${randInt(256)} ${randInt(256)})`;
}

function updateCanvas() {
    const now = Date.now();
    const delta = now - refTime;
    refTime = Date.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    x += (speed * delta / 10) * vx;
    y += (speed * delta / 10) * vy;

    if (x <= 0) {
        x = 0;
        vx = 1;
        updateFillColor();
    }
    if (y <= 0) {
        y = 0;
        vy = 1;
        updateFillColor();
    }
    if (x >= canvas.width - 1 - size) {
        x = canvas.width - 1 - size;
        vx = -1;
        updateFillColor();
    }
    if (y >= canvas.height - 1 - size) {
        y = canvas.height - 1 - size;
        vy = -1;
        updateFillColor();
    }

    ctx.fillRect(x, y, 25, 25);

    window.requestAnimationFrame(updateCanvas);
}