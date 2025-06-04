let socket = null;
let endpoint = "wss://zirk.eu/ws/terminal";

export function setupTerminal() {
    document.getElementById("terminal-form")!.addEventListener("submit", e => {
        e.preventDefault();
        let input = document.getElementById("terminal-field") as HTMLInputElement;
        let inputValue = input.value;
        if (socket === null)
        {
            socket = new WebSocket(endpoint);
            socket.addEventListener("open", (_) => {
                console.log("Connected");
                socket.send(JSON.stringify({
                    message: 1,
                    command: inputValue
                }));
            });
            socket.addEventListener("close", async (_) => {
                socket = null;
            });
            socket.addEventListener("message", async function(e) {
                let inputValue = input.value;
                const json = JSON.parse(e.data);
                (document.getElementById("terminal-output") as HTMLInputElement).value += `${json.currentPath} > ${json.currentCmd}\n${json.output}\n\n`;
                input.scrollTop = input.scrollHeight;
            });
        }
        else
        {
            socket.send(JSON.stringify({
                message: 1,
                command: inputValue
            }));
        }
        input.value = "";
    });
}