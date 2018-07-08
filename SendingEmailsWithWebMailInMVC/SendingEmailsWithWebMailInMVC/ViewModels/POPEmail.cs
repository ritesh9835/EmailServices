using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SendingEmailsWithWebMailInMVC.ViewModels
{


    [Serializable]
    public class POPEmail
    {
        public POPEmail()
        {
            this.Attachments = new List<Attachment>();
        }
        public int MessageNumber { get; set; }
        [AllowHtml]
        public string From { get; set; }
        [AllowHtml]
        public string Subject { get; set; }
        [AllowHtml]
        public string Body { get; set; }
        public DateTime DateSent { get; set; }
        [AllowHtml]
        public List<Attachment> Attachments { get; set; }
    }
      [Serializable]
      public class Attachment
      {
          public string FileName { get; set; }
          public string ContentType { get; set; }
          public byte[] Content { get; set; }
      } 

}