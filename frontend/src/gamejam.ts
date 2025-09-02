import { sketch_loadProject } from "./sketch";

abstract class AFilterComponent {
    component: HTMLElement;
    validationFunc: (DOMStringMap, HTMLElement, AFilterComponent) => boolean;

    constructor(id: string, validationFunc: (DOMStringMap, HTMLElement, AFilterComponent) => boolean) {
        const target = document.getElementById(id);
        if (target) {
            target.addEventListener("change", _ => {
                filter();
            });
        }

        this.component = document.getElementById(id) as HTMLElement;
        this.validationFunc = validationFunc;
    }

    isExisting(): boolean {
        return this.component != null;
    }

    isValid(e: DOMStringMap): boolean {
        return this.validationFunc(e, this.component, this);
    }

    abstract isActive(): boolean;
}

class Checkbox extends AFilterComponent {
    constructor(id: string, validationFunc: (DOMStringMap, HTMLElement, AFilterComponent) => boolean) {
        super(id, validationFunc);
    }

    isActive(): boolean {
        return (this.component as HTMLInputElement).checked;
    }
}

class Select extends AFilterComponent {
    constructor(id: string, validationFunc: (DOMStringMap, HTMLElement, AFilterComponent) => boolean) {
        super(id, validationFunc);
    }

    isActive(): boolean {
        return (this.component as HTMLInputElement).value !== "";
    }
}

class RangeMultipleSelect extends AFilterComponent {
    constructor(id: string, validationFunc: (DOMStringMap, HTMLElement, AFilterComponent) => boolean) {
        super(id, validationFunc);
    }

    isActive(): boolean {
        return (this.component as HTMLSelectElement).value !== "";
    }

    checkAgainst(datasetValue: string) {
        let entries = Array.from((this.component as HTMLSelectElement).selectedOptions).map(x => x.value);
        for (let e of entries) {
            const value = parseInt(datasetValue);
            if (e === '-1') {
                if (value === -1) return true;
            } else {
                const s = e.split('-');
                if (value >= parseInt(s[0]) && value <= parseInt(s[1])) {
                    return true
                }
            }
        }
        return false;
    }
}

let filters: AFilterComponent[];

function filter() {
    const jamsList = document.querySelectorAll("#gamejam-list .gamejam") as NodeListOf<HTMLElement>;

    let filteredCount = jamsList.length;
    for (const j of jamsList) {
        j.classList.remove("is-hidden");

        for (const f of filters) {
            if (f.isExisting() && f.isActive() && !f.isValid(j.dataset)) {
                j.classList.add("is-hidden");
                filteredCount--;
                break;
            }
        }
    }
    document.getElementById("entriesFiltered")!.innerHTML = ` (${filteredCount})`;
}

export function setupGamejams()
{
    filters  = [
        new Checkbox("filter-alone", (ds: DOMStringMap, c: HTMLElement, me: AFilterComponent) => ds.team === ""),
        new Checkbox("filter-ranked", (ds: DOMStringMap, c: HTMLElement, me: AFilterComponent) => ds.score !== "1"),
        new Checkbox("filter-nsfw", (ds: DOMStringMap, c: HTMLElement, me: AFilterComponent) => ds.nsfw === "1"),
        new Select("filter-people", (ds: DOMStringMap, c: HTMLElement, me: AFilterComponent) => ds.team!.split(';').includes((c as HTMLInputElement).value)),
        new Select("filter-event", (ds: DOMStringMap, c: HTMLElement, me: AFilterComponent) => (c as HTMLInputElement).value === ds.event),
        new Select("filter-engine", (ds: DOMStringMap, c: HTMLElement, me: AFilterComponent) => (c as HTMLInputElement).value === ds.engine),
        new Select("filter-year", (ds: DOMStringMap, c: HTMLElement, me: AFilterComponent) => (c as HTMLInputElement).value === ds.year),
        new Select("filter-location", (ds: DOMStringMap, c: HTMLElement, me: AFilterComponent) => (c as HTMLInputElement).value === ds.location),
        new RangeMultipleSelect("filter-duration", (ds: DOMStringMap, c: HTMLElement, me: AFilterComponent) => (me as RangeMultipleSelect).checkAgainst(ds.duration!)),
        new RangeMultipleSelect("filter-entries", (ds: DOMStringMap, c: HTMLElement, me: AFilterComponent) => { return !ds.entries ? Array.from((c as HTMLSelectElement).selectedOptions).map(x => x.value).includes("-1") : (me as RangeMultipleSelect).checkAgainst(ds.entries); })
    ];

    filter();

    const jamsList = document.querySelectorAll(".gamejam") as NodeListOf<HTMLElement>;
    for (let elem of jamsList) {
        const img = elem.querySelector("img") as HTMLImageElement;
        const src = img.src;

        elem.addEventListener("mouseover", _ => { // Display the underlying GIF
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

        elem.querySelector(".sketch-jam-load")?.addEventListener("click", _ => {
            sketch_loadProject(elem.dataset.sketchFolder, elem.dataset.sketchFilename, elem.dataset.version, true);
        });
    }

    document.getElementById("filter-order")!.addEventListener("change", e => {
        const target = e.target as HTMLInputElement;

        let i = 0;
        if (target.value === "date") {
            // @ts-ignore
            for (let elem of [...document.querySelectorAll("#gamejam-list .gamejam")].sort((a, b) => { return Date.parse(b.dataset.date) - Date.parse(a.dataset.date); })) {
                (elem as HTMLElement).style.order = i.toString();
                i++;
            }
        } else if (target.value === "score") {
            // @ts-ignore
            for (let elem of [...document.querySelectorAll("#gamejam-list .gamejam")].sort((a, b) => { return a.dataset.score === b.dataset.score ? parseInt(b.dataset.entries) - parseInt(a.dataset.entries) : parseFloat(a.dataset.score) - parseFloat(b.dataset.score); })) {
                (elem as HTMLElement).style.order = i.toString();
                i++;
            }
        }
    });
}