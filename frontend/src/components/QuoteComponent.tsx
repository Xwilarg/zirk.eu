import { useEffect, useState } from "react";
import { useApi } from "../api/useApi";
import { isNsfwNumber } from "../utils";

export default function QuoteComponent() {
    const api = useApi();

    const [quote, setQuote] = useState<string | null>(null);

    const nsfwNb = isNsfwNumber();

    useEffect(() => {
        api.getQuote(nsfwNb).then(x => setQuote(x));
    }, []);

    if (quote === null) return <div id="intro-quote-container"></div>;

    return <div id="intro-quote-container">
        <p id="intro-quote" dangerouslySetInnerHTML={{ __html: quote! }}></p>
    </div>
}
