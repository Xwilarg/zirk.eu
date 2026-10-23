namespace ZirkBackend.Models;

public class GoalCategoryItem
{
    public required Dictionary<string, Dictionary<string, GoalItem?>> Data { set; get; }
}

public class GoalItem
{
    public string? Image { set; get; }
    public string[]? Images { set; get; }
    public string? Youtube { set; get; }

    public required string[] With { set; get; }
}
