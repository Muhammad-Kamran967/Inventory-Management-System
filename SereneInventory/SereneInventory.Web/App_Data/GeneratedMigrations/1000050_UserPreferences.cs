using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000050)]
    public class UserPreferences : Migration
    {
        public override void Up()
        {
           Create.Table("UserPreferences")
.WithColumn("UserPreferenceId").AsInt32().NotNullable().PrimaryKey().Identity()
.WithColumn("UserId").AsInt32().Nullable()
.WithColumn("PreferenceType").AsString(100).NotNullable()
.WithColumn("Name").AsString(100).NotNullable()
.WithColumn("Value").AsString(100).Nullable();


        }

        public override void Down()
        {
            Delete.Table("UserPreferences");
        }
    }

}