using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000010)]
    public class AuditLog : Migration
    {
        public override void Up()
        {
           Create.Table("AuditLog")
.WithColumn("Id").AsInt64().NotNullable().PrimaryKey()
.WithColumn("VersionNo").AsInt32().NotNullable()
.WithColumn("UserId").AsInt32().NotNullable()
.WithColumn("ActionType").AsInt32().NotNullable()
.WithColumn("ActionDate").AsDateTime().NotNullable()
.WithColumn("TableName").AsString(100).NotNullable()
.WithColumn("EntityId").AsInt64().NotNullable()
.WithColumn("OldEntity").AsString(100).Nullable()
.WithColumn("NewEntity").AsString(100).Nullable()
.WithColumn("IpAddress").AsString(100).Nullable()
.WithColumn("SessionId").AsString(100).Nullable();


        }

        public override void Down()
        {
            Delete.Table("AuditLog");
        }
    }

}