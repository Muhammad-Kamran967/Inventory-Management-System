using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000060)]
    public class Users : Migration
    {
        public override void Up()
        {
           Create.Table("Users")
.WithColumn("UserId").AsInt32().NotNullable().PrimaryKey().Identity()
.WithColumn("Username").AsString(100).NotNullable()
.WithColumn("Source").AsString(4).NotNullable()
.WithColumn("PasswordHash").AsString(86).NotNullable()
.WithColumn("PasswordSalt").AsString(10).NotNullable()
.WithColumn("DisplayName").AsString(100).NotNullable()
.WithColumn("Email").AsString(100).Nullable()
.WithColumn("UserImage").AsString(100).Nullable()
.WithColumn("LastDirectoryUpdate").AsDateTime().Nullable()
.WithColumn("IsActive").AsInt16().NotNullable()
.WithColumn("InsertUserId").AsInt32().NotNullable()
.WithColumn("InsertDate").AsDateTime().NotNullable()
.WithColumn("UpdateUserId").AsInt32().Nullable()
.WithColumn("UpdateDate").AsDateTime().Nullable();


        }

        public override void Down()
        {
            Delete.Table("Users");
        }
    }

}