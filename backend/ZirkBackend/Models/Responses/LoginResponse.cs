namespace ZirkBackend.Models.Responses;

public class LoginResponse
{
    public string DisplayName { set; get; }
    public string Token { set; get; }
    public IEnumerable<string> Achievements { set; get; }
    public int? NsfwLevel { set; get; }
}
