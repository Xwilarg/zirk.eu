// https://stackoverflow.com/a/52171480
const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export function setupLifeline() {
    // Dynamics
    document.getElementById("lifelines-update")!.addEventListener("click", e => {
        fetch("/lifeline/send.php")
        .then(resp => resp.ok ? resp.json() : Promise.reject(`${resp.status}`))
        .then(json => {
            for (const [key, value] of Object.entries(json)) {
                document.getElementById(`lifeline-${key}`)!.innerHTML = (value as any)["id"] ?? "Broken";
            }
        })
        .catch((err) => { console.error(err); });

        (e.target as HTMLElement).classList.add("is-hidden");
    });

    // Statics
    for (let lifeline of document.querySelectorAll(".static-lifeline"))
    {
        lifeline.addEventListener("click", e => {
            let btn = e.target as HTMLElement;
            let input = document.getElementById(`${btn.id}-input`) as HTMLInputElement;
            const id = input.dataset.id;
            const result = input.dataset.hash;
            let finalStr = id.localeCompare(input.value) < 0 ? `${id}${input.value}` : `${input.value}${id}`;
            if (cyrb53(finalStr).toString() === result) {
                input.classList.add("is-hidden");
                btn.classList.add("is-hidden");
                alert("♥");
            } else {
                alert("Invalid ID");
            }
        });
    }
}