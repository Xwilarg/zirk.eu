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
    }
}
