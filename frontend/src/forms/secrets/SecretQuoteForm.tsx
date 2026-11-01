import { useEffect } from "react"
import { useApi } from "../../api/useApi";

export default function SecretQuoteForm() {
    const api = useApi();

    useEffect(() => {
        api.unlockAchievement("CANT_CLICK_QUOTE");
    }, []);

    return <>
        <div className="secret-quote">
            You clicked the quote!
        </div>
    </>
}