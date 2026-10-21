namespace ZirkBackend.Models;

public class SheepItem
{
    public required string Name { set; get; }
    public required string Image { set; get; }
    public required SheepLink Link { set; get; }
    public required string CreateDate { set; get; }
}

public class SheepLink
{
    public required string Name { set; get; }
    public required string Value { set; get; }
}