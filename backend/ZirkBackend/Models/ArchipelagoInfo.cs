namespace ZirkBackend.Models;

public class ArchipelagoItem
{
    public required string[] Info { set; get; }
    public required ArchipelagoPersonItem[] With { set; get; }
    public required string Start { set; get; }
}

public class ArchipelagoPersonItem
{
    public required int Id { set; get; }
    public string? Name { set; get; }
    public required string Game { set; get; }
    public required string[] Hints { set; get; }
    public required string Version { set; get; }
    public required int Checks { set; get; }
    public required string State { set; get; }
    public required bool Deathlink { set; get; }
}
