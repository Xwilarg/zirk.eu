using System.ComponentModel.DataAnnotations;

namespace ZirkBackend.Database;

public class ApiUpdateContext
{
    [Key] public required string Key { set; get; }
    public required DateTime LastCheck { set; get; }
    public bool IsChecking { set; get; }
}
