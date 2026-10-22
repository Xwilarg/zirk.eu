namespace ZirkBackend.Models;

public class GameItem
{
    public required string Name { set; get; }
    public required string Image { set; get; }
    public required string[] With { set; get; }
    public required string Date { set; get; }
}
