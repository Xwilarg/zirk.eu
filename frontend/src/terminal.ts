let socket = null;
let endpoint = "wss://zirk.eu/ws/terminal"

export function setupTerminal() {
    document.getElementById("terminal-form")!.addEventListener("submit", e => {
        e.preventDefault();
        let inputValue = (document.getElementById("terminal-field") as HTMLInputElement).value;
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
                const json = JSON.parse(e.data);
                (document.getElementById("terminal-output") as HTMLInputElement).value = json.output;
            });
        }
        else
        {
            socket.send(JSON.stringify({
                message: 1,
                command: inputValue
            }));
        }
        (document.getElementById("terminal-field") as HTMLInputElement).value = "";
    });
}