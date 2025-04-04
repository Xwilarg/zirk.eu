export function setupPreview() {
    document.getElementById("close-preview").addEventListener("click", _ => {
        document.getElementById("modal-preview").classList.remove("is-active");
    });

    for (const img of document.querySelectorAll(".project-image")) {
        img.addEventListener("click", e => {
            document.getElementById("modal-preview").classList.add("is-active");
            document.getElementById("image-preview").src = e.target.src;
        })
    }
}