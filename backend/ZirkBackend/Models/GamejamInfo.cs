namespace ZirkBackend.Models;

public class GameJamInfo
{
    public required GameJamItem[] Jams { set; get; }
}

public class GameJamItem
{
    public required string Name { set; get; }
    public required string FullName { set; get; }
    public required float Duration { set; get; }
    public required string Engine { set; get; }
    public string? Format { set; get; }
    public bool Nsfw { set; get; }
    public required string[] Theme { set; get; }
    public string? Website { set; get; }
    public GamejamSketch? Sketch { set; get; }
    public GamejamRating? Rating { set; get; }
    public required string[] Help { set; get; }
    public required string[] Controls { set; get; }
    public required string Date { set; get; }
    public required string Location { set; get; }
    public string? GitHub { set; get; }
    public required string Event { set; get; }
    public required string ShortEvent { set; get; }
    public string? ImagePosOverrides { set; get; }
    public string? GifPosOverrides { set; get; }
    public required string[] Team { set; get; }
    public required string Ai { set; get; }
}

public class GamejamSketch
{
    public string Folder { set; get; }
    public string Filename { set; get; }
}

public class GamejamRating
{
    public int? Entries { set; get; }
    public int? EntriesRated { set; get; }
    public Dictionary<int, GamejamScore?>? Scores { set; get; }
}

public class GamejamScore
{
    public int? Rank { set; get; }
}