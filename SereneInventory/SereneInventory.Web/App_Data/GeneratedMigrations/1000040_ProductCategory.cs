using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000040)]
    public class ProductCategory : Migration
    {
        public override void Up()
        {
           Create.Table("ProductCategory")
.WithColumn("Id").AsInt64().NotNullable().PrimaryKey().Identity()
.WithColumn("Name").AsString(100).NotNullable()
.WithColumn("Description").AsString(500).Nullable()
.WithColumn("Remarks").AsString(500).Nullable()
.WithColumn("IUserId").AsInt64().Nullable()
.WithColumn("TenantId").AsInt64().Nullable()
.WithColumn("EUserId").AsInt64().Nullable()
.WithColumn("IDate").AsDateTime().Nullable()
.WithColumn("EDate").AsDateTime().Nullable();


        }

        public override void Down()
        {
            Delete.Table("ProductCategory");
        }
    }

}