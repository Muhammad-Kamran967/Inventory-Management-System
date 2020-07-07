using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000150)]
    public class TransactionExpense : Migration
    {
        public override void Up()
        {
           Create.Table("TransactionExpense")
.WithColumn("Id").AsInt64().NotNullable().PrimaryKey().Identity()
.WithColumn("TransactionId").AsInt64().NotNullable().ForeignKey("Transaction", "Id")
.WithColumn("ExpenseType").AsInt32().Nullable()
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
            Delete.Table("TransactionExpense");
        }
    }

}