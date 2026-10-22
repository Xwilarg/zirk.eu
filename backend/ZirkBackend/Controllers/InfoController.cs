using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ZirkBackend.Models;
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

        [HttpGet("friends")]
        public ActionResult GetFriends()
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
    }
}
