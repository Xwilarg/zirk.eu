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

    const jamsList = document.querySelectorAll(".full-list .gamejam");
    function filter() {
        for (let game of jamsList) {
            let l = document.getElementById("filter-location");
            if (l.value !== "" && l.value !== game.dataset.location) {
                game.hidden = true;
                continue;
            }
            let d = document.getElementById("filter-duration");
            if (d.value !== "") {
                const s = d.value.split('-');
                const duration = parseInt(game.dataset.duration);
                if (duration < parseInt(s[0]) || duration > parseInt(s[1])) {
                    game.hidden = true;
                    continue;
                }
            }
            let en = document.getElementById("filter-entries");
            if (en.value !== "") {
                if (en.value === "-1") {
                    if (game.dataset.entries !== "-1") {
                        game.hidden = true;
                        continue;
                    }
                }
                const s = en.value.split('-');
                const entries = parseInt(game.dataset.entries);
                if (entries < parseInt(s[0]) || entries > parseInt(s[1])) {
                    game.hidden = true;
                    continue;
                }
            }
            let y = document.getElementById("filter-year");
            if (y.value !== "" && y.value !== game.dataset.year) {
                game.hidden = true;
                continue;
            }
            let e = document.getElementById("filter-engine");
            if (e.value !== "" && e.value !== game.dataset.engine) {
                game.hidden = true;
                continue;
            }
            let e2 = document.getElementById("filter-event");
            if (e2.value !== "" && e2.value !== game.dataset.event) {
                game.hidden = true;
                continue;
            }
            let lang = document.getElementById("filter-language");
            if (lang.value !== "" && !game.dataset.language.split(';').includes(lang.value)) {
                game.hidden = true;
                continue;
            }
            let pe = document.getElementById("filter-people");
            if (pe.value !== "" && !game.dataset.team.split(';').includes(pe.value)) {
                game.hidden = true;
                continue;
            }
            let alone = document.getElementById("filter-alone");
            if (alone.checked && game.dataset.team !== "") {
                game.hidden = true;
                continue;
            }
            let ranked = document.getElementById("filter-ranked");
            if (ranked.checked && game.dataset.score === "1") {
                game.hidden = true;
                continue;
            }
            game.hidden = false;
        }
    }

    let filters = [
        "filter-location", "filter-duration", "filter-year", "filter-engine", "filter-event", "filter-entries", "filter-language", "filter-people", "filter-alone", "filter-ranked"
    ]

    for (let f of filters) {
        document.getElementById(f).addEventListener("change", _ => {
            filter();
        });
    }

    function sortDate() {
      let i = 0;
        for (let elem of [...document.querySelectorAll(".full-list .gamejam")].sort((a, b) => { return Date.parse(b.dataset.date) - Date.parse(a.dataset.date); })) {
            elem.style.order = i;
            i++;
        }
    }

    function sortScore() {
      let i = 0;
      for (let elem of [...document.querySelectorAll(".full-list .gamejam")].sort((a, b) => { return a.dataset.score - b.dataset.score; })) {
            elem.style.order = i;
            i++;
      }
    }

    function sortDuration() {
      let i = 0;
      for (let elem of [...document.querySelectorAll(".full-list .gamejam")].sort((a, b) => { return b.dataset.duration - a.dataset.duration; })) {
            elem.style.order = i;
            i++;
      }
    }

    document.getElementById("jam-sort-date").addEventListener('change', () => {
        sortDate();
    });

    document.getElementById("jam-sort-score").addEventListener('change', () => {
        sortScore();
    });

    document.getElementById("jam-sort-duration").addEventListener('change', () => {
        sortDuration();
    });
    sortDate();

});