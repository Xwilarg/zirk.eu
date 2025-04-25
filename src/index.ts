import { setupGamejams } from "./gamejam";
import { setupLeaflet } from "./leaflet";
import { setupLifeline } from "./lifeline";
import { setupLore } from "./lore";
import { setupPreview } from "./preview";
import { setupQuestions } from "./question";
import { setupControl } from "./console";
import { setupTabs } from "./tabs";
import { setupSketch } from "./sketch";
import { setupHome } from "./home";
import { setupProject } from "./project";
import { setupScreen } from "./screen";


async function initAsync() {
    setupTabs();
    setupGamejams();
    setupQuestions();
    setupLifeline();
    setupPreview();
    setupLeaflet();
    setupLore();
    setupControl();
    setupSketch();
    setupHome();
    setupProject();
    setupScreen();
}

document.onreadystatechange = async function () {
    if (document.readyState == "interactive") {
        await initAsync();
    }
};