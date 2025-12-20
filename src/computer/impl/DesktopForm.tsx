import { useEffect, useRef, useState } from "react"

export default function DesktopForm() {
    const [text, setText] = useState<string[]>([
        "Game file not found...",
        "> "
    ]);
    const [input, setInput] = useState<string>("");
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    function sendCommand() {
        setText(x => {
            let data = [ ...x ];
            data[data.length - 1] += input;
            data.push("System is not ready to take order yet, please come back later...");
            data.push("> ");
            setInput("");

            return data;
        });
    }

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
        }
    }, [ text ]);

    return <>
        <textarea ref={textAreaRef} id="screen-desktop-display" readOnly={true} value={text.join("\n")}>
        </textarea>
        <span id="screen-desktop-input">
            <input type="text"
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter" && input)
                    {
                        sendCommand();
                    }
                }}
            />
            <button onClick={() => {
                if (input) {
                    sendCommand();
                }
            }}><span className="material-symbols-outlined">send</span></button>
        </span>
    </>
}