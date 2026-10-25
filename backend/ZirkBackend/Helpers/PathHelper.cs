using System.Diagnostics;

namespace ZirkBackend.Helpers;

public static class PathHelper
{
    public static bool IsDebug => Debugger.IsAttached || AppDomain.CurrentDomain.FriendlyName == "ef" || Environment.GetEnvironmentVariable("TEST") == "1";
    public static string DataPath => IsDebug ? "./" : "/data/";
}