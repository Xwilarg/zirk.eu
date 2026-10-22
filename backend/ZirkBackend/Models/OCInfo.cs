namespace ZirkBackend.Models;

public class OCInfo
{
    public required Dictionary<string, string> Artists { set; get; }
    public required OCItem[] Ocs { set; get; }
}

public class OCItem
{
    public required string Name { set; get; }
    public required OCMetadataInfo Metadata { set; get; }
    public OCImageInfo[]? Images { set; get; }
}

public class OCMetadataInfo
{
    public required string Gender { set; get; }
    public required string Location { set; get; }
    public required string Species { set; get; }

    public string[]? Description { set; get; }

    public string[]? Coauthors { set; get; }
    public string? Folder { set; get; }
    public string[]? History { set; get; }
    public string[]? Personality { set; get; }
    public string[]? Sexuality { set; get; }
    public int? Height { set; get; }
    public string? Orientation { set; get; }
    public OCMediaInfo[]? Media { set; get; }
    public string? Power { set; get; }
    public OCVersionInfo[]? Versions { set; get; }
}

public class OCVersionInfo
{
    public required string Name { set; get; }
    public required string Description { set; get; }
}

public class OCMediaInfo
{
    public required string Name { set; get; }
    public required string Image { set; get; }
    public required bool Nsfw { set; get; }
}

public class OCImageInfo
{
    public required string Title { set; get; }
    public required string[] With { set; get; }
    public required string[] Artist { set; get; }
    public string? Date { set; get; }
    public bool? Default { set; get; }
    public required OCImageDetailInfo[] Images { set; get; }
    public string? Type { set; get; }
    public bool? Hide { set; get; }
}

public class OCImageDetailInfo
{
    public required string Link { set; get; }
    public required bool Nsfw { set; get; }
    public bool? Default { set; get; }
}