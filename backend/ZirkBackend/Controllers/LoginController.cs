using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace ZirkBackend.Controllers;

[ApiController]
[Route("/api/login")]
public class LoginController() : ControllerBase
{
    [HttpGet("discord")]
    public ActionResult GetDiscordLogin()
    {
        return Challenge(new AuthenticationProperties
        {
            RedirectUri = "/login/discord"
        }, "Discord");
    }
}
