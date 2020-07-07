using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000090)]
    public class RolePermissions : Migration
    {
        public override void Up()
        {
           Create.Table("RolePermissions")
.WithColumn("RolePermissionId").AsInt64().NotNullable().PrimaryKey().Identity()
.WithColumn("RoleId").AsInt32().NotNullable().ForeignKey("Roles", "RoleId")
.WithColumn("PermissionKey").AsString(100).NotNullable();


        }

        public override void Down()
        {
            Delete.Table("RolePermissions");
        }
    }

}