import { setupGamejams } from "./gamejam";
import { setupLeaflet } from "./leaflet";
import { setupLifeline } from "./lifeline";
import { setupLore } from "./lore";
import { setupPreview } from "./preview";
import { setupQuestions } from "./question";
import { setupConsole } from "./console";
import { setupTabs } from "./tabs";
import { setupSketch } from "./sketch";
import { setupHome } from "./home";
import { setupProject } from "./project";
import { setupScreen } from "./screen";
import { setupTerminal } from "./terminal";
import { setupNsfw } from "./nsfw";


async function initAsync() {
    setupNsfw();

    if (setupTabs()) {
        openTab("main");
    }

    setupQuestions();
    setupPreview();
    setupSketch();
    setupScreen();
}

let alreadyOpen = [];
export function openTab(name: string) {
    if (alreadyOpen.includes(name)) return;

    alreadyOpen.push(name);

    if (name === "main") {
        setupHome();
    }
    else if (name === "project") {
        setupProject();
    }
    else if (name === "gamejam") {
        setupGamejams();
    }
    else if (name === "lore") {
        setupLore();
    }
    else if (name === "about") {
        setupLeaflet();
        setupConsole();
        setupLifeline();
        setupTerminal();
        setupConsole();
    }
    else {
        console.error(`Unknown tab ${name}`);
    }
}

document.onreadystatechange = async function () {
    if (document.readyState == "interactive") {
        await initAsync();
    }
};