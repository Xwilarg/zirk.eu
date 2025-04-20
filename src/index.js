import { setupGamejams } from "./gamejam";
import { setupLeaflet } from "./leaflet";
import { setupLifeline } from "./lifeline";
import { setupLore } from "./lore";
import { setupPreview } from "./preview";
import { setupQuestions } from "./question";
import { setupControl } from "./console";
import { setupTabs } from "./tabs";
import { setupSketch } from "./sketch";


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
}

document.onreadystatechange = async function () {
    if (document.readyState == "interactive") {
        await initAsync();
    }
};