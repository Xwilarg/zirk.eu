import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import GameIntroComponent from "./components/intro/GameIntroComponent";

export default function GameForm() {
    return <>
        <QuoteComponent/>
        <GameIntroComponent />
        <NavigationComponent />
        <div className="container box">
            <p className="mark">Game</p>
        </div>
    </>
}