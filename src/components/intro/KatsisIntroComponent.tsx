import { isNsfw } from "../../utils"

export default function KatsisIntroComponent()
{
    var nsfwStatus = isNsfw();

    return <div className="container box">
        <p className="mark">Introduction</p>
        <div id="intro">
            Project {nsfwStatus === "NSFW" ? <a href="https://zirk.katsis.net" target="_blank">I</a> : "I"} participated in as part of <span className="katsis-highlight">Katsis</span>
        </div>
    </div>
}
