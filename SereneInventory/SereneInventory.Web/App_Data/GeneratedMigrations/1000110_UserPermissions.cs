using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000110)]
    public class UserPermissions : Migration
    {
        public override void Up()
        {
           Create.Table("UserPermissions")
.WithColumn("UserPermissionId").AsInt64().NotNullable().PrimaryKey().Identity()
.WithColumn("UserId").AsInt32().NotNullable().ForeignKey("Users", "UserId")
.WithColumn("PermissionKey").AsString(100).NotNullable()
.WithColumn("Granted").AsBoolean().Nullable();


        }

        public override void Down()
        {
            Delete.Table("UserPermissions");
        }
    }

}