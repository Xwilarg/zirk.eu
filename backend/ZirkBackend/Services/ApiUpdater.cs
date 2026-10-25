using System.Net.Http.Headers;
using System.Text.Json;
using ZirkBackend.Database;
using ZirkBackend.Helpers;
using ZirkBackend.Models;
using ZirkBackend.Models.External;
using ZirkBackend.Models.Responses;

namespace ZirkBackend.Services;

public class ApiUpdater(SqliteContext ctx)
{
    private static Lazy<HttpClient> _githubHttpClient = new(() =>
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.UserAgent.ParseAdd("zirk.eu backend");
        var token = JsonSerializer.Deserialize<Credentials>(File.ReadAllText($"{PathHelper.DataPath}credentials.json"), new JsonSerializerOptions()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        })!.GithubToken;
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    });

    public async Task<Dictionary<string, ProjectGithubResponse>> GetGithubCommitsInfoAsync(ProjectItem[] projects)
    {
        var checkState = ctx.Updates.FirstOrDefault(x => x.Key == "project");
        if (checkState == null)
        {
            ctx.Updates.Add(new()
            {
                IsChecking = true,
                Key = "project",
                LastCheck = DateTime.UtcNow
            });
            ctx.SaveChanges();
            checkState = ctx.Updates.First(x => x.Key == "project");
        }
        else if (checkState.IsChecking || checkState.LastCheck > DateTime.UtcNow.Subtract(TimeSpan.FromHours(1)))
        {
            return projects.ToDictionary(x => x.Name, x =>
            {
                var projectInfo = ctx.Projects.FirstOrDefault(p => p.Name == x.Name);
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
            ctx.SaveChanges();
        }

        Dictionary<string, ProjectGithubResponse> ret = new();
        foreach (var p in projects)
        {
            var project = ctx.Projects.FirstOrDefault(x => x.Name == p.Name);
            GithubInfo[] json;

            try
            {
                json = await _githubHttpClient.Value.GetFromJsonAsync<GithubInfo[]>($"https://api.github.com/repos/{p.Github}/commits?per_page=1");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to contact {p.Github}: {ex.Message}");
                continue;
            }

            if (project == null)
            {
                var pCtx = new ProjectContext()
                {
                    Name = p.Name,
                    LastCommitMessage = json[0].Commit.Message,
                    LastModification = json[0].Commit.Committer.Date
                };
                ctx.Projects.Add(pCtx);
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
        ctx.SaveChanges();
        return ret;
    }
}
