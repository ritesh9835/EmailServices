using SendingEmailsWithWebMailInMVC.Common;
using SendingEmailsWithWebMailInMVC.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SendingEmailsWithWebMailInMVC.Models;
using SendingEmailsWithWebMailInMVC.ViewModels;
using OpenPop.Mime;
using OpenPop.Pop3;

namespace SendingEmailsWithWebMailInMVC.Controllers
{
    
    public class SMTPController : Controller
    {
        private DefaultConnection db = new DefaultConnection();
        private SessionContext _sessionContext;
        public SMTPController()
        {
            _sessionContext = new SessionContext();
        }

        // GET: SMTP
        public ActionResult Index()
        {
            ViewBag.Categories = db.CnfiEmail.Where(s => s.Uid == SessionContext.CurrentUser.Uid);
           // var model = new Email();
            return View();
        }
        [HttpGet]
        public ActionResult Add()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Add(SMTPemail smtpe)
        {
            if (SessionContext.CurrentUser != null)
            {
                //Save SMTP
                SMTP smtp = new SMTP();
                smtp.ServerName = smtpe.ServerName;
                smtp.Port = smtpe.Port;
                smtp.SSL = smtpe.SSL;
                var Smtp = db.SMTP.Add(smtp);
                db.SaveChanges();

                //Save POP
                PoPP pop = new PoPP();
                pop.ServerName = smtpe.PServerName;
                pop.Port = smtpe.PPort;
                pop.SSL = smtpe.PSSL;
                var Pop = db.PoPP.Add(pop);
                db.SaveChanges();

                //Save Email
                CnfiEmail cnf = new CnfiEmail();
                cnf.Email = smtpe.Email;
                cnf.password = smtpe.Password;
                cnf.Sid = Smtp.Sid;
                cnf.Pid = Pop.Pid;
                cnf.Uid = SessionContext.CurrentUser.Uid;
                var Email = db.CnfiEmail.Add(cnf);
                db.SaveChanges();
                return RedirectToAction("Index", "Dashboards");
                
            }
            return RedirectToAction("Login","Account");
        }

        [HttpPost]
        public ActionResult Select(int Email)
        {
            Session["Email"] = Email;
            return RedirectToAction("Index", "Dashboards");
        }

        public ActionResult ReadMail()
        {
            int eid = Convert.ToInt32(Session["Email"]);
            var PEmails = db.CnfiEmail.FirstOrDefault(x => x.id == eid);
            var pid = db.PoPP.FirstOrDefault(x => x.Pid == PEmails.Pid);
            Pop3Client pop3Client;
            if (Session["Pop3Client"] == null)
            {
                pop3Client = new Pop3Client();
                pop3Client.Connect(pid.ServerName, pid.Port, pid.SSL);
                pop3Client.Authenticate(PEmails.Email, PEmails.password);
                Session["Pop3Client"] = pop3Client;
            }
            else
            {
                pop3Client = (Pop3Client)Session["Pop3Client"];
            }
            int count = pop3Client.GetMessageCount();
            var Emails = new List<POPEmail>();
            int counter = 0;
            for (int i = count; i >= 1; i--)
            {
                Message message = pop3Client.GetMessage(i);
                POPEmail email = new POPEmail()
                {
                    MessageNumber = i,
                    Subject = message.Headers.Subject,
                    DateSent = message.Headers.DateSent,
                    From = string.Format("<a href = 'mailto:{1}'>{0}</a>", message.Headers.From.DisplayName, message.Headers.From.Address),
                };
                MessagePart body = message.FindFirstHtmlVersion();
                if (body != null)
                {
                    email.Body = body.GetBodyAsText();
                }
                else
                {
                    body = message.FindFirstPlainTextVersion();
                    if (body != null)
                    {
                        email.Body = body.GetBodyAsText();
                    }
                }
                List<MessagePart> attachments = message.FindAllAttachments();

                foreach (MessagePart attachment in attachments)
                {
                    email.Attachments.Add(new Attachment
                    {
                        FileName = attachment.FileName,
                        ContentType = attachment.ContentType.MediaType,
                        Content = attachment.Body
                    });
                }
                Emails.Add(email);
                counter++;
                if (counter > 2)
                {
                    break;
                }
            }
            var emails = Emails;
            return View(emails);
        }


    }
}