using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Watchtogether_Backend.Migrations
{
    /// <inheritdoc />
    public partial class addvideofield : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CurrentVideo",
                table: "Room",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentVideo",
                table: "Room");
        }
    }
}
