import { randInt } from "../utils";
import quotesData from "../../data/json/quotes.json"

const quotes = quotesData;

export default function QuoteComponent() {
    let randomQuote = randInt(quotes.length);

    return <div id="intro-top">
        <p id="intro-quote" dangerouslySetInnerHTML={{ __html: quotes[randomQuote] }}></p>
    </div>
}
