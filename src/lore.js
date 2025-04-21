let discovered = {};
let links = [];
let nodes = [];

let searches = [];

let content = {};

let colors = [ "#ff7f7f", "#bfbfbf", "#14d983" ];

let categories = [ "katsis", "energy", "god" ];
let censor = false;

function searchItem(inputValue) {
    fetch("/php/lore.php", {
        method: 'POST',
        body: inputValue
    })
    .then(resp => resp.ok ? resp.json() : Promise.reject(`${resp.status}`))
    .then(json => {
        document.getElementById("lore-field").value = json.data.join("\n");
        if (!(json.hash in discovered)) {
            // Update storage
            searches.push(inputValue);
            localStorage.setItem("lore", searches.join(","));

            const id = Object.keys(discovered).length;
            discovered[json.hash] = id;
            content[id] = json.data.join("\n");
            let group = categories.indexOf(json.category);
            nodes.push({
                id: id,
                label: censor ? (json.hash.substring(0, 5) + "…") : json.name,
                group: group,
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

        renderNetwork();
    })
    .catch((err) => { 
        document.getElementById("lore-field").value = `Search failed: ${err}`;
    });
}

export function setupLore() {
    // Update current data with what we stored
    const loreData = localStorage.getItem("lore");
    if (loreData !== null) {
        for (let e of loreData.split(",")) {
            searchItem(e);
        }
    }

    // New lore input
    const loreInput = document.getElementById("lore-input");
    document.getElementById("lore-form").addEventListener("submit", e => {
        e.preventDefault();
        const inputValue = loreInput.value.toLowerCase().replaceAll(" ", "").replaceAll(",", "");
        searchItem(inputValue);
        loreInput.value = "";
    });

    // Hide/show names
    document.getElementById("lore-censor").addEventListener("change", e => {
        censor = e.target.checked;
        for (let n of nodes) {
            n.label = censor ? (n.hash.substring(0, 5) + "…") : n.name;
        }
        renderNetwork();
    });

    document.getElementById("lore-delete").addEventListener("click", e => {
        if (confirm("Are you sure you want to delete lore data from local storage?")) {
            localStorage.removeItem("lore");
            alert("Local storage was deleted");
        }
    });
}

function renderNetwork() {
    const container = document.getElementById('lore-network');

    const data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(links)
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

    const network = new vis.Network(container, data, options);
    network.on('click', function(properties) {
    var ids = properties.nodes;
    if (ids.length > 0) {
        document.getElementById("lore-field").value = content[ids[0]];
    }
});
}