using System.Diagnostics;
using System.Text.Json;
using ZirkBackend.Models;

namespace ZirkBackend.Services;

public class FileService(JsonSerializerOptions options, Random random)
{
    private readonly QuoteItem[] _quotes = JsonSerializer.Deserialize<QuoteItem[]>(File.ReadAllText($"{Path}json/quotes.json"), options)!;
    private readonly IEnumerable<GameJamItem> _gamejams = JsonSerializer.Deserialize<GameJamInfo>(File.ReadAllText($"{Path}json/gamejam.json"), options)!.Jams;
    private readonly IEnumerable<FriendItem> _friends = JsonSerializer.Deserialize<IEnumerable<FriendItem>>(File.ReadAllText($"{Path}json/friends.json"), options)!;
    private readonly IEnumerable<NewsItem> _news = JsonSerializer.Deserialize<IEnumerable<NewsItem>>(File.ReadAllText($"{Path}json/news.json"), options)!;
    private readonly IEnumerable<SheepItem> _sheep = JsonSerializer.Deserialize<IEnumerable<SheepItem>>(File.ReadAllText($"{Path}json/sheep.json"), options)!;
    private readonly IEnumerable<ProjectItem> _projects = JsonSerializer.Deserialize<IEnumerable<ProjectItem>>(File.ReadAllText($"{Path}json/projects.json"), options)!;
    private readonly IReadOnlyDictionary<string, GameItem[]> _games = JsonSerializer.Deserialize<IReadOnlyDictionary<string, GameItem[]>>(File.ReadAllText($"{Path}json/game.json"), options)!;
    private readonly AchievementItem[] _achievements = JsonSerializer.Deserialize<IEnumerable<AchievementItem>>(File.ReadAllText($"{Path}json/achievements.json"), options)!.ToArray();
    private readonly OCInfo _ocs = new()
    {
        Artists = JsonSerializer.Deserialize<Dictionary<string, string>>(File.ReadAllText($"{Path}json/ocs/artists.json"), options)!,
        Ocs = [
            ..Directory.GetFiles($"{Path}json/ocs")
                .Where(x => !new[] { "artists.json", "others.json" }.Contains(new FileInfo(x).Name))
                .Select(x => JsonSerializer.Deserialize<OCItem>(File.ReadAllText(x), options)!),
            ..JsonSerializer.Deserialize<IEnumerable<OCItem>>(File.ReadAllText($"{Path}json/ocs/others.json"), options)!
        ]
    };

    private static string Path
        => Debugger.IsAttached ? "../../data/" : "/data/";

    public string GetRandomQuote(NsfwStatus nsfw)
    {
        var possibles = _quotes.Where(x => nsfw == NsfwStatus.Nsfw || x.Id != "nsfw").SelectMany(x => x.Data).ToArray();
        return possibles[random.Next(0, possibles.Length)];
    }

    public IEnumerable<GameJamItem> GetGamejams(NsfwStatus nsfw)
    {
        return _gamejams.Where(x => nsfw != NsfwStatus.FullSfw || !x.Nsfw);
    }

    public IEnumerable<FriendItem> GetFriends()
    {
        return _friends;
    }

    public IEnumerable<NewsItem> GetNews(NsfwStatus nsfw)
    {
        return _news.Where(x => nsfw != NsfwStatus.FullSfw || !x.Nsfw);
    }

    public IEnumerable<SheepItem> GetSheep()
    {
        return _sheep;
    }

    public IEnumerable<ProjectItem> GetProjects(NsfwStatus nsfw)
    {
        return _projects.Where(x => nsfw != NsfwStatus.FullSfw || !x.Nsfw);
    }

    public IReadOnlyDictionary<string, GameItem[]> GetGames()
    {
        return _games;
    }

    public AchievementItem[] GetAchievements()
    {
        return _achievements;
    }

    public OCInfo GetOCs()
    {
        return _ocs;
    }
}
