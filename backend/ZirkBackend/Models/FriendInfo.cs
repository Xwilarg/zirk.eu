using System.Text.Json;

namespace ZirkBackend.Models;

public class FriendItem
{
    public required string Meet { set; get; }
    public required string Name { set; get; }
    public string? Gamejam { set; get; }

    public required FriendLifelineItem Lifeline { set; get; }

    public required Dictionary<string, JsonElement> Boxes { set; get; }
}

public class FriendLifelineItem
{
    public required string Type { set; get; }
    public string? Name { set; get; }
    public string? Id { set; get; }
    public string? Hash { set; get; }
}