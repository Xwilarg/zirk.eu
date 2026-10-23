using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ZirkBackend.Models;
using ZirkBackend.Models.Requests;
using ZirkBackend.Models.Responses;
using ZirkBackend.Services;

namespace ZirkBackend.Controllers
{
    [ApiController]
    [Route("/api/info")]
    public class InfoController(FileService fileService, JsonSerializerOptions options) : ControllerBase
    {
        [HttpGet("quote/{nsfw}")]
        public ActionResult GetRandomQuote(NsfwStatus nsfw)
        {
            return StatusCode(StatusCodes.Status200OK, JsonSerializer.Serialize(fileService.GetRandomQuote(nsfw), options));
        }

        [HttpGet("gamejams/{nsfw}")]
        public ActionResult GetGamejams(NsfwStatus nsfw)
        {
            return StatusCode(StatusCodes.Status200OK, JsonSerializer.Serialize(fileService.GetGamejams(nsfw), options));
        }

        [HttpGet("lifeline")]
        public ActionResult GetFriends()
        {
            return StatusCode(StatusCodes.Status200OK, JsonSerializer.Serialize(fileService.GetFriends(), options));
        }

        [HttpGet("lifeline/static/hash")]
        public ActionResult ValidateLifeline(string hash)
        {
            return StatusCode(StatusCodes.Status200OK, JsonSerializer.Serialize(fileService.GetFriends(), options));
        }

        [HttpGet("news/{nsfw}")]
        public ActionResult GetNews(NsfwStatus nsfw)
        {
            return StatusCode(StatusCodes.Status200OK, JsonSerializer.Serialize(fileService.GetNews(nsfw), options));
        }

        [HttpGet("sheep")]
        public ActionResult GetSheep()
        {
            return StatusCode(StatusCodes.Status200OK, JsonSerializer.Serialize(fileService.GetSheep(), options));
        }

        [HttpGet("projects/{nsfw}")]
        public ActionResult GetProjects(NsfwStatus nsfw)
        {
            return StatusCode(StatusCodes.Status200OK, JsonSerializer.Serialize(fileService.GetProjects(nsfw), options));
        }

        [HttpGet("games")]
        public ActionResult GetGames()
        {
            return StatusCode(StatusCodes.Status200OK, JsonSerializer.Serialize(fileService.GetGames(), options));
        }

        [HttpPost("achievements/count")]
        public ActionResult GetAchievementsCount([FromBody] IdsRequest body)
        {
            var achs = fileService.GetAchievements();
            return StatusCode(StatusCodes.Status200OK, JsonSerializer.Serialize(new AchievementCountResponse()
            {
                Total = achs.Length,
                Unlocked = achs.Count(x => body.Ids.Contains(x.Id))
            }, options));
        }

        [HttpPost("achievements/get")]
        public ActionResult GetAchievementsInfo([FromBody] IdsRequest body)
        {
            var achs = fileService.GetAchievements();
            return StatusCode(StatusCodes.Status200OK,
                JsonSerializer.Serialize(achs.Select(x => body.Ids.Contains(x.Id) ? x : null), options)
            );
        }

        [HttpGet("ocs")]
        public ActionResult GetOCs()
        {
            return StatusCode(StatusCodes.Status200OK, JsonSerializer.Serialize(fileService.GetOCs(), options));
        }

        [HttpGet("goals")]
        public ActionResult GetGoals()
        {
            return StatusCode(StatusCodes.Status200OK, JsonSerializer.Serialize(fileService.GetGoals(), options));
        }
    }
}
