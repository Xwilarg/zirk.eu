import { randInt } from "../utils";

const quotes = [
    "Now with 20% more minipis!",
    "Still awaiting Indra new website",
    "Fighting to get a better UX than Fractal since 2023 (I'm not winning)",
    "Red and green gives yellow",
    "<a href='/secret/quote' class='ignore'>Of course you can't click this quote!</a>",
    "[object Object]",
    "My favorite ice creams are pistachio and rum raisin",
    "Eöna, Sïon, Noïra, Laïka, Mïa, Sër, Misïe, Fäe, Füre"
];

export default function QuoteComponent() {
    let randomQuote = randInt(quotes.length);

    return <div id="intro-top">
        <p id="intro-quote" dangerouslySetInnerHTML={{ __html: quotes[randomQuote] }}></p>
    </div>
}
