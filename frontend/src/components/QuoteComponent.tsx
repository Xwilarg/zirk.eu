import { useEffect, useState } from "react";
import { useApi } from "../api/useApi";

export default function QuoteComponent() {
    const api = useApi();

    const [quote, setQuote] = useState<string | null>();

    useEffect(() => {
        api.getQuote().then(x => setQuote(x));
    }, []);

    if (quote === null) return <></>;

    return <div id="intro-quote-container">
        <p id="intro-quote" dangerouslySetInnerHTML={{ __html: quote! }}></p>
    </div>
}
