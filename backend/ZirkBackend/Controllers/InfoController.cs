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
            var lifelines = fileService.GetFriends();
            foreach (var l in lifelines)
            {
                l.Lifeline.Hash = null;
            }
            return StatusCode(StatusCodes.Status200OK, lifelines);
        }

        // https://stackoverflow.com/a/52171480
        private static long Cyrb53(string str)
        {
            unchecked
            {
                uint h1 = 0xdeadbeefu;
                uint h2 = 0x41c6ce57u;

                foreach (char ch in str)
                {
                    h1 = (h1 ^ ch) * 2654435761u;
                    h2 = (h2 ^ ch) * 1597334677u;
                }

                h1 = (h1 ^ (h1 >> 16)) * 2246822507u;
                h1 ^= (h2 ^ (h2 >> 13)) * 3266489909u;
                h2 = (h2 ^ (h2 >> 16)) * 2246822507u;
                h2 ^= (h1 ^ (h1 >> 13)) * 3266489909u;

                return 4294967296L * (2097151u & h2) + (h1 >>> 0);
            }
        }
        [HttpGet("lifeline/static/{id}/{hash}")]
        public ActionResult ValidateLifeline(string id, string hash)
        {
            var lifeline = fileService.GetFriends().FirstOrDefault(x => x.Lifeline.Id == id);
            if (lifeline == null) return StatusCode(StatusCodes.Status400BadRequest, "Invalid ID");

            var finalStr = lifeline.Lifeline.Id!.CompareTo(hash) < 0 ? $"{lifeline.Lifeline.Id}{hash}" : $"{hash}{lifeline.Lifeline.Id}";
            if (Cyrb53(finalStr).ToString() == lifeline.Lifeline.Hash)
            {
                return StatusCode(StatusCodes.Status204NoContent);
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Invalid hash");
            }
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
