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
    public class InfoController(FileService fileService) : ControllerBase
    {
        [HttpGet("quote/{nsfw}")]
        public ActionResult GetRandomQuote(NsfwStatus nsfw)
        {
            return new JsonResult(fileService.GetRandomQuote(nsfw));
        }

        [HttpGet("gamejams/{nsfw}")]
        public ActionResult GetGamejams(NsfwStatus nsfw)
        {
            return StatusCode(StatusCodes.Status200OK, fileService.GetGamejams(nsfw));
        }

        [HttpGet("lifeline")]
        public ActionResult GetFriends()
        {
            return StatusCode(StatusCodes.Status200OK, fileService.GetFriends());
        }

        [HttpGet("lifeline/static/hash")]
        public ActionResult ValidateLifeline(string hash)
        {
            return StatusCode(StatusCodes.Status200OK, fileService.GetFriends());
        }

        [HttpGet("news/{nsfw}")]
        public ActionResult GetNews(NsfwStatus nsfw)
        {
            return StatusCode(StatusCodes.Status200OK, fileService.GetNews(nsfw));
        }

        [HttpGet("sheep")]
        public ActionResult GetSheep()
        {
            return StatusCode(StatusCodes.Status200OK, fileService.GetSheep());
        }

        [HttpGet("projects/{nsfw}")]
        public ActionResult GetProjects(NsfwStatus nsfw)
        {
            return StatusCode(StatusCodes.Status200OK, fileService.GetProjects(nsfw));
        }

        [HttpGet("games")]
        public ActionResult GetGames()
        {
            return StatusCode(StatusCodes.Status200OK, fileService.GetGames());
        }

        [HttpPost("achievements/count")]
        public ActionResult GetAchievementsCount([FromBody] IdsRequest body)
        {
            var achs = fileService.GetAchievements();
            return StatusCode(StatusCodes.Status200OK, new AchievementCountResponse()
            {
                Total = achs.Length,
                Unlocked = achs.Count(x => body.Ids.Contains(x.Id))
            });
        }

        [HttpPost("achievements/get")]
        public ActionResult GetAchievementsInfo([FromBody] IdsRequest body)
        {
            var achs = fileService.GetAchievements();
            return StatusCode(StatusCodes.Status200OK, achs.Select(x => body.Ids.Contains(x.Id) ? x : null));
        }

        [HttpGet("ocs")]
        public ActionResult GetOCs()
        {
            return StatusCode(StatusCodes.Status200OK, fileService.GetOCs());
        }

        [HttpGet("goals")]
        public ActionResult GetGoals()
        {
            return StatusCode(StatusCodes.Status200OK, fileService.GetGoals());
        }
    }
}
