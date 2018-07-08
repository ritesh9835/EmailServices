using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SendingEmailsWithWebMailInMVC.Models
{
    public class User
    {
        [Key]
        public long Uid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string CompanyName { get; set; }

        public bool? IsSuperAdmin { get; set; }

        [DataType(DataType.MultilineText)]
        public string Address { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public Nullable<DateTime> UpdateOn { get; set; }

            public virtual ICollection<Role> RoleModel { get; set; }
        public virtual ICollection<CnfiEmail> CnfiEmail { get; set; }


    }
}