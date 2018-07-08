<%@ Page Language="C#" %>
<script runat="server">
    string lang = "en";
    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);
        lang = Request.UserLanguages[0].Replace("-", "_");
        if (string.IsNullOrEmpty(lang))
            lang = "en";
        string path = Server.MapPath("language/" + lang + ".js");
        if (string.IsNullOrEmpty(path) || !System.IO.File.Exists(path))
            lang = "en";
        Response.Redirect("language/" + lang + ".js");
    }
</script>