export function setupLifeline() {
    fetch("/lifeline/send.php")
    .then(resp => resp.ok ? resp.json() : Promise.reject(`${resp.status}`))
    .then(json => {
        console.log(json);
        document.getElementById("lifelines").innerHTML =
        "<div>" + Object.keys(json).map(x => `<p>${x}: ${json[x] ?? "Broken"}</p>`).join("<br>") + "</div>";
    })
    .catch((err) => { console.error(err); });
}