export function setupHome() {
    for (let card of document.querySelectorAll("#target-main .card")) {
        for (let img of card.querySelectorAll(".menu-container img")) {
            img.addEventListener("click", e => {
                card.querySelector(".selected").classList.remove("selected");
                card.querySelector(".project-image").src = e.target.src;
                e.target.classList.add("selected");
                card.querySelector("legend").innerHTML = e.target.dataset.preview;
            });
        }
    }
}