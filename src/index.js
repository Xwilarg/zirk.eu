import { setupGamejams } from "./gamejam";
import { setupQuestions } from "./question";
import { setupTabs } from "./tabs";


async function initAsync() {
    setupTabs();
    setupGamejams();
    setupQuestions();
}

document.onreadystatechange = async function () {
    if (document.readyState == "interactive") {
        await initAsync();
    }
};