namespace ZirkBackend.Models.Responses;

public class ProjectGithubResponse
{
    public required DateTime LastCommitDate { set; get; }
    public required string? LastCommitMessage { set; get; }
}
