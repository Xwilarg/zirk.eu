using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZirkBackend.Database;

public class UserContext
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)] public int Id { set; get; }
    public required DateTime AccountCreation { set; get; }
    public string? DisplayName { set; get; }
    public string? Emoji { set; get; }

    public string? DiscordId { set; get; }

    /// <summary>
    /// In various tabs, should we use the display name or emoji?
    /// </summary>
    public bool UseDisplayName { set; get; } = false;
    /// <summary>
    /// Achievements unlocked
    /// </summary>
    public List<string> Achievements { set; get; } = [];
    /// <summary>
    /// Default NSFW level the website is at
    /// </summary>
    public int? NsfwLevel { set; get; } = null;
}
