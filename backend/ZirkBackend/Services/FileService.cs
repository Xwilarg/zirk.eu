using System.Diagnostics;
using System.Text.Json;
using ZirkBackend.Models;

namespace ZirkBackend.Services;

public class FileService(JsonSerializerOptions options, Random random)
{
    private readonly QuoteItem[] _quotes = JsonSerializer.Deserialize<QuoteItem[]>($"{Path}json/quotes.json", options);

    private static string Path
        => Debugger.IsAttached ? "../frontend/data/" : "/data/";

    public string RandomQuote(NsfwStatus nsfw)
    {
        var possibles = _quotes.Where(x => nsfw == NsfwStatus.Nsfw || x.Id != "nsfw").SelectMany(x => x.Data).ToArray();
        return possibles[random.Next(0, possibles.Length)];
    }
}
