<%@ Page Language="C#" %>
<%@ Import Namespace="System.Drawing" %>
<%@ Import Namespace="System.IO" %>
<script runat="server">
    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);
        
        //1.receive command
        //2.create temp file : start with guid, contain layerid, and end with png type
        //3.when rotate or resize, find this layerid temp file first, after operate, re-save as the same name

        //guid,temppath,layerid, actionname, sx, sy, sw, sh, tx, ty, angle, txt, imgurl, copyid, color, linewidth
        string query = Request["p"];
        if (query==null)
        {
            Response.End();
            return; 
        }
		string[] qs = query.Trim().Split(',');
        if (qs.Length != 16)
        {
			Response.End();
            return;
        }

		qs[0] = new Guid(qs[0]).ToString();
		qs[1] = Path.Combine(RTE.Editor.GetImageEditorTempDirectory(Context),new Guid(qs[1]).ToString());

		if (qs[12].IndexOfAny(Path.InvalidPathChars)!=-1)
		{
			Response.End();
			return;
		}
		
		foreach (char c in qs[12])
		{
			if (c == '/' || c == '\\' || c == '?')
			{
				Response.End();
				return;
			}
		}
		qs[12] = Path.Combine(qs[1], qs[12]);

        RTE.ImageEditor.Draw2dParams d2p = new RTE.ImageEditor.Draw2dParams(qs[0], qs[1], qs[2], qs[3], Convert.ToInt32(qs[4]), Convert.ToInt32(qs[5]),
            Convert.ToInt32(qs[6]), Convert.ToInt32(qs[7]), Convert.ToInt32(qs[8]),
            Convert.ToInt32(qs[9]), Convert.ToInt32(qs[10]), qs[11], qs[12], qs[13], qs[14], Convert.ToInt32(qs[15]));
        
		RTE.ImageEditor.Draw2dRoute d2r = new RTE.ImageEditor.Draw2dRoute();
        
		System.Drawing.Image img = d2r.CreateFragmentImage(d2p);
		
		img.Save(Response.OutputStream, System.Drawing.Imaging.ImageFormat.Png);
		
        Response.Flush();
        Response.End();
    }

    
</script>