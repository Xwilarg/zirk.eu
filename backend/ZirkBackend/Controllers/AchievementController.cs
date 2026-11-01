using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ZirkBackend.Database;
using ZirkBackend.Services;

namespace ZirkBackend.Controllers;

[ApiController]
[Route("/api/achievement")]
public class AchievementController(FileService fileService, SqliteContext ctx) : ControllerBase
{
    [Authorize]
    [HttpPut("{id}")]
    public ActionResult UnlockAchievement(string id)
    {
        if (fileService.GetAchievements().Any(x => x.Id == id))
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null) return StatusCode(StatusCodes.Status403Forbidden, "Missing claim");
            var claim = identity.FindFirst(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            if (claim == null) return StatusCode(StatusCodes.Status403Forbidden, "Missing claim");
            var claimId = int.Parse(claim);
            var u = ctx.Users.FirstOrDefault(x => x.Id == claimId);
            if (u == null) return StatusCode(StatusCodes.Status403Forbidden, "Invalid user");

            if (!u.Achievements.Contains(id))
            {
                u.Achievements.Add(id);
                ctx.SaveChanges();
                return StatusCode(StatusCodes.Status204NoContent);
            }
            return StatusCode(StatusCodes.Status400BadRequest, "Achievement is already unlocked");
        }
        return StatusCode(StatusCodes.Status400BadRequest, "Achievement doesn't exist");
    }
}
