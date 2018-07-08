using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SendingEmailsWithWebMailInMVC.ViewModels
{
    public class SMTPemail
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string ServerName { get; set; }
        public int Port { get; set; }
        public bool SSL { get; set; }


        public string PServerName { get; set; }

        public int PPort { get; set; }
        public bool PSSL { get; set; }
    }
}