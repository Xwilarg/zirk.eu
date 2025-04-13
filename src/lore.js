export function setupLore() {
    const loreInput = document.getElementById("lore-input");
    document.getElementById("lore-form").addEventListener("submit", e => {
        e.preventDefault();
        fetch("/php/lore.php", {
            method: 'POST',
            body: loreInput.value
        })
        .then(resp => resp.ok ? resp.text() : Promise.reject(`${resp.status}`))
        .then(text => {
            document.getElementById("lore-field").value = text;
        })
        .catch((err) => { 
            document.getElementById("lore-field").value = `Search failed: ${err}`;
        });
        loreInput.value = "";
    });
}