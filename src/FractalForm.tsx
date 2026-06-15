import LoreIntroComponent from "./components/intro/LoreIntroComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import loreData from "../data/json/lore.json";
import FractalIntroComponent from "./components/intro/FractalIntroComponent";

export default function FractalForm() {
    return <>
        <QuoteComponent/>
        <FractalIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <p className="mark">Fractal</p>
        </div>
    </>
}