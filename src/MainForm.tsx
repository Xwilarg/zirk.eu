import "../css/index.css"
import SketchForm from "./computer/ComputerForm"
import NavigationForm from "./NavigationForm"

export default function MainForm() {
    return <>
        <NavigationForm />
        <div className="container">
            Welcome on my website, I wanted to finish this before going to sleep so I decided to push this website with most features missing<br/>
            My hobbies are putting dotted underline decoration on my &lt;a&gt; tags and lying about my hobbies<br/>
            On the meantime to have more features you can send me a mail to <a href="mailto:xwilarg@protonmail.com">xwilarg@protonmail.com</a> and tell me all about your favorite cheese
        </div>
        <SketchForm />
    </> 
}