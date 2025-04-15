let discovered = {};
let links = [];
let nodes = [];

let colors = [ "#ff7f7f" ];

let categories = [ "katsis" ];

export function setupLore() {
    const loreInput = document.getElementById("lore-input");
    document.getElementById("lore-form").addEventListener("submit", e => {
        e.preventDefault();
        const inputValue = loreInput.value.toLowerCase();
        fetch("/php/lore.php", {
            method: 'POST',
            body: inputValue
        })
        .then(resp => resp.ok ? resp.json() : Promise.reject(`${resp.status}`))
        .then(json => {
            document.getElementById("lore-field").value = json.data.join("\n");
            if (!(inputValue in discovered)) {
                const id = Object.keys(discovered).length;
                discovered[inputValue] = id;
                let group = categories.indexOf(json.category);
                nodes.push({ id: id, label: json.name, group: group, color: colors[group], shape: "circle" });

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
        loreInput.value = "";
    });
}

function renderNetwork() {
    const container = document.getElementById('lore-network');

    const data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(links)
    };
    const options = {};

    new vis.Network(container, data, options);
}