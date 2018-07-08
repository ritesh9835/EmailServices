using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SendingEmailsWithWebMailInMVC.Models;

namespace SendingEmailsWithWebMailInMVC.Common
{
    public class SiteSession
    {
        public string UserName { get; set; }
        public string Email { get; set; }

        public long RoleId { get; set; }

        public SiteSession(User user)
        {
            Email = user.Email;
            UserName = user.UserName;
            

        }
        public static void LogOff(HttpSessionStateBase httpSession)
        {
            //
            // Write in the event log the message about the user's Log Off.
            // Note that could be situations that this code was invoked from "Error" page 
            // after the current user session has expired, or before the user to login!
            //
            SiteSession siteSession = (httpSession["SiteSession"] == null ? null : (SiteSession)httpSession["SiteSession"]);

            //
            // Log Off the curent user and clear its site session cache.
            //            
            httpSession["SiteSession"] = null;
        }
    }
}