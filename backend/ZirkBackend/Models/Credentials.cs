namespace ZirkBackend.Models;

public class Credentials
{
    public required string GithubToken { set; get; }
    public required string SecurityKey { set; get; }
    public required DiscordCredentials Discord { set; get; }
}

public class DiscordCredentials
{
    public required string Id { set; get; }
    public required string Secret { set; get; }
}
