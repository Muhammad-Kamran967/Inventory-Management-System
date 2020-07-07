﻿using FluentMigrator;

namespace SereneInventory.Migrations.DefaultDB
{
    [Migration(20180601130000)]
    public class DefaultDB_20180601_130000_Inventory : AutoReversingMigration
    {
        public override void Up()
        {
            this.CreateTableWithId64("ProductCategory", "Id", s => s
                .WithColumn("Name").AsString(100).NotNullable()
                .WithColumn("Description").AsString(500).Nullable()
                .CommonFields());

            this.CreateTableWithId64("Product", "Id", s => s
                .WithColumn("Name").AsString(100).NotNullable()
                .WithColumn("Code").AsString(50).NotNullable()
                .WithColumn("ProductType").AsInt32().Nullable()
                .WithColumn("ProductCategoryId").AsInt64().Nullable().ForeignKey("ProductCategory", "Id")
                .WithColumn("Description").AsString(500).Nullable()
                .WithColumn("Images").AsString(500).Nullable()
                .CommonFields());

            this.CreateTableWithId64("Party", "Id", s => s
                .WithColumn("PartyType").AsInt32().Nullable()
                .WithColumn("Name").AsString(100).NotNullable()
                .WithColumn("Address").AsString(500).Nullable()
                .WithColumn("Contact").AsString(500).Nullable()
                .CommonFields());

            this.CreateTableWithId64("Transaction", "Id", s => s
                .WithColumn("TransactionType").AsInt32().NotNullable()
                .WithColumn("RefTransactionId").AsInt64().Nullable().ForeignKey("Transaction", "Id")
                .WithColumn("TransactionNumber").AsString(50).NotNullable()
                .WithColumn("TransactionDate").AsDateTime().NotNullable()
                .WithColumn("PartyId").AsInt64().Nullable().ForeignKey("Party", "Id")
                .CommonFields());

            this.CreateTableWithId64("TransactionDetail", "Id", s => s
                .WithColumn("TransactionId").AsInt64().NotNullable().ForeignKey("Transaction", "Id")
                .WithColumn("ProductId").AsInt64().Nullable().ForeignKey("Product", "Id")
                .WithColumn("Quantity").AsDecimal().NotNullable()
                .WithColumn("UnitPrice").AsDecimal().NotNullable()
                .WithColumn("Amount").AsDecimal().NotNullable()
                .CommonFields());

        }
    }
}