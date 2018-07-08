using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using SendingEmailsWithWebMailInMVC.Models;


namespace SendingEmailsWithWebMailInMVC.Context
{
    public class DefaultConnection : DbContext
    {
        public DefaultConnection()
        {

        }

        public DbSet<User> User { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<SMTP> SMTP { get; set; }
        public DbSet<PoPP> PoPP { get; set; }
        public DbSet<CnfiEmail> CnfiEmail { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}