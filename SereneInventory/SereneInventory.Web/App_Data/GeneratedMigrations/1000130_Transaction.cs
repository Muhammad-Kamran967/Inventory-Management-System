using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000130)]
    public class Transaction : Migration
    {
        public override void Up()
        {
           Create.Table("Transaction")
.WithColumn("Id").AsInt64().NotNullable().PrimaryKey().Identity()
.WithColumn("TransactionType").AsInt32().NotNullable()
.WithColumn("TransactionNumber").AsString(50).NotNullable()
.WithColumn("TransactionDate").AsDateTime().NotNullable()
.WithColumn("PartyId").AsInt64().Nullable().ForeignKey("Party", "Id")
.WithColumn("Remarks").AsString(500).Nullable()
.WithColumn("IUserId").AsInt64().Nullable()
.WithColumn("TenantId").AsInt64().Nullable()
.WithColumn("EUserId").AsInt64().Nullable()
.WithColumn("IDate").AsDateTime().Nullable()
.WithColumn("EDate").AsDateTime().Nullable();


        }

        public override void Down()
        {
            Delete.Table("Transaction");
        }
    }

}