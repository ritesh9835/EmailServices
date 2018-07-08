<%@ Page Language="C#" %>

<%@ Import Namespace="System.IO" %>
<!DOCTYPE html>
<script runat="server">

	protected override void OnInit(EventArgs e)
	{
		//config.configjsurl = config.folder + "scripts/config.js?" + config._urlsuffix;
		//config.rtecssurl = config.folder + "styles/richtexteditor.css?" + config._urlsuffix;
		//config.jsmljsurl = config.folder + "core/jsml.js?" + config._urlsuffix;
		//config.commonxmlurl = config.folder + "scripts/common.xml?" + config._urlsuffix;
		//config.editorjsurl = config.folder + "scripts/editor.js?" + config._urlsuffix;
		//config.corejsurl = config.folder + "core/core.js?" + config._urlsuffix;

		string suffix = JSEncode(Request.QueryString["suffix"]);

		string rtefolder = Path.GetDirectoryName(Path.GetDirectoryName(this.Request.PhysicalPath));

		List<string> files = new List<string>();
		files.Add("scripts/config.js");
		files.Add("styles/richtexteditor.css");
		files.Add("core/jsml.js");
		files.Add("scripts/common.xml");
		files.Add("scripts/editor.js");
		files.Add("core/core.js");

		files.Add("styles/tabedit.css");

		files.Add("dialogs/setfontname.xml");
		files.Add("dialogs/setfontsize.xml");
		files.Add("dialogs/setparagraph.xml");
		files.Add("dialogs/setstyles.xml");

		string scriptsfolder = Path.Combine(rtefolder, "scripts");
		foreach (string scriptfile in Directory.GetFiles(scriptsfolder))
		{
			string filename = Path.GetFileName(scriptfile);
			if (filename.StartsWith("blank", StringComparison.OrdinalIgnoreCase))
			{
				files.Add("scripts/" + filename);
			}
		}

		string pluginsfolder = Path.Combine(rtefolder, "plugins");

		foreach (string pluginfolder in Directory.GetDirectories(pluginsfolder))
		{
			string plugin = Path.GetFileName(pluginfolder);
			string file = "plugins/" + plugin + "/plugin.xml";
			if (!File.Exists(Path.Combine(rtefolder, file)))
				continue;
			files.Add(file);
		}

		files.Add("skins/_shared/_layout.xml");
		files.Add("skins/_shared/_toolbartemplate.xml");

		string skin = Request.QueryString["skin"];
		if (!string.IsNullOrEmpty(skin) && skin.IndexOfAny(Path.GetInvalidFileNameChars()) == -1)
		{
			files.Add("skins/" + skin + "/skin.xml");
			files.Add("skins/" + skin + "/toolbar_custom.xml");
			files.Add("skins/" + skin + "/toolbar_template.xml");
		}

		string langfiles = Request.QueryString["langfiles"];
		if (!string.IsNullOrEmpty(langfiles))
		{
			foreach (string langfile in langfiles.Split(','))
			{
				if (langfile.IndexOfAny(Path.GetInvalidFileNameChars()) != -1)
					continue;
				files.Add("lang/" + langfile + ".js");
			}
		}

		StringBuilder sb = new StringBuilder();

		foreach (string file in files)
		{
			string fullpath = Path.Combine(rtefolder, file);
			if (!File.Exists(fullpath))
				continue;
			string filecode = File.ReadAllText(fullpath);
			sb.Append("loader.addurltext('").Append(file).Append("?").Append(suffix).Append("','").Append(JSEncode(filecode)).Append("');\r\n");
		}

		Response.Clear();
		Response.ContentType = "text/javascript";
		Response.Cache.SetCacheability(HttpCacheability.Public);
		Response.Cache.SetLastModified(DateTime.Now);
		Response.Cache.SetMaxAge(TimeSpan.FromDays(1));
		Response.Cache.SetExpires(DateTime.Now.AddDays(1));
		Response.Write(sb.ToString());
		Response.End();
	}


	static System.Text.RegularExpressions.Regex jsre = new System.Text.RegularExpressions.Regex(@"\\|\""|\r|\n|\'|\<|\>|\&"
				, System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline | System.Text.RegularExpressions.RegexOptions.Compiled);

	static public string JSEncode(string str)
	{
		if (str == null) return "";
		lock (jsre)
		{
			return jsre.Replace(str, new System.Text.RegularExpressions.MatchEvaluator(JSEncodeReplace));
		}
	}
	static string JSEncodeReplace(System.Text.RegularExpressions.Match m)
	{
		int code = (int)m.Value[0];
		string chars = "0123456789ABCDEF";
		int a1 = code & 0xF;
		int a2 = (code & 0xF0) / 0x10;

		return "\\x" + chars[a2] + chars[a1];
	}

</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title></title>
</head>
<body>
	<form id="form1" runat="server">
		<div>
		</div>
	</form>
</body>
</html>
