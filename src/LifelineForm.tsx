import LifelineComponent from "./components/LifelineComponent";
import NavigationComponent from "./components/NavigationComponent";
import QuoteComponent from "./components/QuoteComponent";
import LifelineIntroComponent from "./components/intro/LifelineIntroComponent";

export default function LifelineForm() {

    return <>
        <QuoteComponent />
        <LifelineIntroComponent />
        <NavigationComponent />
        <LifelineComponent />
    </>
}