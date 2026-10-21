namespace ZirkBackend.Models;

public class NewsItem
{
    public required string Date { set; get; }
    public required string Title { set; get; }
    public string? Subtitle { set; get; }
    public required string Image { set; get; }
    public required string[] Text { set; get; }
    public required bool Nsfw { set; get; }
    public required string[] Tags { set; get; }
    public required NewsLink[] Links { set; get; }
    public string? Orientation { set; get; }
}

public class NewsLink
{
    public required string Name { set; get; }
    public required string Link { set; get; }
}