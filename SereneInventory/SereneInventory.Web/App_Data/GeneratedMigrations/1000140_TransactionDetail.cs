using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000140)]
    public class TransactionDetail : Migration
    {
        public override void Up()
        {
           Create.Table("TransactionDetail")
.WithColumn("Id").AsInt64().NotNullable().PrimaryKey().Identity()
.WithColumn("TransactionId").AsInt64().NotNullable().ForeignKey("Transaction", "Id")
.WithColumn("ProductId").AsInt64().NotNullable().ForeignKey("Product", "Id")
.WithColumn("Quantity").AsDecimal().NotNullable()
.WithColumn("UnitPrice").AsDecimal().NotNullable()
.WithColumn("Amount").AsDecimal().NotNullable()
.WithColumn("Remarks").AsString(500).Nullable()
.WithColumn("IUserId").AsInt64().Nullable()
.WithColumn("TenantId").AsInt64().Nullable()
.WithColumn("EUserId").AsInt64().Nullable()
.WithColumn("IDate").AsDateTime().Nullable()
.WithColumn("EDate").AsDateTime().Nullable();


        }

        public override void Down()
        {
            Delete.Table("TransactionDetail");
        }
    }

}