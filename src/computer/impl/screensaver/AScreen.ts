export abstract class AScreen
{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    mouseX: number | null = null;
    mouseY: number | null = null;
    refTime: number;

    constructor(canvas: HTMLCanvasElement) {
        this.mouseX = null;
        this.mouseY = null;

        this.canvas = canvas;
        this.updateBounds();

        this.refTime = 0;

        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
    }

    // https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Mouse_controls
    handleMouse(e: MouseEvent) {
        const bounds = this.canvas.getBoundingClientRect();
        const relX = e.clientX - bounds.left;
        const relY = e.clientY - bounds.top;
        if (relX >= 0 && relX < this.canvas.width && relY >= 0 && relY < this.canvas.height) {
            this.setMousePos(relX, relY);
        } else {
            this.mouseX = null;
            this.mouseY = null;
        }
    }

    updateBounds() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    updateCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#8080801a";
        this.ctx.font = "bold 50px Quantico, sans-serif";
        this.ctx.fillText("SKETCH", this.canvas.width - 209, 50);

        const now = Date.now();
        const delta = now - this.refTime;
        this.refTime = Date.now();
        this.render(isNaN(delta) ? 0 : delta);
    }

    abstract render(deltaTime: number): void;
    abstract setMousePos(x: number, y: number): void;
}