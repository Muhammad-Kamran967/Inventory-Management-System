using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000100)]
    public class UserRoles : Migration
    {
        public override void Up()
        {
           Create.Table("UserRoles")
.WithColumn("UserRoleId").AsInt64().NotNullable().PrimaryKey().Identity()
.WithColumn("UserId").AsInt32().NotNullable().ForeignKey("Users", "UserId")
.WithColumn("RoleId").AsInt32().NotNullable();


        }

        public override void Down()
        {
            Delete.Table("UserRoles");
        }
    }

}