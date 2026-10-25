using System.Net.Http.Headers;
using System.Text.Json;
using ZirkBackend.Database;
using ZirkBackend.Helpers;
using ZirkBackend.Models;
using ZirkBackend.Models.External;
using ZirkBackend.Models.Responses;

namespace ZirkBackend.Services;

public class ApiUpdater
{
    private static HttpClient _githubHttpClient;
    private SqliteContext _ctx;

    public ApiUpdater(SqliteContext ctx, JsonSerializerOptions opts)
    {
        _ctx = ctx;
        if (_githubHttpClient == null)
        {
            _githubHttpClient = new();
            _githubHttpClient.DefaultRequestHeaders.UserAgent.ParseAdd("zirk.eu backend");
            var token = JsonSerializer.Deserialize<Credentials>(File.ReadAllText($"{PathHelper.DataPath}credentials.json"), opts)!.GithubToken;
            _githubHttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }
    }

    public async Task<Dictionary<string, ProjectGithubResponse>> GetGithubCommitsInfoAsync(ProjectItem[] projects)
    {
        var checkState = _ctx.Updates.FirstOrDefault(x => x.Key == "project");
        if (checkState == null)
        {
            _ctx.Updates.Add(new()
            {
                IsChecking = true,
                Key = "project",
                LastCheck = DateTime.UtcNow
            });
            _ctx.SaveChanges();
            checkState = _ctx.Updates.First(x => x.Key == "project");
        }
        else if (checkState.IsChecking || checkState.LastCheck > DateTime.UtcNow.Subtract(TimeSpan.FromHours(1)))
        {
            return projects.ToDictionary(x => x.Name, x =>
            {
                var projectInfo = _ctx.Projects.FirstOrDefault(p => p.Name == x.Name);
                if (projectInfo == null) return new ProjectGithubResponse()
                {
                    LastCommitDate = DateTime.MinValue,
                    LastCommitMessage = null
                };
                return new ProjectGithubResponse()
                {
                    LastCommitDate = projectInfo.LastModification,
                    LastCommitMessage = projectInfo.LastCommitMessage
                }; 
            });
        }
        else
        {
            checkState.IsChecking = true;
            _ctx.SaveChanges();
        }

        Dictionary<string, ProjectGithubResponse> ret = new();
        foreach (var p in projects)
        {
            var project = _ctx.Projects.FirstOrDefault(x => x.Name == p.Name);
            var json = await _githubHttpClient.GetFromJsonAsync<GithubInfo[]>($"https://api.github.com/repos/{p.Github}/commits?per_page=1");
            if (project == null)
            {
                var pCtx = new ProjectContext()
                {
                    Name = p.Name,
                    LastCommitMessage = json[0].Commit.Message,
                    LastModification = json[0].Commit.Committer.Date
                };
                _ctx.Projects.Add(pCtx);
                ret.Add(p.Name, new()
                {
                    LastCommitDate = pCtx.LastModification,
                    LastCommitMessage = pCtx.LastCommitMessage
                });
            }
            else
            {
                project.LastCommitMessage = json[0].Commit.Message;
                project.LastModification = json[0].Commit.Committer.Date;
                ret.Add(p.Name, new()
                {
                    LastCommitDate = project.LastModification,
                    LastCommitMessage = project.LastCommitMessage
                });
            }
        }

        checkState.LastCheck = DateTime.UtcNow;
        checkState.IsChecking = false;
        _ctx.SaveChanges();
        return ret;
    }
}
