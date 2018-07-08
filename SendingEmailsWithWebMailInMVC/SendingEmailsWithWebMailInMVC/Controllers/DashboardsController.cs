using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SendingEmailsWithWebMailInMVC.Common;

namespace SendingEmailsWithWebMailInMVC.Controllers
{
    public class DashboardsController : Controller
    {
        // GET: Dashboards
        public ActionResult Index()
        {
            if(SessionContext.CurrentUser != null)
            {
                return View();
            }
            return RedirectToAction("Login", "Account");
            
        }

        public ActionResult SignalRChat()
        {
            return View();
        }
    }
}