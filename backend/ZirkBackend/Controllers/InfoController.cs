using Microsoft.AspNetCore.Mvc;

namespace ZirkBackend.Controllers
{
    [ApiController]
    [Route("/api/info")]
    public class InfoController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get()
        {
            return StatusCode(StatusCodes.Status200OK);
        }
    }
}
