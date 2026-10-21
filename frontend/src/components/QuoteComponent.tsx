import quotesData from "../../data/json/quotes.json"
import { useState } from "react";
import { isNsfw, randInt } from "../utils";

const quotes = quotesData;

export default function QuoteComponent() {
    const flattenQuotes = quotes.filter(x => isNsfw() === "NSFW" || x.id !== "nsfw").map(x => x.data).reduce((a, b) => a.concat(b));

    const [quoteIndex, setQuoteIndex] = useState(randInt(flattenQuotes.length));

    return <div id="intro-quote-container">
        <p id="intro-quote" dangerouslySetInnerHTML={{ __html: flattenQuotes[quoteIndex] }}></p>
    </div>
}
