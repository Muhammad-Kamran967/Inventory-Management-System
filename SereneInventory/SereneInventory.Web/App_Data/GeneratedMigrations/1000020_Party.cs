using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000020)]
    public class Party : Migration
    {
        public override void Up()
        {
           Create.Table("Party")
.WithColumn("Id").AsInt64().NotNullable().PrimaryKey().Identity()
.WithColumn("PartyType").AsInt32().Nullable()
.WithColumn("Name").AsString(100).NotNullable()
.WithColumn("Address").AsString(500).Nullable()
.WithColumn("Contact").AsString(500).Nullable()
.WithColumn("Remarks").AsString(500).Nullable()
.WithColumn("IUserId").AsInt64().Nullable()
.WithColumn("TenantId").AsInt64().Nullable()
.WithColumn("EUserId").AsInt64().Nullable()
.WithColumn("IDate").AsDateTime().Nullable()
.WithColumn("EDate").AsDateTime().Nullable();


        }

        public override void Down()
        {
            Delete.Table("Party");
        }
    }

}