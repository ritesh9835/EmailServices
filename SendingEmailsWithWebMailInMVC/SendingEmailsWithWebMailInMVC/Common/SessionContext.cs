using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SendingEmailsWithWebMailInMVC.Models;

namespace SendingEmailsWithWebMailInMVC.Common
{
    public class SessionContext
    {
        public static User LoggedOnUser
        {
            get
            {
                if (HttpContext.Current.Session != null)
                {
                    var sessionContext = HttpContext.Current.Session["SiteSession"] as User;
                    if (sessionContext != null)
                    {
                        return sessionContext;
                    }
                }
                return null;
            }
        }
        public void SetUpSessionContext(HttpContextBase httpContext, User requestContext)
        {
            if (httpContext == null) throw new ArgumentNullException("httpContext");
            if (requestContext == null) throw new ArgumentNullException("requestContext");

            if (httpContext.Session != null)
            {
                httpContext.Session["SiteSession"] = requestContext;
            }
        }

        public static User CurrentUser { get; set; }
        public static void LogOff(HttpContextBase httpSession)
        {
            httpSession.Session["SiteSession"] = null;
        }
    }
}