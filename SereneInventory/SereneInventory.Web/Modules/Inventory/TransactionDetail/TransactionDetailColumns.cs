﻿
namespace SereneInventory.Inventory.Columns
{
    using Serenity;
    using Serenity.ComponentModel;
    using Serenity.Data;
    using System;
    using System.ComponentModel;
    using System.Collections.Generic;
    using System.IO;

    [ColumnsScript("Inventory.TransactionDetail")]
    [BasedOnRow(typeof(Entities.TransactionDetailRow), CheckNames = true)]
    public class TransactionDetailColumns
    {
        [EditLink, DisplayName("Db.Shared.RecordId"), Hidden]
        public Int64 Id { get; set; }
        //public String RefTransactionTransactionNumber { get; set; }
        [Width(200, Min = 150)]
        public Int64 ProductId { get; set; }
        public Decimal Quantity { get; set; }
        public Decimal UnitPrice { get; set; }
        public Decimal Amount { get; set; }
        //public Decimal? RemainingQuantity { get; set; }
    }
}