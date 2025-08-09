function clearAll() {
    document.getElementById("answer-lore-rhefir")!.classList.add("is-hidden");
    document.getElementById("answer-lore-nehneh")!.classList.add("is-hidden");
}

export function setupLore() {
    document.getElementById("lore-rhefir")!.addEventListener("click", _ => {
        clearAll();
        document.getElementById("answer-lore-rhefir")!.classList.remove("is-hidden");
    });
    document.getElementById("lore-nehneh")!.addEventListener("click", _ => {
        clearAll();
        document.getElementById("answer-lore-nehneh")!.classList.remove("is-hidden");
    });
}