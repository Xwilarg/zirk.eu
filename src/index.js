import { setupGamejams } from "./modules/gamejam";
import { setupLeaflet } from "./modules/leaflet";
import { setupLifeline } from "./modules/lifeline";
import { setupLore } from "./modules/lore";
import { setupPreview } from "./modules/preview";
import { setupQuestions } from "./modules/question";
import { setupControl } from "./modules/console";
import { setupTabs } from "./modules/tabs";
import { setupSketch } from "./modules/sketch";
import { setupHome } from "./modules/home";
import { setupProject } from "./modules/project";
import { setupPixiAsync } from "./modules/pixi";


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
    await setupPixiAsync();
}

document.onreadystatechange = async function () {
    if (document.readyState == "interactive") {
        await initAsync();
    }
};