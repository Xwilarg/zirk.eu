export function setupSecret() {
    document.getElementById("console-btn").addEventListener("click", _ => {
        let content = document.getElementById("console-field");
        compile(content.value.split("\n"));
    });

    for (let micropi of document.getElementsByClassName("micropi")) {
        micropi.addEventListener("click", _ => {
            const target = validInstructions.find(x => x.word === micropi.dataset.instruction.toUpperCase());
            if (!target) {
                console.error("Impossible to find minipi matching instruction");
            } else if (myInstructions.some(x => x.word === target.word)) {
                console.warn("Instruction was already added");
                micropi.classList.add("is-hidden");
            } else {
                myInstructions.push(target);
                micropi.classList.add("is-hidden");
                updateMicropiDisplay();
            }
        });
    }
}

function updateMicropiDisplay() {
    document.getElementById("console-data").innerHTML = `${myInstructions.length} micropi${myInstructions.length > 1 ? "s" : ""} are looking at you:<br>`
        + myInstructions.map(x => x.description).join("<br>")
}

class Instruction {
    constructor(word, paramCount, description, action) {
        this.word = word;
        this.description = description;
        this.paramCount = paramCount;
        this.action = action;
    }
}


let buffer;
let finalBuffer;

let validInstructions = [
    new Instruction("ADD", 1, "ADD value: Add a value to the buffer", p => buffer[0] += p),
    new Instruction("REMOVE", 1, "REMOVE value: Remove a value to the buffer", p => buffer[0] -= p),
    new Instruction("PRINT", 0, "PRINT: Print the current value on screen", () => finalBuffer += String.fromCharCode(buffer[0]))
];
let myInstructions = [];
function compile(data) {
    let content = document.getElementById("console-output");

    if (myInstructions.length === 0) {
        content.value = "This place would be much better with some micropis, better go look for them";
        return;
    }

    buffer = [ 0 ];
    finalBuffer = "";

    if (!data.some(x => x.trim() !== "")) {
        if (myInstructions.length === 0) content.value = '"Pi", said the micropi, not understanding what you want from it';
        else content.value = '"Pi", said the micropis, not understanding what you want from them';
        return;
    }


    let startTime = Date.now();
    for (const line of data.filter(x => x.trim() !== "")) {
        const elems = line.split(" ");

        const cmd = elems[0].toUpperCase();
        let target = myInstructions.find(x => x.word === cmd);
        if (target === null) {
            if (myInstructions.length === 0) content.value = 'The micropi is looking around, it looks like you called one of them but nobody matched that name';
            else content.value = 'Micropis are looking at each others, it looks like you called one of them but nobody matched that name';
            return;
        }
        if (elems.length - 1 < target.paramCount) {
            content.value = 'A micropi is looking expectantly at you, looks like it need more information to prossess a command';
            return;
        }
        if (elems.length - 1 > target.paramCount) {
            content.value = 'A micropi is looking confused at you, it can\'t understand what you want if you give it so many information';
            return;
        }

        if (target.paramCount === 1) {
            let arg = parseInt(elems[1]);
            if (isNaN(arg)) {
                content.value = 'A micropi is looking annoyed at you, it doesn\'t know how to treat what you gave to it';
                return;
            }
            target.action(arg);
        } else {
            target.action();
        }
    }
    let endTime = Date.now();
    content.value = `Nano pi created in ${endTime - startTime}ms\n\nOutput:\n${finalBuffer}`;
}