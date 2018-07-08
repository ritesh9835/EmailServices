
window.RTEBBCodeEditor=$rte.Base._extends(function(base,type){

	this.init=function(config,textarea,loader)
	{
		this._textbox=loader.textbox;
		this._textbox.start_log();
		this._textbox.attach_event("logchange",this.delegate(function()
		{
			this.FireEvent("UpdateUI");
		}));
	}
	

	this.IsCommandReady=function(command)
	{
		switch(command.toLowerCase())
		{
			case "undo":
				return this._textbox.can_undo();
			case "redo":
				return this._textbox.can_redo();
		}
		return true;
	}
	this.IsCommandActive=function(command)
	{
		return false;
	}
	this.ExecCommand=function(command)
	{
		switch(command.toLowerCase())
		{
			case "undo":
				this._textbox.undo();
				break;
			case "redo":
				this._textbox.redo();
				break;
			case "bold":
				this.Surround("[b]","[/b]",["b"]);
				break;
			case "italic":
				this.Surround("[i]","[/i]",["i"]);
				break;
			case "underline":
				this.Surround("[u]","[/u]",["u"]);
				break;
			case "strikethrough":
				this.Surround("[s]","[/s]",["s"]);
				break;
			case "superscript":
				this.Surround("[sup]","[/sup]",["sup"]);
				break;
			case "subscript":
				this.Surround("[sub]","[/sub]",["sub"]);
				break;
			case "insertblockquote":
				this.Surround("[quote]","[/quote]",["quote"]);
				break;
			case "justifyleft":
				this.Surround("[align=left]","[/align]",["align"]);
				break;
			case "justifycenter":
				this.Surround("[align=center]","[/align]",["align"]);
				break;
			case "justifyright":
				this.Surround("[align=right]","[/align]",["align"]);
				break;
			case "removeformat":
				this.Surround("","",["b","i","u","s","sup","sub","face","size","color"]);
				break;
		}
	}
	this.ExecUICommand=function(element,command)
	{
		this.ExecCommand(command);
	}
	
	this.Surround=function(left,right,removes)
	{
		var txt=this._textbox.get_range_text();
		var add=true;
		if(txt)
		{
			var pl=txt.indexOf(left);
			var pr=txt.lastIndexOf(right);
			if(pl>-1&&pr>pl)
			{
				var l=txt.substring(0,pl);
				var r=txt.substring(pr+right.length);
				var re=/\[\/?[a-z\*]+(=[^\]]*)?\]/ig;
				if(!l.replace(re,"")&&!r.replace(re,""))
				{
					add=false;
				}
			}
		}
		if(txt&&removes)
		{
			for(var i=0;i<removes.length;i++)
			{
				var remove=removes[i];
				var re=new RegExp("\\[\\/?"+remove+"(=[^\\]]*)?\\]","ig");
				txt=txt.replace(re,"")
			}
		}
		if(add)
		{
			//TODO: prompt inner text
			//if(!txt)txt="content"
			txt=left+txt+right;
		}
		this._textbox.set_range_text(txt);
	}
});





