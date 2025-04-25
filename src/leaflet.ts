import { map, marker, tileLayer } from "leaflet";

export function setupLeaflet() {
    document.getElementById("travels")!.addEventListener("click", _ => {
        const m = map('map').setView([51.505, 65.09], 2);
        tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(m);
        const travels = JSON.parse(document.getElementById("travels-json")!.innerHTML);
        for (const dest of travels) {
            marker([dest.lat, dest.long]).addTo(m).on('click', () => { showOnClick(`/data/travel/${dest.image}.jpg`) });
        }
    });
}

function showOnClick(img: string) {
    document.getElementById("map-preview-container")!.classList.remove("is-hidden");
    (document.getElementById("map-preview") as HTMLImageElement).src = img;
}