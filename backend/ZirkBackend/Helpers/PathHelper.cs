using System.Diagnostics;
using System.Text.Json;
using ZirkBackend.Models;

namespace ZirkBackend.Helpers;

public static class PathHelper
{
    public static bool IsDebug => Debugger.IsAttached || AppDomain.CurrentDomain.FriendlyName == "ef" || Environment.GetEnvironmentVariable("TEST") == "1";
    public static string DataPath => IsDebug ? "./" : "/data/";

    public static Credentials GetCredentials(JsonSerializerOptions opts)
    {
        return JsonSerializer.Deserialize<Credentials>(File.ReadAllText($"{PathHelper.DataPath}credentials.json"), opts)!;
    }
}