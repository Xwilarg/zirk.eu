import { forwardRef, useEffect, useRef, useState } from "react"
import type { LoadedGame } from "../SketchForm";
import { getLoaderFiles } from "./game/GameForm";

interface CommandInfo
{
    name: string,
    optionalParamCount: number,
    mandatoryParamCount: number,
    help: string,
    deepHelp: string,
    command: ((props: DesktopPropsForm, args: string[]) => string)
}

let commands: Array<CommandInfo> = [
    {
        name: "help",
        optionalParamCount: 1,
        mandatoryParamCount: 0,
        help: "(command) Display the list of commands or help about a specific command",
        deepHelp:
            "When used with no argument, show the list of all commands available\n" +
            "When used with another command name as argument, show deeper details on what it's for and how to use it",
        command: (props, args) => {
            if (args.length === 0) return commands.map(x => `${x.name}: ${x.help}`).join("\n");

            const cmd = args[0];
            const target = commands.find(x => x.name === cmd);
            if (target) return target.deepHelp;
            
            return "Command name not found, type 'help' for the list of commands";
        }
    },
    {
        name: "trace",
        optionalParamCount: 1,
        mandatoryParamCount: 1,
        help: "[0/1] Trace cartridges instead of loading their content",
        deepHelp: 
            "Show debug information about a cartridge\n" +
            "To enable this, set trace mode to 1 and load a cartridge\n" +
            "This will boot the computer on trace mode instead of loading cartridge data",
        command: (props, args) => {
            const bool = args[0];
            if (bool !== "0" && bool !== "1") {
                return "Invalid parameter, type 'help' for the list of commands";
            }
            props.updateTrace(bool === "1");
            return `Trace status was updated to ${bool}`;
        }
    },
    {
        name: "module",
        optionalParamCount: 1,
        mandatoryParamCount: 1,
        help: "[module] Toggle a module display",
        deepHelp:
            "Toggle which module is available on the main page" +
            "Calling this command on an existing module will disable it, calling it again will enable it back",
        command: (props, args) => {
            const res = props.toggleModule("module", args[0]);
            if (!res) return `The module ${args[0].toLowerCase()} could not be found`;
            return `The module ${args[0].toLowerCase()} was successfully toggled`;
        }
    }
];

function parseCommand(props: DesktopPropsForm, cmd: string, args: string[]): string {
    const target = commands.find(x => x.name === cmd);

    if (target) {
        if (target.mandatoryParamCount !== args.length && target.optionalParamCount !== args.length) {
            return "Invalid amount of parameter, type 'help' for the list of commands";
        }
        return target.command(props, args);
    }
    return "Command not found, type 'help' for the list of commands";
}

interface DesktopPropsForm
{
    tracedGame: LoadedGame | null,
    updateTrace: ((isTrace: boolean) => void),
    toggleModule: ((cmd: string, args: string) => boolean)
}

const DesktopForm = forwardRef((
    { tracedGame, updateTrace, toggleModule }: DesktopPropsForm,
    _
) => {
    const [text, setText] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const [canInput, setCanInput] = useState<boolean>(true);

    function sendCommand() {
        setText(x => {
            let data = [ ...x ];
            data[data.length - 1] += input;
            let args = input.trim().split(' ').map(x => x.trim().toLowerCase()).filter(x => x !== "");
            data.push(parseCommand({ tracedGame, updateTrace, toggleModule }, args[0], args.slice(1)));
            data.push("> ");
            setInput("");

            return data;
        });
    }

    useEffect(() => {
        if (tracedGame) {
            setCanInput(false);
            let text = [
                "Game cartridge found, trace mode is set to 1 (use trace 0 to unset)",
                `Engine: ${tracedGame.defaultEngine} ${tracedGame.defaultUnityVersion}`
            ];
            let data = getLoaderFiles(tracedGame.defaultResFolder, tracedGame.defaultFilename, tracedGame.defaultEngine, tracedGame.defaultUnityVersion);
            let pendingData = data.length;
            let ok = 0;

            for (let e of data) {
                fetch(e, {
                    method: 'HEAD'
                })
                .then(x => {
                    pendingData--;
                    if (x.ok) {
                        ok++;
                    }

                    if (pendingData === 0) {
                        text.push(`Loader validated: ${ok} / ${data.length}`);
                        text.push("> ");
                        setCanInput(true);
                        setText(text);
                    }
                });
            }
        } else {
            setText([
                "Game cartridge not found. Please insert a game to retry.",
                "> "
            ]);
        }
    }, [ tracedGame ])

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
        }
    }, [ text ]);

    return <>
        <textarea ref={textAreaRef} id="screen-desktop-display" readOnly={true} value={text.join("\n")}>
        </textarea>
        <span id="screen-desktop-input">
            <input type="text" disabled={!canInput}
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter" && input)
                    {
                        sendCommand();
                    }
                }}
            />
            <button disabled={!canInput} onClick={() => {
                if (input) {
                    sendCommand();
                }
            }}><span className="material-symbols-outlined">send</span></button>
        </span>
    </>
});

export default DesktopForm;