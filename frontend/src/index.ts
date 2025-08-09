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


async function initAsync() {
    setupTabs();
    setupGamejams();
    setupQuestions();
    setupLifeline();
    setupPreview();
    setupLeaflet();
    setupConsole();
    setupSketch();
    setupHome();
    setupProject();
    setupScreen();
    setupLore();
    setupTerminal();
    setupConsole();
}

document.onreadystatechange = async function () {
    if (document.readyState == "interactive") {
        await initAsync();
    }
};