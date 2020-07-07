﻿using Serenity.Navigation;
using MyPages = SereneInventory.Setup.Pages;

[assembly: NavigationMenu(9000, "Setup", icon: "fa-cogs")]
[assembly: NavigationLink(int.MaxValue, "Setup/Party", typeof(MyPages.PartyController), icon: null)]
[assembly: NavigationLink(int.MaxValue, "Setup/Product", typeof(MyPages.ProductController), icon: null)]
[assembly: NavigationLink(int.MaxValue, "Setup/Product Category", typeof(MyPages.ProductCategoryController), icon: null)]