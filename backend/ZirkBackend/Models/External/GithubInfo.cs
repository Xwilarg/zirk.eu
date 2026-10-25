namespace ZirkBackend.Models.External;

public class GithubInfo
{
    public required GithubCommitInfo Commit { set; get; }
}

public class GithubCommitInfo
{
    public required string Message { set; get; }
    public required GithubAuthorInfo Committer { set; get; }
}

public class GithubAuthorInfo
{
    public required DateTime Date { set; get; }
}