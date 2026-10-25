using System.ComponentModel.DataAnnotations;

namespace ZirkBackend.Database;

public class ProjectContext
{
    [Key] public required string Name { set; get; }
    public DateTime LastModification { set; get; }
    public string LastCommitMessage { set; get; }
}
