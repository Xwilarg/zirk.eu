window.addEventListener("load", _ => {
    for (let elem of document.getElementsByClassName("gamejam")) {
        const img = elem.querySelector("img");

        img.dataset.src = img.src;

        elem.addEventListener("mouseover", e => { // Display the underlying GIF
            if (elem.dataset.missinggif !== "1") {
                img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="; // Display an empty image so we don't have the "missing image" thing
                img.style.backgroundImage = `url(${img.dataset.src.substring(0, img.dataset.src.length - 4)}.gif)`;
            }
        });
        elem.addEventListener("mouseout", _ => { // Display the image
            if (elem.dataset.missinggif !== "1") {
                img.src = img.dataset.src;
                img.style.backgroundImage = "";
            }
        });
    }
});