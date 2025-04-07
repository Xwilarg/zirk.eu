import { setupGamejams } from "./gamejam";
import { setupLifeline } from "./lifeline";
import { setupLoreAsync } from "./lore";
import { setupQuestions } from "./question";
import { setupTabs } from "./tabs";


async function initAsync() {
    setupTabs();
    setupGamejams();
    setupQuestions();
    setupLifeline();
    await setupLoreAsync();
}

document.onreadystatechange = async function () {
    if (document.readyState == "interactive") {
        await initAsync();
    }
};