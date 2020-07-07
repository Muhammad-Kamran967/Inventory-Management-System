using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000070)]
    public class Languages : Migration
    {
        public override void Up()
        {
           Create.Table("Languages")
.WithColumn("Id").AsInt32().NotNullable().PrimaryKey().Identity()
.WithColumn("LanguageId").AsString(10).NotNullable()
.WithColumn("LanguageName").AsString(50).NotNullable();


        }

        public override void Down()
        {
            Delete.Table("Languages");
        }
    }

}