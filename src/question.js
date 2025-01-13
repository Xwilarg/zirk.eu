export function setupQuestions()
{
    for (let qu of document.getElementsByClassName("question")) {
        qu.addEventListener("click", _ => {
            const target = document.getElementById(`answer-${qu.id}`);
            if (target.classList.contains("is-hidden")) target.classList.remove("is-hidden");
            else target.classList.add("is-hidden");
        });
    }
}