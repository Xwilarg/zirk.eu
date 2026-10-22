namespace ZirkBackend.Models;

public class OCInfo
{
}

public class OCImageInfo
{
    public required string Title { set; get; }
    public required string[] With { set; get; }
}

public class OCImageDetailInfo
{
    public required string Link { set; get; }
    public required bool Nsfw { set; get; }
    public bool? Default { set; get; }
}