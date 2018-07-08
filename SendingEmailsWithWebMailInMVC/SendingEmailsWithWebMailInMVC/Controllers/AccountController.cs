using SendingEmailsWithWebMailInMVC.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SendingEmailsWithWebMailInMVC.Models;
using SendingEmailsWithWebMailInMVC.Common;
using System.Web.Security;
using System.Security.Principal;

namespace SendingEmailsWithWebMailInMVC.Controllers
{
    public class AccountController : Controller
    {
        private DefaultConnection db = new DefaultConnection();
        private SessionContext _sessionContext;
        public AccountController()
        {
            _sessionContext = new SessionContext();
        }
        // GET: Account
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(User User )
        {
            if (ModelState.IsValid)
            {
                var user = db.User.FirstOrDefault(x => x.Email == User.Email);
                if (user != null)
                {
                    var validatePwd = EncryptionService.ValidatePassword(User.Password, user.Password);
                    if (validatePwd)
                    {
                        AuthenticateUser(user);
                        return RedirectToAction("Index", "Dashboards");
                    }
                    else { ModelState.AddModelError("Email", "Please enter your correct credentials."); }
                }
            }
            return View(User);
        }

           private void AuthenticateUser(User user)
        {
            SessionContext.CurrentUser = user as User;
            FormsAuthentication.SetAuthCookie(user.Email, false);
            var ticket = new FormsAuthenticationTicket(1, user.Email, DateTime.UtcNow, DateTime.UtcNow.AddMinutes(System.Web.HttpContext.Current.Session.Timeout),
                false, user.ToString(), FormsAuthentication.FormsCookiePath);
            var encryptedTicket = FormsAuthentication.Encrypt(ticket);
            var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket) { HttpOnly = true };
            authCookie.Expires = ticket.Expiration;
            System.Web.HttpContext.Current.Response.Cookies.Add(authCookie);
            _sessionContext.SetUpSessionContext(HttpContext, SessionContext.CurrentUser);
            SetUserIdentity(SessionContext.LoggedOnUser);
        }

        private void SetUserIdentity(User user)
        {
            var identity = new GenericIdentity(user.Email);
            GenericPrincipal principal;
            string[] userRole = { "User" };
            principal = new GenericPrincipal(identity, userRole);
            HttpContext.User = principal;
            SiteSession siteSession = new SiteSession(user);
        }

        [HttpGet]
        public ActionResult SignUp()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult SignUp(User User)
        {
            var hashedPassword = EncryptionService.CreateHash(User.Password);
            User.Password = hashedPassword;
            User.CreatedOn = DateTime.Now;
            if(User.IsSuperAdmin == null)
            User.IsSuperAdmin = false;
            var user = db.User.Add(User);
            db.SaveChanges();
            var role = new Role();
            role.Uid = user.Uid;
            if (user.IsSuperAdmin == false)
                role.RoleName = "User";
            else
                role.RoleName = "Super Admin";
            var roles = db.Role.Add(role);
                if (user != null)
                    return View("Login");
            
            return View();
        }
        public ActionResult LogOff()
        {
            SignOut();
            SessionContext.CurrentUser = null;
            return RedirectToAction("Index", "Home");
        }

        public void SignOut()
        {
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetExpires(DateTime.Now.AddSeconds(-1));
            Response.Cache.SetNoStore();
            SessionContext.LogOff(HttpContext);
            Session.Clear();
            Session.RemoveAll();
            Session.Abandon();
            FormsAuthentication.SignOut();
            HttpCookie cookie = Request.Cookies[FormsAuthentication.FormsCookieName];
            if (cookie != null)
            {
                cookie.Expires = DateTime.Now.AddDays(-1);
                Response.Cookies.Add(cookie);
            }
        }
    }
}