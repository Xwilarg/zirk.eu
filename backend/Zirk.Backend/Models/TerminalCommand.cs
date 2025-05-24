namespace Zirk.Backend.Models;

public enum MessageType
{
    Heartbeat,
    Command
}

public class TerminalMessage
{
    public MessageType Message { set; get; }
}

public class TerminalCommand : TerminalMessage
{
    public string Command { set; get; }
}

public class TerminalResponse : TerminalMessage
{
    public string Output { set; get; }
    public string CurrentPath { set; get; }
}
