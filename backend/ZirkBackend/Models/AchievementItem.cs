namespace ZirkBackend.Models;

public class AchievementItem
{
    public required string Id { set; get; }
    public required string Name { set; get; }
    public required string Type { set; get; }

    public string? Html { set; get; }
    public string? Image { set; get; }
}
