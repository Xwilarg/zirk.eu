namespace ZirkBackend.Models;

public class ProjectItem
{
    public required string Name { set; get; }
    public string? Category { set; get; }
    public required ProjectImageItem[] Images { set; get; }
    public required ProjectLinkItem[] Links { set; get; }
    public required bool Nsfw { set; get; }
}

public class ProjectImageItem
{
    public required string Name { set; get; }
    public required string Description { set; get; }
}

public class ProjectLinkItem
{
    public required string Name { set; get; }
    public required string Content { set; get; }
}