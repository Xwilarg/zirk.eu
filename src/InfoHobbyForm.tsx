import { useState } from "react";
import { isNsfw, randInt } from "./utils";

export default function InfoHobbyForm() {
    const [hobbyIndex, setHobbyIndex] = useState(1);

    let nsfw = isNsfw();

    let hobbies = [
    <div>
        <h3>Speedrunning</h3>
        <span className="is-flex flex-center-hor">
            <iframe className="youtube-embed" src="https://www.youtube-nocookie.com/embed/KAtmTxX4OR8?rel=0" frameBorder="0" allow="picture-in-picture; web-share; fullscreen;" referrerPolicy="strict-origin-when-cross-origin"></iframe>
        </span>
        <br/>
        Speedrunning is something I would love to jump back more into but it's quite time consuming<br/>
        My favorite games to speedrun are ones that rely more on movements and aim than glitches and as thus <a href="https://www.speedrun.com/tf2/runs/yjq4vrom" target="_blank">Team Fortress 2</a> quickly became my favorite one<br/>
        Hoping to find more time to jump back into these someday!
    </div>,
    <div>
        <h3>Mahjong</h3>
        <img className="fit-width" src="/data/img/about/Majsoul4P.jpg" />
        I got into mahjong mainly thanks to Mahjong Soul { nsfw === "NSFW" ? <>and some emulated porn game called Animahjong</> : <></> }, and with that Mahjong Soul stayed my favorite platform to play on<br/>
        I'm quite stuck in <a href="https://amae-koromo.sapk.ch/player/106970934/9.8" target="_blank">expert rank</a> for now but hopefully I'll get out of there someday<br/>
        My proudest achievement was actually managing to play in a (beginner) mahjong place in Tokyo, yay :D
    </div>
];

    if (hobbyIndex === -1)
    {
        return <>
            Welcome in my hobby list, click on the button below to get started (I'm slowly adding things here)<br/>
            <button className="button" onClick={() => { setHobbyIndex(randInt(hobbies.length)); }}>Get random hobby</button>
        </>
    }

    return <>
        Welcome in my hobby list, click on the button below to get started:<br/>
        <button className="button" onClick={() => {
            let index;
            do
            {
                index = randInt(hobbies.length);
            } while (index === hobbyIndex);
            setHobbyIndex(index);
        }}>Get random hobby</button><br/>
        { hobbies[hobbyIndex] }
    </>
}