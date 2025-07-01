export function setupProject() {
    document.getElementById("old-random")!.addEventListener("click", _ => {
        let elems = Array.from(document.getElementById("old-projects")!.querySelectorAll(".project"))
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value) as HTMLElement[];
        for (let i = 0; i < elems.length; i++) {
            elems[i].style = `order: ${i};`;
            if (i < 3) elems[i].classList.remove("is-hidden");
            else elems[i].classList.add("is-hidden");
        }
    });
}