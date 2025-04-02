import { setupGamejams } from "./gamejam";
import { setupLifeline } from "./lifeline";
import { setupQuestions } from "./question";
import { setupTabs } from "./tabs";


async function initAsync() {
    setupTabs();
    setupGamejams();
    setupQuestions();
    setupLifeline();
}

document.onreadystatechange = async function () {
    if (document.readyState == "interactive") {
        await initAsync();
    }
};