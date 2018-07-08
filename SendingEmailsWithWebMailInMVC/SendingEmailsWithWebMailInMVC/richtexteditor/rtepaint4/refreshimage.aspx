<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<script runat="server">
	protected override void OnLoad(EventArgs e)
	{
		base.OnLoad(e);

		HttpCookie cookie = Request.Cookies["rterefreshimage"];
		if (cookie != null && cookie.Value == "1")
		{
			Img.ImageUrl = Request.QueryString["url"];
			panel1.Visible = false;
			panel2.Visible = true;
		}
		else
		{
			panel1.Visible = true;
			panel2.Visible = false;
		}

	}
</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title>refreshing..</title>
</head>
<body>
	<form id="form1" runat="server">
		<div>
			<asp:Image runat="server" ID="Img" />
		</div>
		<asp:Panel runat="server" ID="panel1">

			<script type="text/javascript">
			setTimeout(function()
			{
				document.cookie="rterefreshimage=1"
				window.location.reload(true);
			},1);
			</script>

		</asp:Panel>
		<asp:Panel runat="server" ID="panel2">

			<script type="text/javascript">
			setTimeout(function()
			{
				document.cookie="rterefreshimage=0"
				parent.OnRefreshImage();
			},1);
			</script>

		</asp:Panel>
	</form>
</body>
</html>
