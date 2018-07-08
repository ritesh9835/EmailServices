<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Drawing" %>
<script runat="server">
    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);
        
        //1. receive a list of [layerid,startx,starty,width,height]..., split with ;
        //2. re-draw based on base image, then save by saving params
        string name = Request["name"];
        string type = Request["type"];
        string path = Request["path"];
        string guid = Request["guid"];
        string imageid = Request["imageid"];
        string overwrite = Request["overwrite"];
        string layers = Request["layers"];
        string cleantemp = Request["cleantemp"];

        if (StringIsNullOrEmpty(guid))
        {
            WriteResponse("{\"error\":\"Empty Data\",\"value\":\"\"}");
            return; 
        }
		guid = new Guid(guid).ToString();
		if (name.IndexOfAny(Path.InvalidPathChars) != -1)
		{
			WriteResponse("{\"error\":\"Invalid Data\",\"value\":\"\"}");
			return;
		}
		foreach (char c in name)
		{
			if (c == '/' || c == '\\' || c == '?')
			{
				WriteResponse("{\"error\":\"Invalid Data\",\"value\":\"\"}");
				return;
			}
		}
		type = type.ToLower();
		if (type != "jpg" && type != "bmp" && type != "gif" && type != "png" && type != "jpeg")
		{
			WriteResponse("{\"error\":\"Invalid Data\",\"value\":\"\"}");
			return;
		}
		path = Path.Combine(RTE.Editor.GetImageEditorTempDirectory(Context), new Guid(path).ToString());
		imageid = Path.Combine(RTE.Editor.GetImageEditorTempDirectory(Context), new Guid(imageid).ToString());
		
        string savepath = path.IndexOf(":") >= 0 ? path : Server.MapPath(path);
        if (StringIsNullOrEmpty(savepath))
            savepath = Server.MapPath("~/ImageEditorFile");
        string tempsavepath = imageid.IndexOf(":") >= 0 ? imageid : Server.MapPath(imageid);
        if (StringIsNullOrEmpty(tempsavepath))
            tempsavepath = Server.MapPath("~/ImageEditorTemp");
        if (!StringIsNullOrEmpty(cleantemp) && cleantemp == "unload")
        {
            try
            {
                //CleanTempPath(tempsavepath, guid);
            }
            catch
            {
            }
        }
        try
        {
            if (!Directory.Exists(savepath))
                Directory.CreateDirectory(savepath);
            if (!Directory.Exists(tempsavepath))
                Directory.CreateDirectory(tempsavepath);
        }
        catch
        {
            WriteResponse("{\"error\":\"Create Directory Error\",\"value\":\"\"}");
            return;
        }
        string file_base = GetTempFileName(tempsavepath, guid, "0");
        if (!File.Exists(file_base))
        {
            WriteResponse("{\"error\":\"File does not exist\",\"value\":\"\"}");
            return;
        }
        if (layers == null)
            layers = "";
        string[] layerarr = layers.Split(new char[]{';'}, StringSplitOptions.RemoveEmptyEntries);
        RTE.ImageEditor.Draw2d draw = new RTE.ImageEditor.Draw2d(file_base);
        int ow = draw.Width;
        int oh = draw.Height;
        foreach (string layer in layerarr)
        {
            string[] arr = layer.Split(',');
            string layerid = arr[0];
            int sx = Convert.ToInt32(arr[1]);
            int sy = Convert.ToInt32(arr[2]);
            string _fp = GetTempFileName(tempsavepath, guid, layerid);
            System.Drawing.Image bmp = GetLocalImage(_fp);
            if (bmp == null)
                continue;
            int sw = bmp.Width;
            int sh = bmp.Height;
            Rectangle rect = new Rectangle(sx, sy, sw, sh);
            draw.DrawImage(bmp, rect);
        }
        if (!string.IsNullOrEmpty(cleantemp) && cleantemp == "1")
        {
            //CleanTempPath(tempsavepath, guid);
        }
        string ret = SaveFile(name, type, path, draw.Image, overwrite, savepath);
        WriteResponse(ret);
    }
    
    private bool StringIsNullOrEmpty(string str)
    {
        if (str == null || str == "")
            return true;
        return false;
    }
    
    private void WriteResponse(string c)
    {
        Response.Write(c);
        Response.Flush();
        Response.End();
    }

    private System.Drawing.Image GetLocalImage(string filepath)
    {
        if (!File.Exists(filepath))
            return null;
        try
        {
            MemoryStream ms = new MemoryStream(File.ReadAllBytes(filepath));
            return Bitmap.FromStream(ms);
        }
        catch
        {
            return null; 
        }
    }

    private string SaveFile(string name, string type, string path, System.Drawing.Bitmap img, string overwrite, string savepath)
    {
        name = EnsureValidName(name);
        try
        {
            if (!string.IsNullOrEmpty(overwrite) && overwrite == "false")
            {
                name = CalcUniqueName(name, type, savepath);
            }
            System.Drawing.Bitmap bitsave = new System.Drawing.Bitmap(img.Width, img.Height);
            if (type == "jpg" || type=="bmp")
            {
                System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bitsave);
                g.Clear(System.Drawing.Color.White);
                g.Save();
                g.DrawImage(img, new System.Drawing.Rectangle(0, 0, img.Width, img.Height));
            }
            else if (type == "gif")
            {
                bitsave = new Bitmap(img.Width, img.Height, System.Drawing.Imaging.PixelFormat.Format8bppIndexed);
                bitsave.MakeTransparent();
                for (int x = 0; x < img.Width; x++)
                {
                    for (int y = 0; y < img.Height; y++)
                    {
                        Color tc = img.GetPixel(x, y);
                        if (tc.A == 0)
                            bitsave.SetPixel(x, y, Color.Transparent);
                        else
                            bitsave.SetPixel(x, y, tc);
                    }
                }
                bitsave = MakeTransparentGif(bitsave, Color.Transparent);
            }
            else
            {
                bitsave = img; 
            }
            bitsave.Save(savepath.TrimEnd('/') + "/" + name + "." + type, GetImageFormat(type));
            return "{\"error\":null,\"value\":\"" + path.Replace("\\","/").TrimEnd('/') + "/" + name + "." + type + "\"}";
        }
        catch
        {
            return "{\"error\":\"Error Image Data\",\"value\":\"\"}";
        }
    }

    private string GetTempFileName(string imageid, string guid, string layerid)
    {
        return Path.Combine(imageid, guid + "." + layerid + ".png");
    }

    private string EnsureValidName(string name)
    {
        //[\\*\\\\/:? <> |\ "]
        Regex regEx = new Regex("[\\*\\\\/:?<>|\"]");
        if (!regEx.IsMatch(name)) return name;
        return regEx.Replace(name, "");
    }
    
    private string CalcUniqueName(string name, string type, string path)
    {
        string fullpath = path.TrimEnd('/') + "/" + name + "." + type;
        if (!File.Exists(fullpath))
            return name;
        string[] files = Directory.GetFiles(path, name + "_*." + type, SearchOption.TopDirectoryOnly);
        if (files.Length == 0)
            return name + "_1";
        int ix = 1;
        foreach (string fn in files)
        {
            string _s = Path.GetFileName(fn).Remove(0, name.Length + 1);
            _s = _s.Replace("." + type, "");
            int _tx = 1;
            int.TryParse(_s, out _tx);
            if (ix <= _tx)
                ix = _tx + 1;
        }
        return name + "_" + ix;
    }

    private void CleanTempPath(string imageid, string guid)
    {
        string[] files = Directory.GetFiles(imageid, guid + ".*.png", SearchOption.TopDirectoryOnly);
        if (files.Length == 0)
            return;
        foreach (string file in files)
        {
            try
            {
                File.Delete(file);
            }
            catch
            { 
            }
        }
    }

    private System.Drawing.Imaging.ImageFormat GetImageFormat(string type)
    {
        System.Drawing.Imaging.ImageFormat ret = System.Drawing.Imaging.ImageFormat.Png;
        if (!string.IsNullOrEmpty(type)) type = type.ToLower();
        switch (type)
        {
            case "jpg":
            case "jpeg":
                ret = System.Drawing.Imaging.ImageFormat.Jpeg;
                break;
            case "tiff":
                ret = System.Drawing.Imaging.ImageFormat.Tiff;
                break;
            case "bmp":
                ret = System.Drawing.Imaging.ImageFormat.Bmp;
                break;
            case "gif":
                ret = System.Drawing.Imaging.ImageFormat.Gif;
                break;
            case "ico":
                ret = System.Drawing.Imaging.ImageFormat.Icon;
                break;
            case "wmf":
            case "emf":
                ret = System.Drawing.Imaging.ImageFormat.Wmf;
                break;
        }
        return ret;
    }
    
    public Bitmap MakeTransparentGif(Bitmap bitmap, Color color)
    {
        byte R = color.R;
        byte G = color.G;
        byte B = color.B;

        MemoryStream fin = new MemoryStream();
        bitmap.Save(fin, System.Drawing.Imaging.ImageFormat.Gif);

        MemoryStream fout = new MemoryStream((int)fin.Length);
        int count = 0;
        byte[] buf = new byte[256];
        byte transparentIdx = 0;
        fin.Seek(0, SeekOrigin.Begin);
        //header
        count = fin.Read(buf, 0, 13);
        if ((buf[0] != 71) || (buf[1] != 73) || (buf[2] != 70)) return null; //GIF

        fout.Write(buf, 0, 13);

        int i = 0;
        if ((buf[10] & 0x80) > 0)
        {
            i = 1 << ((buf[10] & 7) + 1) == 256 ? 256 : 0;
        }

        for (; i != 0; i--)
        {
            fin.Read(buf, 0, 3);
            if ((buf[0] == R) && (buf[1] == G) && (buf[2] == B))
            {
                transparentIdx = (byte)(256 - i);
            }
            fout.Write(buf, 0, 3);
        }

        bool gcePresent = false;
        while (true)
        {
            fin.Read(buf, 0, 1);
            fout.Write(buf, 0, 1);
            if (buf[0] != 0x21) break;
            fin.Read(buf, 0, 1);
            fout.Write(buf, 0, 1);
            gcePresent = (buf[0] == 0xf9);
            while (true)
            {
                fin.Read(buf, 0, 1);
                fout.Write(buf, 0, 1);
                if (buf[0] == 0) break;
                count = buf[0];
                if (fin.Read(buf, 0, count) != count) return null;
                if (gcePresent)
                {
                    if (count == 4)
                    {
                        buf[0] |= 0x01;
                        buf[3] = transparentIdx;
                    }
                }
                fout.Write(buf, 0, count);
            }
        }
        while (count > 0)
        {
            count = fin.Read(buf, 0, 1);
            fout.Write(buf, 0, 1);
        }
        fin.Close();
        fout.Flush();

        return new Bitmap(fout);
    }
</script>