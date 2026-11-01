import { useEffect, useState } from "react";
import QuoteComponent from "../../components/QuoteComponent";
import GenericBox from "../../boxes/GenericBox";
import { useApi } from "../../api/useApi";

export function DiscordLoginForm() {
    const api = useApi();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/auth/discord/token")
            .then(async r => r.ok ? r.json() : Promise.reject(await r.text()))
            .then(({ token, displayName }) => {
                api.setToken(token, displayName)
                window.close();
            })
            .catch((e) => setError(e))
    }, []);

    if (error === null) {
        return <div>
            <QuoteComponent />
            <div className="is-flex flex-center-hor">
                <GenericBox name="Authentification" nsfw={false} text="Connecting..." />
            </div>
        </div>
    }
    return <div>
        <QuoteComponent />
        <div className="is-flex flex-center-hor">
            <GenericBox name="Authentification" nsfw={false} text={`Authentification failed: ${error}`} />
        </div>
    </div>
}