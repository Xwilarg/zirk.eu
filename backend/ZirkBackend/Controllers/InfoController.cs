using Microsoft.AspNetCore.Mvc;
using ZirkBackend.Models;
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
            return StatusCode(StatusCodes.Status200OK, fileService.RandomQuote(nsfw));
        }

        [HttpPost]
        public ActionResult Get([FromBody] string[] queries)
        {
            return StatusCode(StatusCodes.Status200OK);
        }
    }
}
