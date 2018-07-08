using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SendingEmailsWithWebMailInMVC.Models
{
    public class SMTP
    {
        
        [Key]
        public long Sid { get; set; }
        public string ServerName { get; set; }
        public int Port { get; set; }
        public bool SSL { get; set; }
        public virtual ICollection<CnfiEmail> CnfiEmail { get; set;}

        
    }
}