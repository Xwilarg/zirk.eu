import L from "leaflet"
import { showPreview } from "./preview";

export function setupLeaflet() {
    var map = L.map('map').setView([51.505, -0.09], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    const travels = JSON.parse(document.getElementById("travels-json").innerHTML);
    for (const dest of travels) {
        L.marker([dest.lat, dest.long]).addTo(map).on('click', () => { showOnClick(`/data/travel/${dest.image}.jpg`) });
    }
}

function showOnClick(img) {
    document.getElementById("map-preview").classList.remove("is-hidden"); document.getElementById("map-preview").src = img;
}