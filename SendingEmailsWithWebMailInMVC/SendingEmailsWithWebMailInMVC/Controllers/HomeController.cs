using SendingEmailsWithWebMailInMVC.Common;
using SendingEmailsWithWebMailInMVC.Context;
using SendingEmailsWithWebMailInMVC.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace SendingEmailsWithWebMailInMVC.Controllers
{
    public class HomeController : Controller
    {
        private DefaultConnection db = new DefaultConnection();
        private SessionContext _sessionContext;
       public HomeController()
        {
            _sessionContext = new SessionContext();
        }

        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult SendEmailView()
        {
            return View();
        }

        [HttpPost]
       public ActionResult SendEmailView(Email smtp)
        {
            try
            {
                int eid = Convert.ToInt32(Session["Email"]);
                
                var email = db.CnfiEmail.FirstOrDefault(x => x.id == eid);
                var sid = db.SMTP.FirstOrDefault(x => x.Sid == email.Sid);
                //parameters to send email
                string ToEmail, FromOrSenderEmail = email.Email , SubJect, Body, cc, Bcc;

                //Assigning values to parameters to send emails
                ToEmail = smtp.ToEmail;
                SubJect = smtp.EmailSubject;
                Body = smtp.EMailBody;
                cc = smtp.EmailCC;
                Bcc = smtp.EmailBCC;
                //Configuring webMail class to send emails
                WebMail.SmtpServer = sid.ServerName; // "svr146.fastwebhost.com"; //gmail smtp server
                WebMail.SmtpPort = sid.Port; //25; //gmail port to send emails
                WebMail.EnableSsl = sid.SSL; // false; //sending emails with secure protocol
                WebMail.UserName = FromOrSenderEmail;//EmailId used to send emails from application
                WebMail.Password = email.password;// "vidya@9835";
                WebMail.From = FromOrSenderEmail; //email sender email address.


                //Sending email
                WebMail.Send(to: ToEmail, subject: SubJect, body: Body, cc: cc, bcc: Bcc, isBodyHtml: true);
      }
      catch (Exception e)
      {
                throw e;
      }

            return View();
        } 
    } 
}