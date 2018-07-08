
window.RTESimpleEditor=$rte.Base._extends(function(base,type){

	this.init=function(config,textarea,loader)
	{
		var frame=config.skin_frame;
		var win=frame.contentWindow;
		var doc=win.document;
		if(jsml.msie)
			doc.body.contentEditable=true
		else
			doc.designMode='on';
		

		var body=doc.body;
		body.innerHTML=textarea.value;
		
		var head=doc.getElementsByTagName("head")[0]
		
		var link=doc.createElement("LINK");
		link.setAttribute("rel","stylesheet");
		link.setAttribute("href",config.folder+"styles/tabedit.css?"+config._urlsuffix);
		head.appendChild(link);
		
		var contentcss=config.contentcss;
		if(contentcss)
		{
			contentcss=contentcss.split(',');
			for(var i=0;i<contentcss.length;i++)
			{
				if(!contentcss[i])
					continue;
				var link=doc.createElement("LINK");
				link.setAttribute("rel","stylesheet");
				link.setAttribute("href",this.MakeAbsoluteUrl(contentcss[i]));
				head.appendChild(link);
			}
		}
		
		this._config=config;
		this._loader=loader;
		this._frame=frame;
		this._win=win;
		
		var editor=this;
		this._updateuifunc=function()
		{
			editor.FireEvent("UpdateUI");
			document.title= textarea.value = body.innerHTML;
		};
		setTimeout(function()
		{
			editor._HookEvents();
		},100);
	}
	
	this.MakeAbsoluteUrl=function(url)
	{
		if(url.charAt(0)!="/"&&url.indexOf("://")==-1)
		{
			var prefix=window.location.href.split('#')[0].split('?')[0].split('/');
			prefix[prefix.length-1]=url;
			prefix.splice(0,3);
			url="/"+prefix.join('/');
		}
		return url;
	}
	
	this._HookEvents=function()
	{
		var win=this._win;
		var doc=win.document;
		var editor=this;
		
		function hook(obj,name,handler)
		{
			obj.addEventListener(name,handler,false);
		}
		
		hook(doc,"click",function()
		{
			editor.CheckContentVersion();
		});
		hook(doc,"mousedown",function()
		{
			editor.CheckContentVersion();
		});
		hook(doc,"mouseup",function()
		{
			editor.CheckContentVersion();
		});
		hook(doc,"keyup",function()
		{
			editor.CheckContentVersion();
		});
		hook(doc, "keydown", function () {
			editor.CheckContentVersion();
		});
		hook(doc, "paste", function () {
			editor.CheckContentVersion();
		});
		hook(win,"selectionchange",function()
		{
			editor.CheckContentVersion();
		});
	}
	
	this.CheckContentVersion=function()
	{
		clearTimeout(this._updateuitimerid);
		this._updateuitimerid=setTimeout(this._updateuifunc,100);
	}
	
	this.IsCommandReady=function(command)
	{
		switch(command.toLowerCase())
		{
			case "insertblockquote":
				command="formatblock";
		}
		
		try
		{
			return this._win.document.queryCommandEnabled(command);
		}
		catch(x)
		{
			//document.title=command+","+x.message
			return true;
		}
	}
	this.IsCommandActive=function(command)
	{
		switch(command.toLowerCase())
		{
			case "justifyleft":
				return false;
			case "insertblockquote":
				return this.HasFormatBlock("blockquote");
		}
		
		try
		{
			return this._win.document.queryCommandState(command);
		}
		catch(x)
		{
			return false;
		}
	}
	this.ExecCommand=function(command,arg0,arg1)
	{
		switch(command.toLowerCase())
		{
			case "insertblockquote":
				command="formatblock";
				if(this.HasFormatBlock("blockquote"))
					command="outdent";
				else
					arg0="blockquote";
				break;
		}
		
		this._win.document.execCommand(command,false,arg0);
		this.CheckContentVersion();
	}
	this.ExecUICommand=function(element,command,arg0,arg1)
	{
		this.ExecCommand(command,arg0,arg1);
	}
	
	this.HasFormatBlock=function(name)
	{
		name=name.toUpperCase();
		var val=this._win.document.queryCommandValue("formatblock");
		if(val&&val.toUpperCase()==name)
			return true;
		var sel=this._win.getSelection();
		if(sel.rangeCount==0)
			return false;
		var rng=sel.getRangeAt(0);
		var node=rng.startContainer;
		if(!node)
			return false;
		for(;node;node=node.parentNode)
			if(node.nodeName==name)
				return true;
		return false;
	}
	
});


