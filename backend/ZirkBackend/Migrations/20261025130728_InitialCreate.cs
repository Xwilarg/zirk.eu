using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZirkBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    LastModification = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastCommitMessage = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "Updates",
                columns: table => new
                {
                    Key = table.Column<string>(type: "TEXT", nullable: false),
                    LastCheck = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsChecking = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Updates", x => x.Key);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Updates");
        }
    }
}
