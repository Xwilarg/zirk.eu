import { useEffect } from "react"
import { UnlockAchievement } from "../../models/Achievement"

export default function SecretQuoteForm() {
    useEffect(() => {
        UnlockAchievement("CANT_CLICK_QUOTE");
    }, []);

    return <>
        <div className="secret-quote">
            You clicked the quote!
        </div>
    </>
}