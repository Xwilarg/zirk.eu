using System.Diagnostics;
using System.Text.Json;
using ZirkBackend.Models;

namespace ZirkBackend.Services;

public class FileService(JsonSerializerOptions options, Random random)
{
    private readonly QuoteItem[] _quotes = JsonSerializer.Deserialize<QuoteItem[]>(File.ReadAllText($"{Path}json/quotes.json"), options)!;
    private readonly GameJamItem[] _gamejams = JsonSerializer.Deserialize<GameJamInfo>(File.ReadAllText($"{Path}json/gamejam.json"), options)!.Jams;
    private readonly FriendItem[] _friends = JsonSerializer.Deserialize<FriendItem[]>(File.ReadAllText($"{Path}json/friends.json"), options)!;
    private readonly NewsItem[] _news = JsonSerializer.Deserialize<NewsItem[]>(File.ReadAllText($"{Path}json/news.json"), options)!;
    private readonly SheepItem[] _sheep = JsonSerializer.Deserialize<SheepItem[]>(File.ReadAllText($"{Path}json/sheep.json"), options)!;
    private readonly ProjectItem[] _projects = JsonSerializer.Deserialize<ProjectItem[]>(File.ReadAllText($"{Path}json/projects.json"), options)!;

    private static string Path
        => Debugger.IsAttached ? "../../data/" : "/data/";

    public string GetRandomQuote(NsfwStatus nsfw)
    {
        var possibles = _quotes.Where(x => nsfw == NsfwStatus.Nsfw || x.Id != "nsfw").SelectMany(x => x.Data).ToArray();
        return possibles[random.Next(0, possibles.Length)];
    }

    public IEnumerable<GameJamItem> GetGamejams(NsfwStatus nsfw)
    {
        return _gamejams.Where(x => nsfw != NsfwStatus.FullSfw || !x.Nsfw).ToArray();
    }

    public IEnumerable<FriendItem> GetFriends()
    {
        return _friends.ToArray();
    }

    public IEnumerable<NewsItem> GetNews(NsfwStatus nsfw)
    {
        return _news.Where(x => nsfw != NsfwStatus.FullSfw || !x.Nsfw).ToArray();
    }

    public IEnumerable<SheepItem> GetSheep()
    {
        return _sheep.ToArray();
    }

    public IEnumerable<ProjectItem> GetProjects(NsfwStatus nsfw)
    {
        return _projects.Where(x => nsfw != NsfwStatus.FullSfw || !x.Nsfw).ToArray();
    }
}
