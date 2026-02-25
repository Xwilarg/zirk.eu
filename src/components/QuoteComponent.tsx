import { isNsfw, randInt } from "../utils";
import quotesData from "../../data/json/quotes.json"

const quotes = quotesData;

export default function QuoteComponent() {
    const flattenQuotes = quotes.filter(x => isNsfw() === "NSFW" || x.id !== "nsfw").map(x => x.data).reduce((a, b) => a.concat(b));
    let randomQuote = randInt(flattenQuotes.length);

    return <div id="intro-top">
        <p id="intro-quote" dangerouslySetInnerHTML={{ __html: flattenQuotes[randomQuote] }}></p>
    </div>
}
