using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;
using System.Text.Json;
using System.Text;
using Zirk.Backend.Models;
using FakeTerminal;

namespace Zirk.Backend.Controllers.Websocket;

[ApiController]
[Route("/ws/terminal/")]
public class FakeTerminalController : ControllerBase
{
    private readonly ILogger<FakeTerminalController> _logger;
    private JsonSerializerOptions _options;

    public FakeTerminalController(ILogger<FakeTerminalController> logger, JsonSerializerOptions options)
    {
        _logger = logger;
        _options = options;
    }

    [Route("")]
    public async Task Get()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            // New connection
            var client = await HttpContext.WebSockets.AcceptWebSocketAsync("client");
            FakeTerminal.Client term = new TerminalInstance(".").CreateClient();

            while (true)
            {
                var buffer = new byte[4096];
                WebSocketReceiveResult? response;

                try
                {
                    response = await client.ReceiveAsync(buffer, CancellationToken.None);
                }
                catch (WebSocketException)
                {
                    break;
                }

                if (response.MessageType == WebSocketMessageType.Text)
                {
                    // Skip empty bytes at the end
                    buffer = buffer.TakeWhile((v, index) => buffer.Skip(index).Any(w => w != 0x00)).ToArray();

                    try
                    {
                        var baseMsg = JsonSerializer.Deserialize<TerminalMessage>(Encoding.UTF8.GetString(buffer), _options);

                        if (baseMsg.Message == MessageType.Heartbeat)
                        {
                            // Heartbeat, we just send one back
                            await client.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                        }
                        else if (baseMsg.Message == MessageType.Command)
                        {
                            var termMsg = (TerminalCommand)baseMsg;
                            var output = term.ParseCommand(termMsg.Command);

                            var msg = JsonSerializer.Serialize(new TerminalResponse()
                            {
                                Message = MessageType.Command,
                                CurrentPath = term.CurrentDir.FullName
                            }, _options);
                            await client.SendAsync(Encoding.UTF8.GetBytes(msg), WebSocketMessageType.Text, true, CancellationToken.None);
                        }
                        else throw new NotImplementedException();
                    }
                    catch (Exception e)
                    {
                        _logger.LogError(e, e.Message);
                    }
                }
                else if (response.MessageType == WebSocketMessageType.Close)
                {
                    break;
                }
            }
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status405MethodNotAllowed;
        }
    }
}
