export function setupProject() {
    document.getElementById("old-random").addEventListener("click", _ => {
        let elems = Array.from(document.getElementById("old-projects").querySelectorAll(".cell"))
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        for (let i in elems) {
            elems[i].style = `order: ${i};`;
            if (i < 3) elems[i].classList.remove("is-hidden");
            else elems[i].classList.add("is-hidden");
        }
    });
}