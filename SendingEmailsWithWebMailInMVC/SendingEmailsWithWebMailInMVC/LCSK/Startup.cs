using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(SendingEmailsWithWebMailInMVC.LCSK.Startup))]

namespace SendingEmailsWithWebMailInMVC.LCSK
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
           // app.MapSignalR();
        }
    }
}
