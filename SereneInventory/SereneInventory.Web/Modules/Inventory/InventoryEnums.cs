﻿using System.ComponentModel;

namespace SereneInventory
{
    public enum TransactionType
    {
        [Description("Purchase Invoice")]
        PurchaseInvoice = 10,
        [Description("Sales Invoice")]
        SalesInvoice = 20,
    }
    public enum ExpenseType
    {
        Transportation = 10,
        Media = 20,
        Delivery = 30,
        [Description("Misc.")]
        Misc = 40,
    }
}