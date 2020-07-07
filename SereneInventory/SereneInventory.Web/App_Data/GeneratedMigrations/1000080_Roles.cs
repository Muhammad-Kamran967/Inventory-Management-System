using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000080)]
    public class Roles : Migration
    {
        public override void Up()
        {
           Create.Table("Roles")
.WithColumn("RoleId").AsInt32().NotNullable().PrimaryKey().Identity().ForeignKey("Roles", "RoleId")
.WithColumn("RoleName").AsString(100).NotNullable();


        }

        public override void Down()
        {
            Delete.Table("Roles");
        }
    }

}