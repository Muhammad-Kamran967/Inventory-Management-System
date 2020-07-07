using FluentMigrator;

namespace DBMigration.Migrations
{

    [Migration(1000030)]
    public class Product : Migration
    {
        public override void Up()
        {
           Create.Table("Product")
.WithColumn("Id").AsInt64().NotNullable().PrimaryKey().Identity()
.WithColumn("Name").AsString(100).NotNullable()
.WithColumn("Code").AsString(50).NotNullable()
.WithColumn("ProductType").AsInt32().Nullable()
.WithColumn("ProductCategoryId").AsInt64().Nullable().ForeignKey("ProductCategory", "Id")
.WithColumn("Description").AsString(500).Nullable()
.WithColumn("Images").AsString(500).Nullable()
.WithColumn("Remarks").AsString(500).Nullable()
.WithColumn("IUserId").AsInt64().Nullable()
.WithColumn("TenantId").AsInt64().Nullable()
.WithColumn("EUserId").AsInt64().Nullable()
.WithColumn("IDate").AsDateTime().Nullable()
.WithColumn("EDate").AsDateTime().Nullable();


        }

        public override void Down()
        {
            Delete.Table("Product");
        }
    }

}