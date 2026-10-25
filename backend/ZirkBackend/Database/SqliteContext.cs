using Microsoft.EntityFrameworkCore;
using ZirkBackend.Helpers;

namespace ZirkBackend.Database;

public class SqliteContext : DbContext
{
    internal DbSet<ProjectContext> Projects { set; get; }
    internal DbSet<ApiUpdateContext> Updates { set; get; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite(
            PathHelper.IsDebug
            ? $"Data Source=Sqlite.db"
            : $"Data Source=/data/Sqlite.db"
        );
    }
}
