using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace SendingEmailsWithWebMailInMVC.Common
{
    public static class HtmlHelpers
    {
        public static string ToJson(this object obj)
        {
            return JsonConvert.SerializeObject(obj, Formatting.None);
        }
        public class ExtendedSelectListItem : SelectListItem
        {
            public IDictionary<string, object> htmlAttributes { get; set; }
        }
        public static T Iff<T>(this HtmlHelper html, bool condition, T trueValue, T falseValue)
        {
            return condition ? trueValue : falseValue;
        }

        public static T Iff<T>(this HtmlHelper html, bool condition, T trueValue)
        {
            return html.Iff<T>(condition, trueValue, default(T));
        }
        public static IEnumerable<SelectListItem> ToSelectListItems<T>(this ICollection<T> collection,
           Func<T, string> valueSelector,
           Func<T, string> textSelector, string initialValue = null)
        {
            if (collection == null)
                return new List<SelectListItem>();

            return collection.Select(c =>
            {

                var isSelected = (initialValue == valueSelector(c));
                return new SelectListItem()
                {
                    Text = textSelector(c),
                    Value = valueSelector(c),
                    Selected = isSelected
                };
            });
        }

        public static MvcHtmlString MessageDialog(this HtmlHelper htmlHelper, string message, bool isSuccess = true)
        {
            // Convert each ListItem to an <option> tag
            StringBuilder modalContentBuilder = new StringBuilder();
            modalContentBuilder.AppendFormat("<div class='modal fade in' id='{0}-modal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='false' style='display: none;'>", isSuccess ? "success" : "error");
            modalContentBuilder.AppendLine("<div class='modal-dialog'>");
            modalContentBuilder.AppendLine("<div class='modal-content'>");
            modalContentBuilder.AppendLine("<div class='modal-body'>");
            modalContentBuilder.AppendFormat("<div id='message' class='{0}'>{1}</div>", isSuccess ? "successMsg" : "errorMsg", message);
            modalContentBuilder.AppendLine("</div>");
            modalContentBuilder.AppendLine("<div class='modal-footer'>");
            modalContentBuilder.AppendLine("<button type='button' class='' data-dismiss='modal'>Close</button>");
            modalContentBuilder.AppendLine("</div>");
            modalContentBuilder.AppendLine("</div>");
            modalContentBuilder.AppendLine("</div>");
            modalContentBuilder.AppendLine("</div>");

            return MvcHtmlString.Create(modalContentBuilder.ToString());
        }
    }
}