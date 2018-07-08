using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SendingEmailsWithWebMailInMVC.Models
{
    public class CnfiEmail
    {
        public long id { get; set; }
        public string Email { get; set; }
        public string password { get; set; }
        public long Sid { get; set; }
        public long Pid { get; set; }
        public long Uid { get; set; }
        public virtual SMTP SMTPModel { get; set; }
        public virtual PoPP PoPPModel { get; set; }
        public virtual User User { get; set; }
    }
}