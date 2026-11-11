using System.Net.Http.Headers;
using System.Text.Json;
using ZirkBackend.Database;
using ZirkBackend.Helpers;
using ZirkBackend.Models;
using ZirkBackend.Models.External;
using ZirkBackend.Models.Responses;

namespace ZirkBackend.Services;

public class ApiUpdater(SqliteContext ctx, IServiceScopeFactory scopeFactory)
{
    private static Lazy<HttpClient> _githubHttpClient = new(() =>
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.UserAgent.ParseAdd("zirk.eu backend");
        var token = PathHelper.GetCredentials(new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }).GithubToken;
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    });

    public async Task<Dictionary<string, ProjectGithubResponse>> GetGithubCommitsInfoAsync(ProjectItem[] projects)
    {
        var checkState = ctx.Updates.FirstOrDefault(x => x.Key == "project");
        var needUpdate = false;
        if (checkState == null)
        {
            needUpdate = true;
            ctx.Updates.Add(new()
            {
                IsChecking = true,
                Key = "project",
                LastCheck = DateTime.UtcNow
            });
            ctx.SaveChanges();
            checkState = ctx.Updates.First(x => x.Key == "project");
        }
        else if (!checkState.IsChecking && checkState.LastCheck <= DateTime.UtcNow.Subtract(TimeSpan.FromHours(1)))
        {
            needUpdate = true;
            checkState.IsChecking = true;
            ctx.SaveChanges();
        }

        var res = projects.ToDictionary(x => x.Name, x =>
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

        if (needUpdate)
        {
            _ = Task.Run(async () =>
            {
                using var scope = scopeFactory.CreateScope();
                var ctxScope = scope.ServiceProvider.GetRequiredService<SqliteContext>();
                checkState = ctxScope.Updates.First(x => x.Key == "project");
                try
                {
                    Dictionary<string, ProjectGithubResponse> ret = new();
                    foreach (var p in projects)
                    {
                        var project = ctxScope.Projects.FirstOrDefault(x => x.Name == p.Name);
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
                            ctxScope.Projects.Add(pCtx);
                        }
                        else
                        {
                            project.LastCommitMessage = json[0].Commit.Message;
                            project.LastModification = json[0].Commit.Committer.Date;
                        }
                    }
                    Console.WriteLine($"{DateTime.Now} Project update completed");
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
                finally
                {
                    checkState.LastCheck = DateTime.UtcNow;
                    checkState.IsChecking = false;
                    ctxScope.SaveChanges();
                }
            });
        }
        return res;
    }
}
