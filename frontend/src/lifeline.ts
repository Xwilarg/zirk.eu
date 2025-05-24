export function setupLifeline() {
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
}