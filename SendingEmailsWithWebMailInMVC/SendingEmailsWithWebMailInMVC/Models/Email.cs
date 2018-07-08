using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace SendingEmailsWithWebMailInMVC.Models
{
    public class Email
    {
          
        [DataType(DataType.EmailAddress),Display(Name ="To")]
        [Required]
        public string ToEmail { get; set; }
        [Display(Name ="Body")]
        [AllowHtml]
        [DataType(DataType.MultilineText)]
        public string EMailBody { get; set; }
        [Display(Name ="Subject")]
        public string EmailSubject { get; set; }
        [DataType(DataType.EmailAddress)]
        [Display(Name ="CC")]
        public string EmailCC { get; set; }
        [DataType(DataType.EmailAddress)]
        [Display(Name ="BCC")]
        public string EmailBCC { get; set; }
    }
}
