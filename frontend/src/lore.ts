import { Network, DataSet, Node, Edge } from "vis-network/standalone";

function clearAll() {
    document.getElementById("answer-lore-rhefir")!.classList.add("is-hidden");
    document.getElementById("answer-lore-nehneh")!.classList.add("is-hidden");
}

export function setupLore() {
    document.getElementById("lore-rhefir")!.addEventListener("click", _ => {
        clearAll();
        document.getElementById("answer-lore-rhefir")!.classList.remove("is-hidden");
        renderNetwork();
    });
    document.getElementById("lore-nehneh")!.addEventListener("click", _ => {
        clearAll();
        document.getElementById("answer-lore-nehneh")!.classList.remove("is-hidden");
    });
    for (let btn of document.querySelectorAll(".btn-lore"))
    {
        btn.addEventListener("click", _ => {
            (document.getElementById("lore-world-text") as HTMLTextAreaElement).value = (btn as HTMLElement).dataset.description;
        });
    }
}


interface NodeData extends Node
{
    id: string
    label: string
    group: string
    color: string
    description: string
}

let links: Edge[] = [];
let nodes: NodeData[] = [];

let colors = [ "#bfbfbf", "#7fff94ff", "#7f8cffff", "#d91414ff" ];
let categories = [ "origin", "energy", "dragonborn", "hominidae" ];

function renderNetwork() {
    let json = JSON.parse(document.getElementById("lore-species-json")!.innerHTML);

    const container = document.getElementById('lore-species-network') as HTMLElement;

    for (const l of json.data) {
        let group = categories.indexOf(l.category);
        nodes.push({
            id: l.id,
            label: l.name,
            group: l.category,
            color: colors[group],
            description: l.description.join("\n")
        });
        for (const child of l.children)
        {
            links.push({ from: l.id, to: child });
        }
    }

    const data = {
        nodes: new DataSet<Node>(nodes),
        edges: new DataSet<Edge>(links)
    };
    const options = {
        nodes: {
            shape: "dot",
            size: 25,
            font: {
                color: "white",
                size: 18
            }
        },
        width: "600px"
    };

    const network = new Network(container, data, options);
    network.on('click', function(properties) {
        var ids = properties.nodes;
        if (ids.length > 0) {
            (document.getElementById("lore-species-text") as HTMLTextAreaElement).value = nodes.find(x => x.id === ids[0]).description;
        }
    });
    network.on("stabilizationIterationsDone", function () {
        network.setOptions( { physics: false } );
    });
}