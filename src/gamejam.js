class AFilterComponent {
    constructor(id, validationFunc) {
        const target = document.getElementById(id);
        if (target) {
            target.addEventListener("change", _ => {
                filter();
            });
        }

        this.component = document.getElementById(id);
        this.validationFunc = validationFunc;
    }

    isExisting() {
        return this.component != null;
    }

    isValid(e) {
        return this.validationFunc(e, this.component, this);
    }
}

class Checkbox extends AFilterComponent {
    constructor(id, validationFunc) {
        super(id, validationFunc);
    }

    isActive() {
        return this.component.checked;
    }
}

class Select extends AFilterComponent {
    constructor(id, validationFunc) {
        super(id, validationFunc);
    }

    isActive() {
        return this.component.value !== "";
    }
}

class RangeMultipleSelect extends AFilterComponent {
    constructor(id, validationFunc) {
        super(id, validationFunc);
    }

    isActive() {
        return this.component.value !== "";
    }

    checkAgainst(datasetValue) {
        let entries = Array.from(this.component.selectedOptions).map(x => x.value);
        for (let e of entries) {
            const s = e.split('-');
            const value = parseInt(datasetValue);
            if (value >= parseInt(s[0]) && value <= parseInt(s[1])) {
                return true
            }
        }
        return false;
    }
}

let filters;

function filter() {
    const jamsList = document.querySelectorAll(".gamejam");

    for (const j of jamsList) {
        j.classList.remove("is-hidden");

        for (const f of filters) {
            if (f.isExisting() && f.isActive() && !f.isValid(j.dataset)) {
                j.classList.add("is-hidden");
                break;
            }
        }
    }
}

export function setupGamejams()
{
    filters  = [
        new Checkbox("filter-alone", (ds, c, me) => ds.team === ""),
        new Checkbox("filter-ranked", (ds, c, me) => ds.score !== "1"),
        new Checkbox("filter-nsfw", (ds, c, me) => ds.nsfw === "1"),
        new Select("filter-people", (ds, c, me) => ds.team.split(';').includes(c.value)),
        new Select("filter-event", (ds, c, me) => c.value === ds.event),
        new Select("filter-engine", (ds, c, me) => c.value === ds.engine),
        new Select("filter-year", (ds, c, me) => c.value === ds.year),
        new Select("filter-location", (ds, c, me) => c.value === ds.location),
        new RangeMultipleSelect("filter-duration", (ds, c, me) => me.checkAgainst(ds.duration)),
        new RangeMultipleSelect("filter-entries", (ds, c, me) => { return ds.entries == -1 ? Array.from(c.selectedOptions).map(x => x.value).includes("-1") : me.checkAgainst(ds.entries); })
    ];

    filter();

    const jamsList = document.querySelectorAll(".gamejam");
    for (let elem of jamsList) {
        const img = elem.querySelector("img");
        const src = img.src;

        elem.addEventListener("mouseover", e => { // Display the underlying GIF
            if (elem.dataset.missinggif !== "1") {
                img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="; // Display an empty image so we don't have the "missing image" thing
                img.style.backgroundImage = `url(${img.dataset.hover})`;
            }
        });
        elem.addEventListener("mouseout", _ => { // Display the image
            if (elem.dataset.missinggif !== "1") {
                img.src = src;
                img.style.backgroundImage = "";
            }
        });
    }
}