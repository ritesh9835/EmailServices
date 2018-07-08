using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SendingEmailsWithWebMailInMVC.Models
{
    public class Role
    {
        public long Id { get; set; }
        public long Uid { get; set; }
        public string RoleName { get; set; }
        public virtual User UserModel { get; set; }
    }
}