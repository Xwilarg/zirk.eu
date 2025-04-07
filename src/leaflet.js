import L from "leaflet"
import { showPreview } from "./preview";

export function setupLeaflet() {
    var map = L.map('map').setView([51.505, -0.09], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.marker([32.1, 130.6]).addTo(map).on('click', () => { showOnClick("/data/travel/Hitoyoshi.jpg") });
    L.marker([55.6, 12.5]).addTo(map).on('click', () => { showOnClick("/data/travel/Copenhagen.jpg") });
    L.marker([35.6, 139.2]).addTo(map).on('click', () => { showOnClick("/data/travel/Hichioji.jpg") });
    L.marker([33.2, 130.7]).addTo(map).on('click', () => { showOnClick("/data/travel/Yame.jpg") });
    L.marker([35.1, 135.5]).addTo(map).on('click', () => { showOnClick("/data/travel/UkyoWard.jpg") });
    L.marker([51.5, -0.2]).addTo(map).on('click', () => { showOnClick("/data/travel/London.jpg") });
    L.marker([49.2, 4.01]).addTo(map).on('click', () => { showOnClick("/data/travel/Reims.jpg") });
    L.marker([35.6, 139.7]).addTo(map).on('click', () => { showOnClick("/data/travel/ChiyodaCity.jpg") });
}

function showOnClick(img) {
    document.getElementById("map-preview").classList.remove("is-hidden"); document.getElementById("map-preview").src = img;
}