import { UnlockAchievement } from "../../models/Achievement";
import { Sketches, SketchNames } from "./ScreenSaver";

export abstract class AScreen
{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    mouseX: number | null = null;
    mouseY: number | null = null;
    refTime: number;

    gotInteraction: boolean = false

    clearRect: boolean

    constructor(canvas: HTMLCanvasElement) {
        this.mouseX = null;
        this.mouseY = null;

        this.clearRect = true;

        this.canvas = canvas;
        this.updateBounds();

        this.refTime = 0;

        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
    }

    tryStoreName(name: string): string[] {
        let names = JSON.parse(localStorage.getItem("sk_in") ?? "[]") as string[]
        if (!names.includes(name)) {
            names.push(name);
            localStorage.setItem("sk_in", JSON.stringify(names));
        }

        return names;
    }

    // https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Mouse_controls
    handleMouse(e: MouseEvent) {
        const bounds = this.canvas.getBoundingClientRect();
        const relX = e.clientX - bounds.left;
        const relY = e.clientY - bounds.top;
        if (relX >= 0 && relX < this.canvas.width && relY >= 0 && relY < this.canvas.height) {
            this.setMousePos(relX, relY);
            if (!this.gotInteraction) {
                this.gotInteraction = true;

                const names = this.tryStoreName(this.getName());
                if (SketchNames.every(x => names.includes(x))) UnlockAchievement("INTERACT_ALL_SKETCHES");
            }
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
        if (this.clearRect) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        /*this.ctx.fillStyle = "#8080801a";
        this.ctx.font = "bold 50px Quantico, sans-serif";
        this.ctx.fillText("SKETCH", this.canvas.width - 209, 50);*/

        const now = Date.now();
        const delta = now - this.refTime;
        this.refTime = Date.now();
        this.render(isNaN(delta) ? 0 : delta);
    }

    abstract render(deltaTime: number): void;
    abstract setMousePos(x: number, y: number): void;
    abstract getName(): string;
}