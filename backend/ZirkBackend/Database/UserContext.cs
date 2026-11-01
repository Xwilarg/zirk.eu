using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZirkBackend.Database;

public class UserContext
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)] public int Id { set; get; }
    public required DateTime AccountCreation { set; get; }
    public string? DisplayName { set; get; }
    public string? Emoji { set; get; }
    public bool UseDisplayName { set; get; }

    public string? DiscordId { set; get; }
}
