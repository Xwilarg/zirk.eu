import { useState } from "react";
import { randInt } from "./utils";

let hobbies = [
    <span>
        This is a test hobby 1
    </span>,
    <span>
        This is a test hobby 2
    </span>
];

export default function InfoHobbyForm() {
    const [hobbyIndex, setHobbyIndex] = useState(-1);

    if (hobbyIndex === -1)
    {
        return <>
            Welcome in my hobby list, click on the button below to get started:<br/>
            <button className="button" onClick={() => { setHobbyIndex(randInt(hobbies.length)); }}>Get random hobby</button>
        </>
    }

    return <>
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