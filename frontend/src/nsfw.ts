export function setupNsfw() {
    let popup = document.getElementById("warn-nsfw");

    if (popup) {
        document.getElementById("warn-nsfw-continue").addEventListener("click", () => {
            popup.classList.remove("is-active");
        });
    }
}