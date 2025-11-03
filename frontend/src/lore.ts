let currSummary = null;
let currDescription = null;
let showDetails = false;

export function setupLore() {
    for (let btn of document.querySelectorAll(".btn-lore"))
    {
        btn.addEventListener("click", _ => {
            const dataset = (btn as HTMLElement).dataset;
            currDescription = dataset.description;
            currSummary = dataset.summary;
            (document.getElementById("lore-world-text") as HTMLTextAreaElement).value = showDetails ? `${currSummary}\n\n${currDescription}` : currSummary;
        });
    }
    document.getElementById("lore-world-text-button-input").addEventListener("click", e => {
        showDetails = (e.target as HTMLInputElement).checked;
        if (currSummary !== null) {
            let textarea = (document.getElementById("lore-world-text") as HTMLTextAreaElement);
            textarea.value = showDetails ? `${currSummary}\n\n${currDescription}` : currSummary;
        }
    });

    document.getElementById("lore-see-all").addEventListener("click", _ => {
        for (let btn of document.querySelectorAll(".btn-lore-container"))
        {
            const e = btn as HTMLElement;
            e.classList.remove("is-hidden");
            e.classList.add("is-flex");
        }
        document.getElementById("lore-see-all").classList.add("is-hidden");
    });
}