﻿
namespace SereneInventory.Administration.Pages
{
    using Serenity;
    using Serenity.Web;
    using System.Web.Mvc;

    [RoutePrefix("Administration/Tenant"), Route("{action=index}")]
    [PageAuthorize(typeof(Entities.TenantRow))]
    public class TenantController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Modules/Administration/Tenant/TenantIndex.cshtml");
        }
    }
}