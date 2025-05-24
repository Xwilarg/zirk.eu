import { Network, DataSet, Node, Edge } from "vis-network/standalone";

let discovered: { [hash: string] : number; } = {};
let links: Edge[] = [];
let nodes: NodeData[] = [];

let searches: string[] = [];

let content: { [id: number] : string; } = {};

let colors = [ "#ff7f7f", "#bfbfbf", "#14d983" ];

let categories = [ "katsis", "energy", "god" ];
let censor = false;

interface NodeData extends Node
{
    id: number
    label: string
    group: string
    color: string
    name: string
    hash: string
}

function searchItem(inputValue: string) {
    fetch("/php/lore.php", {
        method: 'POST',
        body: inputValue
    })
    .then(resp => resp.ok ? resp.json() : Promise.reject(`${resp.status}`))
    .then(res => {
        for (let json of res) {
            (document.getElementById("lore-field") as HTMLInputElement).value = json.data.join("\n");
            if (!(json.hash in discovered)) {
                // Update storage
                searches.push(json.key);
                localStorage.setItem("lore", searches.join(","));

                const id = Object.keys(discovered).length;
                discovered[json.hash] = id;
                content[id] = json.data.join("\n");
                let group = categories.indexOf(json.category);
                nodes.push({
                    id: id,
                    label: censor ? (json.hash.substring(0, 5) + "…") : json.name,
                    group: group.toString(),
                    color: colors[group],
                    name: json.name,
                    hash: json.hash
                });

                for (let l of json.links)
                {
                    if (l in discovered && !links.some(x => (x.from === discovered[l] && x.to === id) || (x.from === id && x.to === discovered[l])))
                    {
                        links.push({ from: id, to: discovered[l] });
                    }
                }
            } 
        }

        renderNetwork();
    })
    .catch((err) => { 
        (document.getElementById("lore-field") as HTMLInputElement).value = `Search failed: ${err}`;
    });
}

export function setupLore() {
    // Update current data with what we stored
    const loreData = localStorage.getItem("lore");
    if (loreData !== null) {
        searchItem(loreData);
    }

    // New lore input
    const loreInput = document.getElementById("lore-input") as HTMLInputElement;
    document.getElementById("lore-form")!.addEventListener("submit", e => {
        e.preventDefault();
        const inputValue = loreInput.value.toLowerCase().replaceAll(" ", "").replaceAll(",", "");
        searchItem(inputValue);
        loreInput.value = "";
    });

    // Hide/show names
    document.getElementById("lore-censor")!.addEventListener("change", e => {
        censor = (e.target as HTMLInputElement).checked;
        for (let n of nodes) {
            n.label = censor ? (n.hash.substring(0, 5) + "…") : n.name;
        }
        renderNetwork();
    });

    document.getElementById("lore-delete")!.addEventListener("click", e => {
        if (confirm("Are you sure you want to delete lore data from local storage?")) {
            localStorage.removeItem("lore");
            alert("Local storage was deleted");
        }
    });
}

function renderNetwork() {
    const container = document.getElementById('lore-network') as HTMLElement;

    const data = {
        nodes: new DataSet<Node>(nodes),
        edges: new DataSet<Edge>(links)
    };
    const options = {
        nodes: {
            shape: "dot",
            size: 25,
            font: {
                color: "white"
            }
        }
    };

    const network = new Network(container, data, options);
    network.on('click', function(properties) {
    var ids = properties.nodes;
    if (ids.length > 0) {
        (document.getElementById("lore-field") as HTMLInputElement).value = content[ids[0]];
    }
});
}