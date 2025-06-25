export function setupHome() {
    for (let card of document.querySelectorAll("#target-main .card")) {
        for (let img of card.querySelectorAll(".menu-container img")) {
            img.addEventListener("click", e => {
                const target = e.target as HTMLImageElement;

                card.querySelector(".selected")!.classList.remove("selected");
                (card.querySelector(".project-image") as HTMLImageElement).src = target.src;
                (card.querySelector(".project-image") as HTMLImageElement).dataset.target = target.dataset.target;
                target.classList.add("selected");
                card.querySelector("legend")!.innerHTML = target.dataset.preview!;
            });
        }
    }
}