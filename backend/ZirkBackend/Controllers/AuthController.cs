using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using ZirkBackend.Database;
using ZirkBackend.Helpers;
using ZirkBackend.Models.Responses;
using ZirkBackend.Services;

namespace ZirkBackend.Controllers;

[ApiController]
[Route("/api/auth")]
public class AuthController(JsonSerializerOptions opts, SqliteContext ctx, FileService fileService) : ControllerBase
{
    [HttpGet("discord/token")]
    public async Task<ActionResult> GetDiscordAuth()
    {
        var res = await HttpContext.AuthenticateAsync("Cookies");
        if (!res.Succeeded) return StatusCode(StatusCodes.Status401Unauthorized, "Missing auth data");

        var discordId = res.Principal!.FindFirstValue(ClaimTypes.NameIdentifier)!;
        if (discordId == null) return StatusCode(StatusCodes.Status404NotFound, "Missing Discord id");

        var dbId = ctx.Users.FirstOrDefault(x => x.DiscordId == discordId);
        if (dbId == null)
        {
            var friend = fileService.GetFriends().FirstOrDefault(x => x.Discord != null && x.Discord == discordId);
            var u = new UserContext()
            {
                AccountCreation = DateTime.UtcNow,
                DiscordId = discordId,
                DisplayName = res.Principal.FindFirstValue(ClaimTypes.Name),
                Emoji = friend?.Name,
                UseDisplayName = false
            };
            ctx.Users.Add(u);
            ctx.SaveChanges();
            dbId = u;
        }

        await HttpContext.SignOutAsync("Cookies");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(PathHelper.GetCredentials(opts).SecurityKey));
        var jwt = new JwtSecurityTokenHandler().WriteToken(new JwtSecurityToken(
            claims: [
                new Claim(ClaimTypes.NameIdentifier, dbId.Id.ToString())
            ],
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)));

        return StatusCode(StatusCodes.Status200OK, new LoginResponse()
        {
            DisplayName = dbId.DisplayName,
            Token = jwt,
            Achievements = dbId.Achievements,
            NsfwLevel = dbId.NsfwLevel
        });
    }
}
