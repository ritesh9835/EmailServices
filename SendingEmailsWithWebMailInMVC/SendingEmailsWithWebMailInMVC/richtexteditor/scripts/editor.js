

$rte.Editor=$rte.Core._extends(function(base,type){

	var tempdiv=document.createElement("DIV");

	this.init=function(config,frame,win,loader){
	
		this._config=config;
		this._loader=loader;
		this._starttime=new Date().getTime();
		
		config.skin_div.editor=this;

		base.init.apply(this,[config,frame,win]);

		this._FindAndLoadUploader();

		//if(!this._config._debugmode)
		//{
		//	setTimeout(this.delegate(function()
		//	{
		//		this.PreloadDialogUrl("_dialog.xml");
		//		this.PreloadDialogUrl("browsedialogbase.xml");
		//		this.PreloadDialogUrl("menu_context_default.xml");
		//	}),this._config.delay_preload||5000);
		//}

	}
	
		
	this.Dispose=function()
	{
		base.Dispose.apply(this);
		this._config.skin_control.dispose();
	}
	
	
	this.GetConfig=function()
	{
		return this._config;
	}
	this.GetLangText=function(name,nullifnotfound)
	{
		return this._loader.getLangText.apply(this._loader,arguments);
	}
	this._InitUserDataBehavior=function(cate)
	{
		if(!config.userDataBehavior)return false;
		if(!config.userDataBehavior.load)return false;
		config.userDataBehavior.load("rte-"+cate);
		return true;
	}
	this.SupportLocalData=function()
	{
		var config=this._config;
		if(config.localStorage)
			return true;
		if(config.userDataBehavior&&config.userDataBehavior.load)
			return true;
		return false;
	}
	this.SetLocalData=function(cate,name,value)
	{
		var config=this._config;
		if(config.localStorage)
		{
			config.localStorage.setItem(cate+"-"+name,value);
			return;
		}
		if(this._InitUserDataBehavior(cate))
		{
			config.userDataBehavior.setAttribute(name,value);
			config.userDataBehavior.save("rte-"+cate);
			return;
		}
	}
	this.GetLocalData=function(cate,name)
	{
		var config=this._config;
		if(config.localStorage)
		{
			return config.localStorage.getItem(cate+"-"+name);
		}
		if(this._InitUserDataBehavior(cate))
		{
			return config.userDataBehavior.getAttribute(name);
		}
	}

	this._FindAndLoadUploader=function()
	{
		this.uploaderhidden=document.getElementById(this._config.uploaderid);
		if(this.uploaderhidden==null)return;

		if(this.uploaderhidden.internalobject)
		{
			this._SetupUploader();
		}
		else
		{
			this.uploaderhidden.parentNode.style.display="";
			this.uploaderhidden.handleinitialize=this.delegate(function()
			{
				this.uploaderhidden.parentNode.style.display='none';
				this._SetupUploader();
			});
		}
	}
	
	this._CreateUploaderHandler=function(eventName)
	{
		var editor=this;
		return function Dispatcher()
		{			
			var uploader=this;

			var arr=[uploader];
			for(var i=0;i<arguments.length;i++)
				arr.push(arguments[i]);

			var res=editor._broadcastEvent("Uploader_"+eventName,arr);
			
			if(eventName=="Progress")
				return false;
			if(eventName=="QueueUI")
				return false;
			if(eventName=="Postback")
				return false;
			
			return res;
		};
	}
	
	this.WaitForUploader=function(callback)
	{
		if(!callback)return;
		if(this.uploaderfinished||this.uploadersetuperror)
			return callback(this.uploadersetuperror);
		if(!this.uploadercallbacks)this.uploadercallbacks=[];
		this.uploadercallbacks.push(callback);
	}
	this._SetupUploader=function()
	{
		this.uploaderhidden.internalobject.alwaysMantleButton=true;
		
		var editor=this;
		function MakeFunc(name)
		{
			editor.uploaderhidden["handle"+name.toLowerCase()]=editor._CreateUploaderHandler(name);
		}
		
		MakeFunc("Postback");
		MakeFunc("Progress");
		MakeFunc("QueueUI");
		MakeFunc("Browse");
		MakeFunc("Select");
		MakeFunc("Start");
		MakeFunc("Stop");
		MakeFunc("Initialize");
		
		MakeFunc("Error");
		MakeFunc("TaskStart");
		MakeFunc("TaskError");
		MakeFunc("TaskComplete");
		
		this.uploaderhidden.handlemantlebutton=this.delegate(this._uploaderMantleButton);

		if(!this._internalbtnadded)
		{
			this._internalbtnadded=true;
			this._SetupUploadButton(this.uploaderhidden.internalobject.insertBtn);
		}
		
		this.RunUploaderCallbacks();
	}
	this.RunUploaderCallbacks=function(err)
	{
		this.uploaderfinished=true;
		this.uploadersetuperror=err;
		if(!this.uploadercallbacks)
			return;
		for(var i=0;i<this.uploadercallbacks.length;i++)
			this.uploadercallbacks[i](this.uploadersetuperror);
	}
	this._SetupUploadButton=function(btn,movetonow)
	{
		if(!this.uploaderhidden)
		{
			btn.onclick=function(){
				alert("UploaderNotReady");
			};
			return;
		}

		if(!this._uploadbtns)
			this._uploadbtns=[];
		this._uploadbtns.push(btn);
		btn._onclick=btn.onclick;
		btn.onclick=this.delegate(function(){
			if(this.uploaderhidden.internalobject)
				this.uploaderhidden.startbrowse();
			return false;
		});
		btn._onmouseover=this.delegate(function(){
			this._overuploadbtn=btn;
			if(this._uploaddiv)
			{
				this._uploaderMantleButton(btn,this._uploaddiv,this._uploadaddon,null,"enter");
			}
		});
		btn._onmouseout=this.delegate(function(){
			if(this._uploaddiv)
			{
				this._uploaderMantleButton(btn,this._uploaddiv,this._uploadaddon,null,"leave");
			}
		});
		if(btn.attachEvent)
		{
			btn.attachEvent("onmouseover",btn._onmouseover);
			btn.attachEvent("onmouseout",btn._onmouseout);
		}
		else
		{
			btn.addEventListener("mouseover",btn._onmouseover,false);
			btn.addEventListener("mouseout",btn._onmouseout,false);
		}
		
		if(movetonow)
		{
			this._overuploadbtn=btn;
			if(this._uploaddiv)
			{
				this._uploaderMantleButton(btn,this._uploaddiv,this._uploadaddon,null,"enter");
			}
		}
	}
	this.FocusUploadButton=function(btn)
	{
		this._focusuploadbtn=btn;
	}
	this.RemoveUploadButton=function(btn)
	{
		if(this._focusuploadbtn==btn)
			this._focusuploadbtn=null;
		if(!this._uploadbtns)
			return;
		for(var i=0;i<this._uploadbtns.length;i++)
		{
			if(this._uploadbtns[i]!=btn)
				continue;

			this._uploadbtns.splice(i,1);
			btn.onclick=btn._onclick;
			if(btn.detachEvent)
			{
				btn.detachEvent("onmouseover",btn._onmouseover);
				btn.detachEvent("onmouseout",btn._onmouseout);
			}
			else
			{
				btn.removeEventListener("mouseover",btn._onmouseover,false);
				btn.removeEventListener("mouseout",btn._onmouseout,false);
			}
			return;
		}
	}
	this.RegisterUploadButton=function(btn,movetonow)
	{
		if(this.uploaderhidden)
		{
			this._SetupUploadButton(btn,movetonow);
			return;
		}
		
		if(this._settingMantleButton)
		{
			if(!this._addingupbtns)
				this._addingupbtns=[];
			this._addingupbtns.push(btn);
			return;
		}
		
		var config=this._config;
		
		this._settingMantleButton=btn;
		
		var handlehtml=this.delegate(function(res)
		{
			if(res.Error)
			{
				this.RunUploaderCallbacks(res.Error);
				return;
			}
			var html=res.ReturnValue;
			if(!html)
			{
				this.RunUploaderCallbacks("AjaxGetUploaderHTML failed");
				return;
			}
			var div=document.createElement("DIV");
			div.style.width="1px";
			div.style.height="1px";
			div.style.position="absolute";
			div.innerHTML=html;
			config.skin_div_parent.insertBefore(div,config.skin_div_holder);
			this._FindAndLoadUploader();
			if(!this.uploaderhidden)
			{
				this.RunUploaderCallbacks("AjaxGetUploaderHTML invalid")
				return;
			}
			this.RegisterUploadButton(btn,movetonow);
			if(this._addingupbtns)
			{
				for(var i=0;i<this._addingupbtns.length;i++)
					this.RegisterUploadButton(this._addingupbtns[i]);
				this._addingupbtns=null;
			}
		});
		var loadhtml=this.delegate(function()
		{
			this.CallAjax("AjaxGetUploaderHTML",handlehtml);
		});
		var loaduploader=this.delegate(function()
		{
			if(!window.RTE_AjaxUploader_Initialize)
			{
				loadhtml();
				return;
			}
			var hidden=document.getElementById("UploadLib_Uploader_js");
			if(hidden!=null)
			{
				loadhtml();
				return;
			}
			
			var form=document.forms[0]||document.body;
			var hidden = document.createElement("input");
			hidden.type = "hidden";
			hidden.id = hidden.name = "UploadLib_Uploader_js";
			hidden.value = "1";
			form.insertBefore(hidden, form.firstChild);
			hidden = null;
			loadhtml();
		});

		if(window.RTE_AjaxUploader_Initialize)
		{
			loaduploader();
			return;
		}

		var scripturl=this._config.uploaderscripturl||this._config.folder+"core/uploader.js?"+this._config._urlsuffix;
		if(!scripturl)
		{
			loaduploader();
			return;
		}
		var xh=jsml.xmlhttp();
		xh.onreadystatechange=function()
		{
			if(xh.readyState<4)return;
			xh.onreadystatechange=jsml.empty_function;
			if(xh.status!=200)
			{
				this.RunUploaderCallbacks("failed to load uploader.js");
				return;
			}
			var calleval=new Function("code","eval(code)");
			try
			{
				calleval(xh.responseText);
			}
			catch(x)
			{
				this.RunUploaderCallbacks("failed to run uploader.js : "+x.message);
				xh=null;//RELEASE_XMLHTTP_FOR_BROWSER_BUG
				throw(x);
			}
			xh=null;//RELEASE_XMLHTTP_FOR_BROWSER_BUG
		
			loaduploader();
		}
		xh.open("GET",scripturl,true);
		xh.send("");
	}
	this._uploaderMantleButton=function(btn,div,addon,flag,mode)
	{
		if(!this._uploaddiv)
		{
			this._uploaddiv=div;
			this._uploadaddon=addon;
		}
		
		div.onmousedown=jsml.cancel_bubble_function;

		div.onmouseover=this.delegate(function()
		{
			this._uploadover=true;
			if(this._overuploadbtn&&typeof(this._overuploadbtn.onmouseover)=="function")this._overuploadbtn.onmouseover();
		});
		div.onmouseout=this.delegate(function()
		{
			this._uploadover=false;
			if(this._overuploadbtn&&typeof(this._overuploadbtn.onmouseout)=="function")this._overuploadbtn.onmouseout();
		});
		
		if(mode=="enter")
		{
			this._uploadover=true;
		}
		if(mode=="leave")
		{
		
		}
		
		function hideit()
		{
			div.style.left="-100px";
			div.style.top="-100px";
		}
		
		var overbtn=this._overuploadbtn;
		
		if(this._focusuploadbtn)
		{
			overbtn=this._focusuploadbtn
		}
		else
		{
			if(!this._uploadover)return hideit();
			if(!this._overuploadbtn)return hideit();
		}
		
		var pos=jsml.calc_position(div,overbtn);
		div.style.left=pos.left+"px";
		div.style.top=pos.top+"px";
		div.style.cursor="pointer";
		addon.style.cursor="pointer";
		addon.style.width=div.style.width=this._overuploadbtn.offsetWidth+"px";
		addon.style.height=div.style.height=this._overuploadbtn.offsetHeight+"px";
	}
	
	this.GetWidth=function()
	{
		if(this._isfullscreen)
			return parseInt(this._origincontainerwidth);
		else
			return this._config.skin_control.get_current_width();
	}
	this.GetHeight=function()
	{
		if(this._isfullscreen)
			return parseInt(this._origincontainerheight);
		else
			return this._config.skin_control.get_current_height();
	}
	this.SetWidth=function(value)
	{
		value=parseInt(value);
		if(!value)return;
	
		if(this._isfullscreen)
		{
			this._origincontainerwidth=value+"px";
		}
		else
		{
			var skindiv=this._config.skin_div;
			var skinctrl=this._config.skin_control;
			skindiv.style.width=value+"px";
			skinctrl.set_width(value);
		}
	}
	this.SetHeight=function(value)
	{
		value=parseInt(value);
		if(!value)return;
		
		if(this._isfullscreen)
		{
			this._origincontainerheight=value+"px";
		}
		else
		{
			var skindiv=this._config.skin_div;
			var skinctrl=this._config.skin_control;
			skindiv.style.height=value+"px";
			skinctrl.set_height(value);
		}
	}

	this._toggleFullScreen=function()
	{
		var config=this._config;
		
		var db=document.body;
		var de=document.documentElement;
		
		var div=config.skin_div;
		var ctrl=config.skin_control;
		
		var rect=jsml.get_body_rect();
		if(jsml.mobile)
		{
			rect.width=rect.width+20;
		}
		
		var handleresize=this.delegate(function()
		{
			if(!this._isfullscreen)return;
			
			if(!jsml.mobile)
			{
				rect=jsml.get_body_rect();
			}

			var nextwidth=rect.width;
			var nextheight=rect.height;
			
			if(jsml.mobile)
			{
				var screenw=screen.availWidth;
				var screenh=screen.availHeight;
				if(screenw==460)screenw=480;
				if(screenh==460)screenh=480;
				if(window.orientation==90||window.orientation==-90)
				{
					var screent=screenw
					screenw=screenh
					screenh=screent
				}
				
				if(nextwidth>screenw)nextwidth=screenw;
				if(nextheight>screenh)nextheight=screenh;
			
				var bodyheight=this.GetContentHeight();
				var currheight=ctrl.get_current_height();
				var missheight=bodyheight-config.skin_container.get_current_height();
				nextheight=currheight+missheight+32;//+screenh/2;
				if(nextheight<screenh)nextheight=screenh;
				nextwidth=screenw;
				
				if(nextwidth<rect.width)nextwidth=rect.width;
				if(nextheight<rect.height)nextheight=rect.height;
			}
			
			pos={top:0,left:0}
			div.style.top=pos.top+'px'
			div.style.left=pos.left+'px'
			div.style.width=nextwidth+"px";
			div.style.height=nextheight+"px";
			
			ctrl.set_width(div.clientWidth);
			ctrl.set_height(nextheight);
			
			if(jsml.mobile)
			{
				var doc=this.GetWindow().document;
				if(doc.body.scrollTop!=0)doc.body.scrollTop=0;
				if(doc.documentElement.scrollTop!=0)doc.documentElement.scrollTop=0;
				
			}
		});
		
		
		this._isfullscreen=!this._isfullscreen;
		if(this._isfullscreen)
		{
			this._origincontainerzindex=div.style.zIndex;
			this._origincontainerwidth=div.style.width;
			this._origincontainerheight=div.style.height;
			this._origincontrolwidth=ctrl.get_width();
			this._origincontrolheight=ctrl.get_height();

			this._originbodyoverflow=db.style.overflow;
			this._originbodyoverflowX=db.style.overflowX;
			this._originbodyoverflowY=db.style.overflowY;
			this._originbodyscrollTop=db.scrollTop;
			this._originbodyscrollLeft=db.scrollLeft;
			
			this._originhtmloverflow=de.style.overflow;
			this._originhtmloverflowX=de.style.overflowX;
			this._originhtmloverflowY=de.style.overflowY;
			this._originhtmlscrollTop=de.scrollTop;
			this._originhtmlscrollLeft=de.scrollLeft;
			
			db.style.overflow="hidden";
			db.style.overflowX="hidden";
			db.style.overflowY="hidden";
			db.scrollTop=0;
			db.scrollLeft=0;
			de.style.overflow="hidden";
			de.style.overflowX="hidden";
			de.style.overflowY="hidden";
			de.scrollTop=0;
			de.scrollLeft=0;

			div.style.position='absolute';
			div.style.zIndex=config.fullscreen_zindex;
			
			config.skin_div_holder=document.createElement("DIV");
			config.skin_div_parent.insertBefore(config.skin_div_holder,div);
			
			this.DetachFrame();
			document.body.insertBefore(div,document.body.firstChild);
			this.AttachFrame();
			
			jsml.dom_attach_event(window,"resize",handleresize);
			this._fullscreenhandleresize=handleresize;
			if(jsml.mobile)
			{
				jsml.dom_attach_event(window,"orientationchange",handleresize);
				this._fullscreeneventid=this.AttachEvent("TextChanged",this._fullscreenhandleresize);
			}
			
			handleresize();
		}
		else
		{
			jsml.dom_detach_event(window,"resize",this._fullscreenhandleresize);
			if(jsml.mobile)
			{
				jsml.dom_detach_event(window,"orientationchange",handleresize);
				this.DetachEvent("TextChanged",this._fullscreeneventid);
			}
			
			this.DetachFrame();
			config.skin_div_parent.insertBefore(div,config.skin_div_holder);
			config.skin_div_parent.removeChild(config.skin_div_holder);
			config.skin_div_holder=div;
			this.AttachFrame();
			
			div.style.position='';
			div.style.top=''
			div.style.left=''
			div.style.width=this._origincontainerwidth;
			div.style.height=this._origincontainerheight;
			div.style.zIndex=this._origincontainerzindex;

			ctrl.set_width(this._origincontrolwidth);
			ctrl.set_height(this._origincontrolheight);
			
			de.style.overflow=this._originhtmloverflow;
			de.style.overflowX=this._originhtmloverflowX;
			de.style.overflowY=this._originhtmloverflowY;
			de.scrollTop=this._originhtmlscrollTop;
			de.scrollLeft=this._originhtmlscrollLeft;
			
			db.style.overflow=this._originbodyoverflow;
			db.style.overflowX=this._originbodyoverflowX;
			db.style.overflowY=this._originbodyoverflowY;
			db.scrollTop=this._originbodyscrollTop;
			db.scrollLeft=this._originbodyscrollLeft;
		}
		
		this._broadcastEvent("FullScreenChanged");
		
	}
	
	this.BuildDialogUrl=function(filename)
	{
		var config=this._config;
		var url=config.folder+"dialogs/"+filename+"?"+(config._debugmode?new Date().getTime():config._urlsuffix);
		return url;
	}
	this.PreloadDialogUrl=function(filename)
	{
		if(!filename)return;
		var url=this.BuildDialogUrl(filename);
		this._LoadXmlUrl(url);
	}
	this._LoadXmlUrl=function(url,handler,processinst,globalvars,translator,loadDelay)
	{
		var responsexml;

		var ParseXmlDoc=this.delegate(function(x)
		{
			//no handler means only cache the url
			if(handler==null)
				return;
				
			//TODO:preload the <include> recursive..
			var loader=this._loader;
			var translate_value=loader.translate_value;
			if(translator)
			{
				translate_value=function(val)
				{
					val=loader.translate_value(val);
					val=translator(val);
					return val;
				}
			}

			try
			{
				jsml.parse_xmldoc(responsexml,processinst,globalvars,null,translate_value)
			}
			catch(x)
			{
				cleanup();
				this.Alert("Unable to parse "+url+" , "+x.message);
				handler(null,"Unable to parse "+url+" , "+x.message);
				return;
			}
			cleanup();
			handler(true);
		});
		
		function cleanup()
		{
			ParseXmlDoc=null;
		}
		
		function startLoad()
		{
			if(!this._xmlurldatamap)this._xmlurldatamap={};
		
			responsexml=this._xmlurldatamap[url];
			
			if(responsexml)
			{
				ParseXmlDoc();
				return;
			}

			this._loader.asyncloadtext(url, this.delegate(function (text, xml) {
				responsexml = xml;
				this._xmlurldatamap[url]=responsexml;
				ParseXmlDoc();
			}));
		}

		setTimeout(this.delegate(startLoad),loadDelay||1);
	}
	
	this._LoadDialog=function(option,callback)
	{
		var dialog;
		if(!option)option={}

		var urlhandler=this.delegate(function(res,err)
		{
			if(!res)
			{
				if(option.callback)option.callback(res,err);
				if(err)setTimeout(function(){throw(err)},1);
				return;
			}
			
			if(callback)
				callback(dialog);
		});
		
		var processinst=this.delegate(function(inst){
			dialog=inst;
	
			dialog._rteconfig=this._config;
			dialog._rteinstance=this;
			dialog._estyle.zIndex=this._config.dialog_zindex;
			if(option.title)
				dialog.set_title(option.title);
			if(option.width&&option.height)
				dialog.resize(option.width,option.height);
			if(option.ondialoginit)
				option.ondialoginit(dialog);
		});
		
		var dialogvars={editor:this}
		
		this._LoadXmlUrl(this.BuildDialogUrl("_dialog.xml"),urlhandler,processinst,dialogvars);
	}
	
	
	this.ShowXmlDialog=function(url,option)
	{
		var dialog;
		
		if(!option)option={}

		var urlhandler=this.delegate(function(res,err)
		{
			if(dialog._jsml_disposed)return;
			
			if(!res)
			{
				setTimeout(function()
				{
					if(option.callback)option.callback(res,err);
				},1);
				dialog.close();
				return;
			}
			
			dialog.attach_event("closing",function()
			{
				if(option.callback)option.callback(dialog.result);
			});
			
			dialog.adjustsize();
			
			if(option.oncontentload)
				option.oncontentload(dialog);
		});
		var processinst=this.delegate(function(inst){
			if(dialog._jsml_disposed)
				return;
			dialog.append_child(inst);
			inst.invoke_recursive("editor_ready",this);
		});
			
		var HandleDialog=this.delegate(function(argdialog)
		{
			dialog=argdialog;
			if(option.ondialogload)
				option.ondialogload(dialog);
			var urlgvars={editor:this,dialog:dialog,option:option};
			var loadDelay=option.loadDelay||0;
			if(loadDelay<50)loadDelay=50;
			this._LoadXmlUrl(url,urlhandler,processinst,urlgvars,option.translator,loadDelay);
		});
		
		this._LoadDialog(option,HandleDialog);
	}
	this.ShowXmlFloatBox=function(url,option)
	{
		var config=this._config;
		var dialog=jsml.class_create_instance(option.floatboxClass||"floatbox");
		var waiting=true;
		var showloading=config.floatbox_showloaingimage&&!option.stopLoadingImage;
		
		if(showloading)
		{
			dialog.set_min_width(90);
			dialog.set_min_height(90);
			dialog._element.innerHTML="<table style='width:90px;height:90px;'><tr>"
				+"<td style='vertical-align:center;text-align:center;'>"
				+"<img src='"+config.folder+"images/"+config.loader_loadingimage+"'/></td></tr></table>";
		}

		if (jsml.msie&&this.GetWindow().document.selection.type=="Control") {
			var coll = this.GetWindow().document.selection.createRange();
			if (coll.length && coll.remove) coll.remove(0);
			coll.select();
		}
		
		var urlhandler=this.delegate(function(res,err)
		{
			if(dialog._jsml_disposed)return;
			if(waiting){waiting=false;dialog._element.innerHTML="";}

			if(!res)
			{
				setTimeout(function()
				{
					if(option.callback)option.callback(res,err);
				},1);
				dialog.close();
				return;
			}
			
			if(!showloading)
			{
				dialog.show(option);
			}
			
			dialog.attach_event("closing",function()
			{
				if(option.callback)option.callback(dialog.result);
			});
			
			if(option.oncontentload)
				option.oncontentload(dialog);
		});
		var processinst=this.delegate(function(inst){
			if(dialog._jsml_disposed)return;
			if(waiting){waiting=false;dialog._element.innerHTML="";}
			dialog.append_child(inst);
			inst.invoke_recursive("editor_ready",this);
		});
		
		setTimeout(this.delegate(function(){
			
			if(option.title)
				dialog.set_title(option.title);
			if(option.width&&option.height)
				dialog.resize(option.width,option.height);
			
			dialog._rteconfig=this._config;
			dialog._rteinstance=this;
			dialog._estyle.zIndex=this._config.dialog_zindex;

			if(showloading)
			{
				dialog.show(option);
			}

			if(option.ondialoginit)
				option.ondialoginit(dialog);
				
			var urlgvars={editor:this,dialog:dialog,option:option};
			this._LoadXmlUrl(url,urlhandler,processinst,urlgvars,option.translator,option.loadDelay);
		}),0);
	
		if(option.ondialogload)
			option.ondialogload(dialog);
			
		return dialog;
	}
	this.ExecShowXmlDialog=function(element,url,option)
	{
		if(!option)option={};
		if(!option.width)option.width=180;
		if(!option.height)option.height=120;
		this.ShowXmlDialog(this.BuildDialogUrl(url),option);
	}
	this.ExecShowXmlFloatbox=function(element,url,option)
	{
		if(!option)option={};
		if(!option.width)option.width=60;
		if(!option.height)option.height=40;
		option.anchor=element;
		this.ShowXmlFloatBox(this.BuildDialogUrl(url),option);
	}
	

	this.Alert=function(option)
	{
		if(typeof(option)=="string")
		{
			option={message:option};
		}
		if(!option.message)throw(new Error("require .message"));
		
		if(jsml.mobile)
			return window.alert(option.message);
			
		if(!option.title)option.title="Alert:";
		if(!option.width)option.width=280;
		if(option.control||option.anchor)
		{
			if(option.hideButtons==null)
				option.hideButtons=true;
			if(!option.height)option.height=90;
			this.ShowXmlFloatBox(this.BuildDialogUrl("basic_alert.xml"),option);
		}
		else
		{
			if(!option.height)option.height=140;
			this.ShowXmlDialog(this.BuildDialogUrl("basic_alert.xml"),option);
		}
	}
	this.Confirm=function(option)
	{
		if(!option.message)throw(new Error("require .message"));
		if(!option.callback)throw(new Error("require .callback"));
		if(!option.title)option.title="confirm:";
		if(!option.width)option.width=320;
		if(option.control||option.anchor)
		{
			if(!option.height)option.height=110;
			this.ShowXmlFloatBox(this.BuildDialogUrl("basic_confirm.xml"),option);
		}
		else
		{
			if(!option.height)option.height=140;
			this.ShowXmlDialog(this.BuildDialogUrl("basic_confirm.xml"),option);
		}
	}
	this.Prompt=function(option)
	{
		if(!option.message)throw(new Error("require .message"));
		if(!option.callback)throw(new Error("require .callback"));
		if(!option.title)option.title="prompt:";
		if(!option.width)option.width=320;
		if(option.control||option.anchor)
		{
			if(!option.height)option.height=140;
			this.ShowXmlFloatBox(this.BuildDialogUrl("basic_prompt.xml"),option);
		}
		else
		{
			if(!option.height)option.height=170;
			this.ShowXmlDialog(this.BuildDialogUrl("basic_prompt.xml"),option);
		}
	}
	
	
	this._invokeUIRequest=function(cmd,element)
	{

		cmd=String(cmd).toLowerCase();
		switch(cmd)
		{
			case "paste":
			case "pastetext":
			case "pastehtml":
			case "pasteword":
				this._lastpastecmd=cmd;
				var option={width:480,height:320}
				option.command=cmd;
				option.puretextmode=(cmd=="pastetext"||cmd=="pastehtml");
				option.callback=this.delegate(this._onpastedialogreturn);
				if(element&&jsml.isvisible(element))
				{
					//if clicked by a visible element : 
					option.anchor=element;
					this.ShowXmlFloatBox(this.BuildDialogUrl("editor_paste.xml"),option);
				}
				else
				{
					this.ShowXmlDialog(this.BuildDialogUrl("editor_paste.xml"),option);
				}
				break;
		}
	}
	
	this._onpastedialogreturn=function(res,err)
	{
		this.Focus();
		if(!res)return;
		res=this.FilterByPasteCommand(res,this._lastpastecmd);
		this.InsertHTML(res);
	}
	
	this.ExecPlugin=function(pluginname,element,arg1,arg2)
	{
		this.LoadPlugin(pluginname,function(plugin,error)
		{
			if(!plugin)return;
			plugin.Execute(element,arg1,arg2);
		});
	}
	this.LoadPlugin=function(pluginname,callback)
	{
		pluginname=String(pluginname).toLowerCase();
		var map=this._plugins;
		if(!map)map=this._plugins={};
		var plugin=map[pluginname];
		if(plugin)
		{
			if(!callback)
				return;
			if(plugin.loaded||plugin.failed)
			{
				setTimeout(function()
				{
					callback(plugin.loaded,plugin.failed);
				},1);
				return;
			}
			plugin._pluginloadcallbacks.push(callback);
			return;
		}
		
		plugin={};
		plugin.Name=pluginname;
		plugin._pluginloadcallbacks=[];
		if(callback)
			plugin._pluginloadcallbacks.push(callback);
		map[pluginname]=plugin;
		function urlhandler(res,err)
		{
			if(res)
				plugin.loaded=plugin;
			if(err)
				plugin.failed=err;
			
			if(plugin.failed)
				map[pluginname]=null;
				
			var arr=plugin._pluginloadcallbacks.concat();
			plugin._pluginloadcallbacks=null;
			for(var i=0;i<arr.length;i++)
				arr[i](plugin.loaded,plugin.failed);
			
		}
		function processinst()
		{
		}
		function translator(val)
		{
			if(val.indexOf('{')==-1)
				return val;
			return val.split("{plugin}").join(pluginname);
		}
		
		var config=this._config;
		var url=config.folder+"plugins/"+pluginname+"/plugin.xml?"+(config._debugmode?new Date().getTime():config._urlsuffix);
		var globalvars={plugin:plugin,editor:this}
		this._LoadXmlUrl(url,urlhandler,processinst,globalvars,translator);
	}
	
	
	this.IsCommandReady=function(cmd)
	{
		var lowercmd=String(cmd).toLowerCase();
		
		if(this._config.readonly)
		{
			switch(lowercmd)
			{
				case "fullscreen":
				case "toggleborder":
				case "toggleborderreverse":
				case "help":
					return true;
				default:
					return false;
			}
		}
		
		switch(lowercmd)
		{
			case "imageeditor":
			case "insertimagemap":
				if(this.GetSelectionType()=="Control")
				{
					if(this.GetPointNode().GetNameLower()=="img")
						return true;
				}
				return false;
			case "insertgallery":	
			case "insertimage":
			case "insertvideo":
			case "insertdocument":
			case "inserttemplate":
				return this.GetSelectionType()!="None";
			default:
				return this.CanExecCommand(cmd);
		}
	}
	this.IsCommandActive=function(cmd,val1,val2,val3)
	{
		var lowercmd=String(cmd).toLowerCase();
		switch(lowercmd)
		{
			case "fullscreen":
				return !!this._isfullscreen;
			default:
				return this.QueryCommand(cmd,val1,val2,val3);
		}
	}
	
	this.ExecUICommand = function (element, cmd, arg0, arg1, arg2) {
		var evt=jsml.find_event();
		if(evt&&evt.ctrlKey&&evt.shiftKey&&evt.altKey)
		{
			this.ShowXmlDialog(this.BuildDialogUrl("_developer.xml"),{width:560,height:420});
			return;
		}
		
		this.Focus();
		
		if(this._broadcastEvent("ExecUICommand",arguments)!==false)
		{
			var lowercmd=String(cmd).toLowerCase();
			switch(lowercmd)
			{
				case "save":
					this.ExecSave(element);
					break;
				case "execplugin":
					this.ExecPlugin(arg0,element,arg1,arg2)
					break;
				case "loadplugin":
					this.LoadPlugin(arg0)
					break;
				case "fullscreen":
					this._toggleFullScreen();
					break;
				case "cleancode":
					this.ExecCleanCode(element);
					break;
				case "imageeditor":
					this.ExecImageEditor(element);
					break;
				case "insertimagemap":
					this.ExecInsertImageMap(element);
					break;
				case "insertgallery":
					this.ExecInsertGallery(element);
					return;
				case "insertimage":
					this.ExecInsertImage(element);
					return;
				case "insertvideo":
					this.ExecInsertVideo(element);
					return;
				case "insertdocument":
					this.ExecInsertDocument(element);
					return;
				case "inserttemplate":
					this.ExecInsertTemplate(element);
					return;
				case "inserttemplate_dropdown":
					this.ExecShowXmlFloatbox(element,"inserttemplate_dropdown.xml");
					break;
				case "showxmldialog":
					this.ExecShowXmlDialog(element,arg0);
					break;
				case "showxmlfloatbox":
					this.ExecShowXmlFloatbox(element,arg0);
					break;
				case "forecolor_dropdown":
					this.ExecColorDropDown(element,"ForeColor");
					break;
				case "backcolor_dropdown":
					this.ExecColorDropDown(element,"BackColor");
					break;
				case "insertdate":
					this.InsertHTML(this._config.command_insertdatetime());
					break;
				case "insertdate_dropdown":
					this.ExecShowXmlFloatbox(element,"insertdate.xml");
					break;
				case "inserttable":
					this.ExecInsertTable(element);
					break;
				case "inserttabletemplate":
					this.ExecInsertTable(element,null,true);
					break;
				case "insertanchor":
					this.ExecInsertAnchor(element);
					break;
				case "insertlink":
					this.ExecInsertLink(element);
					break;
				case "insertlink_dropdown":
					this.ExecShowXmlFloatbox(element,"insertlink_dropdown.xml");
					break;
				case "help":
					this.ExecHelp(element);
					break;
				case "paste":
				case "pastetext":
				case "pastehtml":
				case "pasteword":
					this.ExecPaste(cmd,element);
					break;
				case "find":
					//if (jsml.ie11)
					//	return alert('Not supported for InternetExplorer11.');
					this.ExecFindAndReplace(element);
					return;
				case "insertbox":
				case "insertform":
				case "inserttextarea":
				case "insertinptext":
				case "insertinpfile":
				case "insertinpimage":
				case "insertinpreset":
				case "insertinpsubmit":
				case "insertinphidden":
				case "insertinppassword":
				case "insertradiobox":
				case "insertcheckbox":
				case "insertinpbutton":
				case "insertbutton":
				case "insertdropdown":
				case "insertlistbox":
					var sp=this.SaveLogContent();
					this.ExecCommand(cmd,arg0,arg1,arg2);
					for(var pn=this.GetPointNode();pn;pn=pn.GetParent())
					{
						var match=false;
						switch(pn.GetNameLower())
						{
							case "div":
							case "form":
							case "input":
							case "textarea":
							case "select":
							case "button":
								match=true;
								break;
						}
						if(match)
						{
							this.ShowPropertiesDialog(pn,{savepoint:sp});
							break;
						}
					}
					break;
				case "insertvideo":
					this.ExecInsertControl(this._config.default_code_video);
					break;
				case "insertaudio":
					this.ExecInsertControl(this._config.default_code_audio);
					break;
				case "switchribbon":
					if (this._config.toolbar != "ribbon" || this._config.toolbaritems != null)
					{
						this._config.toolbar = "ribbon";
						this._config.toolbaritems = null;
						this._broadcastEvent("ReloadToolbar");
					}
					break;
				default:
					this.ExecCommand(cmd,arg0,arg1,arg2);
					break;
			}
		}
		
		this.Focus();
		this.NotifyUpdateUI();

	}

	this.ShowDragDropMenu=function(e,ctrl)
	{
		this._lastdroprequest=new Date().getTime();
	
		e.Cancel();
		if(this._config.readonly)
			return;
		
		if(!this._config.enablecontextmenu)
			return;
		
		var pos=jsml.get_scrollposition(this.GetFrame());
		var option={floatboxClass:"floatmenu",x:pos.left+e.clientX+3,y:pos.top+e.clientY+3,stopLoadingImage:true};
		option.dragcontrol=ctrl;
		this.ShowXmlFloatBox(this.BuildDialogUrl("menu_dragdrop.xml"),option);
		return true;
	}
	
	this.HandleContextMenu=function(e)
	{
		if(e.ctrlKey&&e.altKey&&e.shiftKey)
			return;
			
		e.Cancel();
		if(new Date().getTime()-(this._lastdroprequest||0)<100)
		{
			return false;
		}
		
		if(this._config.readonly)
			return false;
		if(!this._config.enablecontextmenu)
			return false;
		var menufile="menu_context_"+(this._config.contextmenumode||"default")+".xml";
		var pos=jsml.get_scrollposition(this.GetFrame());
		var option={floatboxClass:"floatmenu",x:pos.left+e.clientX+3,y:pos.top+e.clientY+3,stopLoadingImage:true};
		this.ShowXmlFloatBox(this.BuildDialogUrl(menufile),option);
		return false;
	}
	
	this.HandleDoubleClick=function(e)
	{
		var node=this.GetNodeFromDom(e.srcElement);
		if(node&&node.IsControl())
		{
			e.Cancel();
			this.ShowPropertiesDialog(node);
		}
	}
	
	this.CreateControlProvider=function(node)
	{
		var provider={Editor:this,Control:node}
		
		provider.GetTitle=function()
		{
			var nl=node.GetNameLower();
			if(nl=="div"&&node.GetStyle("position")=="absolute")
				return provider.Editor.GetLangText("Layer");
			if(nl=="a")
			{
				if(node.GetChildCount()==0)
					return provider.Editor.GetLangText("Anchor");
				return provider.Editor.GetLangText("Link");
			}
			return nl.substring(0,1).toUpperCase()+nl.substring(1);
		}
		provider.ShowPropertiesDialog=function(option)
		{
			provider.Editor.ShowPropertiesDialogDefault(node,option);
		}
		provider.FillDesignView=function(element)
		{
			element.innerHTML="Default preview for : "+provider.GetTitle();
		}
		
		this.InitInternalProvider(provider,node);
		
		this._broadcastEvent("CreateControlProvider",[provider]);
		
		return provider;
	}
	
	this.InitInternalProvider=function(provider,node)
	{
		var nl=node.GetNameLower();
		if(nl=="iframe")
		{
			if(node.InsertType=="Video")
				return this.InitVideoProvider(provider,node);
			var src=node.GetAttribute("src");
			if(src&&src.indexOf("file="))
			{
				if(src.indexOf("type=video")!=-1)
					return this.InitVideoProvider(provider,node);
			}
		}
	}
	
	function ExtractMovieUrl(src)
	{
		if(!src)return "";
		var pairs=(src.split('#')[0].split('?')[1]||"").split('&');
		for(var i=0;i<pairs.length;i++)
		{
			var pair=pairs[i].split('=');
			if(pair.length!=2)continue;
			if(pair[0]=="file")
				return decodeURIComponent(pair[1]);
		}
		return "";
	}
	
	this.InitVideoProvider=function(provider,node)
	{
		provider.GetTitle=function()
		{
			return "Video";
		}
		provider.ShowPropertiesDialog=function(option)
		{
			provider.Editor.ExecInsertVideo(null,node);
		}
		provider.FillDesignView=function(element)
		{
			var file="media";
			var type="Video";
			var src=ExtractMovieUrl(node.GetAttribute("src"));
			if(src&&(src.indexOf(".flv")>-1||src.indexOf(".swf")>-1))
			{
				file="flash"
				type="Flash"
			}
			element.innerHTML="<img src='"+provider.Editor._config.folder+"images/"+file+".png' width=20 height=20/><br/>"+type+" "+src;
		}
	}
	
	this.ShowPropertiesDialog=function(element,option)
	{
		if(option&&option.styletab)
		{
			this.ShowPropertiesDialogDefault(element,option);
		}
		else
		{
			var provider=this.CreateControlProvider(element);
			provider.ShowPropertiesDialog(option);
		}
	}
	this.ShowPropertiesDialogDefault=function(element,option)
	{
		if(! (option&&option.styletab) )
		{
			var namelower=element.GetNameLower();
			
			if(namelower=="img")
			{
				this.ExecInsertImage(null,element);
				return;
			}
			
			if(namelower=="a")
			{
				if(element.GetChildCount()==0)
					this.ExecInsertAnchor(null,element);
				else
					this.ExecInsertLink(null,element);
				return;
			}
			if(name=="area")
			{
				this.ExecInsertLink(null,element);
				return;
			}
		}

		var sp=option&&option.savepoint;
		if(typeof(sp)=="undefined")
			sp=this.SaveLogContent();
	
		if(!option)option={};
		if(!option.width)option.width=550;
		if(!option.height)option.height=420;
		option.targetnode=element;
		this.ShowTagDialog(this.BuildDialogUrl("properties.xml"),option,sp,this.delegate(function()
		{
			this.SaveLogIndex(sp+1)
			this.Focus();
		}));
	}
	
	this.ShowTagDialog=function(url,option,sp,ontrue,onfalse)
	{
		if(!option)option={}
		
		this._broadcastEvent("TagDialogBegin",[url,option]);
		
		var oldcallback=option.callback;
		option.callback=this.delegate(function(res,err)
		{
			if(!res)
			{
				if(typeof(sp)=="number")
					this.LoadLogIndex(sp);
				this.Focus();
				if(err)this.Alert(err.message||err);
				if(onfalse)onfalse(res,err)
				if(oldcallback)oldcallback(res,err)
			}
			else
			{
				if(ontrue)ontrue(res,err)
				if(oldcallback)oldcallback(res,err)
			}
			this._broadcastEvent("TagDialogEnd",[url,option,res,err]);
		});
		this.ShowXmlDialog(url,option);
	}
	
		
	this.ExecInsertControl=function(code)
	{
		var sp=this.SaveLogContent();
		var node=this.ParseHtmlCode(code)[0];
		this.InsertNode(node);
		this.Focus();
		this.SelectControl(node);
		this.ShowPropertiesDialog(node,{savepoint:sp});
	}


	this.ExecInsertAnchor=function(anchor,tag)
	{
		var sp=this.SaveLogContent();
		
		if(!tag)
		{
			tag=new $rte.LinkElement("a");
			//tag.SetAttribute("href","http://")
			
			var list=this.SurroundNodes(tag);
			if(!list&&list.length==0)
				return;
			if(list.length>1)
				return this.LoadLogIndex(sp);

			var p=tag;
			while(true)
			{
				var p=p.GetParent();
				if(!p)break;
				if(p.GetNameLower()=="a")
				{
					tag=p;
					tag.SetInnerText("");
				}
			}
		}
		
		this.SelectControl(tag);
		
		var option={width:320,height:220,targetnode:tag,anchor:anchor};
		this.ShowTagDialog(this.BuildDialogUrl("insertanchor.xml"),option,sp,this.delegate(function()
		{
			this.SaveLogIndex(sp+1)
			this.Focus();
			this.SelectControl(tag);
		}));
	}

	this.RemoveInnerLink=function(node,links)
	{
		var index=0;
		while(true)
		{
			var child=node.GetChildAt(index);
			if(!child)
				return;
			if(child.GetChildAt)
				this.RemoveInnerLink(child,links);
			if(child.GetNameLower()!="a")
			{
				index++;
				continue;
			}
			if(links)links.push(child);
			child.RemoveNode(false);
		}
	};
	
	this.ExecInsertLink=function(anchor,tag)
	{
		var sp=this.SaveLogContent();
		
		var list;
		if(tag)
		{
			list=[tag];
		}
		else
		{
			tag=new $rte.LinkElement("a");			
			var list=this.SurroundNodes(tag);
			if(!list&&list.length==0)
				return;

			var hrefs=[];
			for(var i=0;i<list.length;i++)
			{
				var links=[];
				links.push(list[i]);
				this.RemoveInnerLink(list[i],links);
				for(var li=0;li<links.length;li++)
				{
					var href=links[li].GetAttribute("href");
					if(href)hrefs.push(href);
				}
			}

			if(hrefs.length>1)
				return this.LoadLogIndex(sp);
					
			if(list.length>1)
			{
				for(var i=1;i<list.length;)
				{
					var curr=list[i];
					var prev=list[i-1];
					if(curr.__parent!=prev.__parent||prev.__parent.__indexOf(prev)!=curr.__parent.__indexOf(curr)-1)
					{
						//return this.LoadLogIndex(sp);
						i++;
						continue;
					}
					prev.AppendChild(curr);
					curr.RemoveNode(false);
					list.splice(i,1);
				}
			}

			if(hrefs.length)
				tag.SetAttribute("href",hrefs[0]);
			//tag.SetAttribute("href","http://")
			
			var p=tag;
			while(true)
			{
				var p=p.GetParent();
				if(!p)break;
				if(p.GetNameLower()=="a")
				{
					tag.RemoveNode(false);
					tag=p;
				}
			}
			if(tag.GetChildAt(0)==null)
			{
				var tn=new $rte.TextNode();
				tn.SetText(this._config.default_link_text||"new_link");
				tag.AppendChild(tn);
			}
			
		}
		
		tag.SetRuntimeAttribute("style","text-decoration:underline","insertlink");
		
		var option={width:550,height:420,targetnode:tag,anchor:anchor};
		this.ShowTagDialog(this.BuildDialogUrl("properties.xml"),option,sp,this.delegate(function()
		{
			tag.SetRuntimeAttribute("style",null,"insertlink");
			
			for(var i=1;i<list.length;i++)
			{
				list[i]._mergeNode(tag);
			}
			
			this.SaveLogIndex(sp+1)
			this.Focus();
			this.SelectContent(tag);
			if(jsml.msie10)
			{
				tag.SetRuntimeAttribute("style","text-decoration:underline","fixiebug");
				tag.SetRuntimeAttribute("style",null,"fixiebug");
			}
		}));
	}
	
	
	this.ExecInsertTable=function(anchor,tag,usetemplate)
	{
		var sp=this.SaveLogContent();
		
		var list;
		if(!tag)
		{
			var snode=this.GetPointNode();
			if(snode&&snode.GetNameLower()=="table")
				tag=snode;
		}
		
		if(!tag)
		{
			var columns=this._config.default_table_cols||5;
			var rows=this._config.default_table_rows||3;
			
			var table=this.ParseHtmlCode(this._config.default_code_table)[0];
			var tbody=table.GetChildAt(0);
			for(var y=0;y<rows;y++)
			{
				var row=this.ParseHtmlCode(this._config.default_code_tr)[0];
				(tbody||table).AppendChild(row);
				for(var x=0;x<columns;x++)
				{
					var td=this.ParseHtmlCode(this._config.default_code_td)[0];
					row.AppendChild(td);
				}
			}
			
			tag=table;
			
			if(!this.InsertNode(tag))
				return;
		}

		this.SelectControl(tag);
		
		var option={width:550,height:420,targetnode:tag,anchor:anchor};

		this.ShowTagDialog(this.BuildDialogUrl(usetemplate?"inserttabletemplate.xml":"properties.xml"),option,sp,this.delegate(function()
		{
			this.SaveLogIndex(sp+1)
			this.Focus();
			this.SelectControl(tag);

			if(jsml.msie5678)
			{
				this.InsertHTML(tag.GetHtmlCode());
			}
			
		}));
	}
	
	this.ExecInsertTemplate=function(anchor)
	{
		var sp=this.SaveLogContent(true);
		
		var option={width:640,height:420,anchor:anchor};

		this.ShowXmlDialog(this.BuildDialogUrl("inserttemplate.xml?"+Math.random()),option);
	}
	
	this.ExecInsertDocument=function(anchor,tag)
	{
		var sp=this.SaveLogContent(true);
		
		var oktext=null;
					
		var list;
		if(!tag)
		{
			oktext=this.GetLangText("INSERT");
			
			tag=new $rte.LinkElement("a");
//			tag.SetAttribute("href","http://")
			var list=this.SurroundNodes(tag);
			if(!list&&list.length==0)
				return;
			var p=tag;
			while(true)
			{
				var p=p.GetParent();
				if(!p)break;
				if(p.GetNameLower()=="a")
					tag=p;
			}
			if(tag.GetChildAt(0)==null)
			{
				var tn=new $rte.TextNode();
				tn.SetText(this._config.default_link_text||"new_link");
				tag.AppendChild(tn);
			}
		}
		else
		{
			list=[tag];
		}
		this.SelectControl(tag);
		
		var option={width:650,height:420,targetnode:tag,anchor:anchor,oktext:oktext};
		
		this.ShowTagDialog(this.BuildDialogUrl("insertdocument.xml"),option,sp,this.delegate(function()
		{
			for(var i=0;i<list.length;i++)
				this.RemoveInnerLink(list[i]);
			this.SaveLogIndex(sp+1)
			this.Focus();
			this.SelectContent(tag);
		}));
	}

	this.ExecInsertVideo=function(anchor,img)
	{
		var sp=this.SaveLogContent();

		if(!img&&this.GetSelectionType()=="Control")
		{
			var node=this.GetPointNode();
			if(node.GetNameLower()=="iframe")
			{
				img=node;
			}
		}
		var oktext=null;
		if(img==null)
		{
			oktext=this.GetLangText("INSERT");
			
			img=new $rte.ObjectElement("iframe");
			img.InsertType="Video";
			img.SetStyle("width","480px");
			img.SetStyle("height","320px");
			img.SetStyle("border-width","0px");
			img.SetAttribute("src",this.GetPlayerUrl()+"?type=video&file=&autoplay=1&autoloop=1&allowmenu=1&transparency=1&showcontrols=1&allowfullscreen=1");

			if( ! this.InsertNode(img) )
			{
				this.LoadLogIndex(sp);
				return;
			}
		}
		
		var option={width:640,height:450,targetnode:img,anchor:anchor};

		this.ShowTagDialog(this.BuildDialogUrl("insertvideo.xml"),option,sp,this.delegate(function()
		{
			this.SaveLogIndex(sp+1)
			this.Focus();
			this.SelectControl(img);
		}));
	}
	this.ExecInsertImage=function(anchor,img)
	{
		var sp=this.SaveLogContent();
		
		if(!img&&this.GetSelectionType()=="Control")
		{
			var node=this.GetPointNode();
			if(node.GetNameLower()=="img")
			{
				img=node;
			}
		}
		var oktext=null;
		if(img==null)
		{
			oktext=this.GetLangText("INSERT");
			
			img=new $rte.GenericElement("img");
			img.SetAttribute("alt","");

			if( ! this.InsertNode(img) )
			{
				this.LoadLogIndex(sp);
				return;
			}
			
			img.GetViewNode().setAttribute("src",this._config.folder+"images/imageholder.gif");

		}
		
		var option={width:640,height:450,targetnode:img,anchor:anchor,oktext:oktext};
		
		this.ShowTagDialog(this.BuildDialogUrl("insertimage.xml"),option,sp,this.delegate(function()
		{
			this.SaveLogIndex(sp+1)
			this.Focus();
			this.SelectControl(img);
		}));
	}
	this.ExecInsertGallery=function(anchor)
	{
		var img=new $rte.GenericElement("img");
		
		var option={width:640,height:400,targetnode:img,anchor:anchor};
		option.callback=this.delegate(function(res,err)
		{
			if(!res)
			{
				this.Focus();
				return;
			}
			this.Focus();
			this.InsertNode(img);
			this.SelectControl(img);
		})
		this.ShowXmlDialog(this.BuildDialogUrl("insertgallery.xml"),option);
	}
	
	this.ExecImageEditor=function(anchor,img)
	{
		if(!img&&this.GetSelectionType()=="Control")
		{
			var node=this.GetPointNode();
			if(node.GetNameLower()=="img")
			{
				img=node;
			}
		}
		
		if(img==null)
			return;
		var editor=this;
	
		
		editor.FindStorage(["Gallery","Image"],img.GetAttribute("src"),function(storage,fileitem)
		{
			if(!storage)return;
			editor.ShowImageEditor(img,storage,fileitem);
		});
	}
	
	this.ExecInsertImageMap=function(anchor,img)
	{
		if(!img&&this.GetSelectionType()=="Control")
		{
			var node=this.GetPointNode();
			if(node.GetNameLower()=="img")
			{
				img=node;
			}
		}
		
		if(img==null)
			return;
		
		var sp=this.SaveLogContent();
		
		var map=null;
		var usemap=img.GetAttribute("usemap");
		if(usemap)
		{
			if(usemap.charAt(0)=="#")
			{
				usemap=usemap.substring(1);
				map=this.FindNodeByName(usemap);
			}
			else
			{
				usemap=null;
			}
		}

		var oktext=null;
		
		if(map==null)
		{
			oktext=this.GetLangText("INSERT");
			
			map=new $rte.ContainerElement("map");
			if(!usemap)
			{
				for(var i=1;true;i++)
				{
					usemap="automap"+i;
					if(!this.FindNodeByName(usemap))
						break;
				}
			}
			
			img.SetAttribute("usemap","#"+usemap);
			
			map.SetAttribute("name",usemap);
			map.SetAttribute("id",usemap);
			
			this.GetBodyNode().InsertAt(map,0);
		}
		
		this.SelectControl(img);
		
		var option={width:540,height:360,targetnode:map,targetimg:img,anchor:anchor,oktext:oktext};
		option.callback=this.delegate(function(res,err)
		{
			if(!res)
			{
				this.LoadLogIndex(sp);
				this.Focus();
				if(err)this.Alert(err.message||err);
				return;
			}
			this.SaveLogIndex(sp+1)
			this.Focus();
			this.SelectControl(img);
		});
		this.ShowXmlDialog(this.BuildDialogUrl("insertimagemap.xml"),option);
	}

	this.ExecFindAndReplace=function(anchor)
	{
		var option={width:380,height:150};
		this.ShowXmlDialog(this.BuildDialogUrl("findandreplace.xml"),option);
	}
	
	this.ExecColorDropDown=function(anchor,cmd)
	{
		var option={command:cmd,preview:true}
		option.setcolor=this.delegate(function(val)
		{
			this.ExecCommand(cmd,val);
		});
		this.ExecShowXmlFloatbox(anchor,"colorpicker.xml",option);
	}
	
	this.ExecCleanCode=function(anchor)
	{
		var option={width:560,height:330}
		option.anchor=anchor
		this.ShowXmlDialog(this.BuildDialogUrl("cleancode.xml"),option);
	}
	
	this.ExecSave=function(anchor)
	{
		var mode=this._config.savebuttonmode
		
		if(!mode)return;
		mode=mode.toLowerCase();

		var sres=true;
		var scode=this._config.savebuttonscript;
		if(scode)
		{
			var func=new Function("editor",scode);
			sres=func.apply(this,[]);
			if(sres===false)
				return;
		}
		
		if(mode=="submit")
		{
			if(this._config.savebuttonsubmit)
			{
				var func=new Function("",this._config.savebuttonsubmit);
				func();
			}
			else
			{
				var inp=document.getElementsByName(this._config.uniqueid)[0];
				if(!inp)
					return;
				var form=inp.parentNode;
				for(;form!=null;form=form.parentNode)
				{
					if(form.nodeName=="FORM")
						break;
				}
				if(!form)
					return;
				form.submit();
			}
		}
	}
	
	this.ExecHelp=function(anchor)
	{
		var option={width:793,height:480}
		option.title=this.GetLangText("help");
		var helpurl=this._config.editor_help_url;
		if(!helpurl)helpurl=this._config.folder+"help/home.htm";
		option.htmlcode="<iframe style='width:793px;height:480px;' frameborder=0 src='"+jsml.html_encode(helpurl)+"'></iframe>";
		this.ShowXmlDialog(this.BuildDialogUrl("htmlpreview.xml"),option);
	}
	
	this._FindStorageArray=function(arr,url,callback)
	{
		var index=-1;
		var editor=this;
		function FindNext()
		{
			index++;
			var category=arr[index];
			if(!category)
			{
				callback(null,null);
				return;
			}
			editor.FindStorage(category,url,function(storage,fileitem)
			{
				if(storage&&fileitem)
				{
					callback(storage,fileitem);
					return;
				}
				FindNext();
			});
		}
		FindNext();
	}
	this.FindStorage=function(category,url,callback)
	{
		if(!category)return;
		if(!category.length)return;
		if(!url)return;
		if(!callback)return;
		
		if(typeof(category)!="string"&&category.concat)
		{
			this._FindStorageArray(category,url,callback);
			return;
		}
		
		if(url.charAt(0)!="/")
		{
			if(url.indexOf("://")==-1)
				return;
			
			if(url.indexOf('://')==-1)
				return;
			var urlbase=this.GetUrlBase();
			if(url.charAt(urlbase.length)!='/')
				return;
			if(url.substring(0,urlbase.length)!=urlbase)
				return;
			url=url.substring(urlbase.length);
		}

		var editor=this;
		var storages;
		var storage;
		var folderpath;
		var filename;
		
		function onstorages(res)
		{
			if(res.Error)return;
			storages=res.ReturnValue;
			
			for(var i=0;i<storages.length;i++)
			{
				var store=storages[i];
				var prefix=store.UrlPrefix;
				if(!prefix)continue;
				prefix+="/";
				if(url.substring(0,prefix.length)!=prefix)
					continue;
				folderpath=url.substring(prefix.length-1);
				var pos=folderpath.lastIndexOf("/");
				if(pos==-1)
					continue;
				filename=folderpath.substring(pos+1);
				folderpath=folderpath.substring(0,pos+1);
				storage=store;
				break;
			}
			if(!storage)
			{
				callback(null,null);
				return;
			}
			
			storage.UrlPath=folderpath;
			editor.CallAjax("AjaxFindPathItem",onfindpathitem,storage,filename);
		}
		
		function onfindpathitem(res)
		{
			if(res.Error)return;
			var fileitem=res.ReturnValue;
			if(!fileitem||fileitem.IsFolder)return;
			callback(storage,fileitem);
		}
		
		editor.AsyncGetStoragesWithCache(category,onstorages);
	}
	this.AsyncGetStoragesWithCache=function(category,callback)
	{
		var editor=this;
	
		var key="_storagescache"+category;
		var res=editor[key];
		if(res)
		{
			if(!callback)return;
			setTimeout(function()
			{
				callback(res);
			},1);
			return;
		}
		
		function onstorages(res)
		{
			editor[key]=res;
			if(callback)callback(res);
		}
		editor.CallAjax("AjaxGetStorages",onstorages,category);
	}
	
	this.ShowImageEditor=function(imgnode,storage,fileitem)
	{
		var editor=this;
		var newoption={storage:storage,fileitem:fileitem}
		var rect=jsml.get_body_rect();
		newoption.width=Math.min(900,rect.width-100);
		newoption.height=Math.min(600,rect.height-100);
		newoption.callback=function(res,err)
		{
			if(!res)return;
		}
		newoption.onsaveimage=function(pathitem)
		{
			imgnode.ResyncAttributeToView("src");
		}
		editor.ShowXmlDialog(editor.BuildDialogUrl("imageeditor.xml"),newoption);
	}
	
	this.LoadAnchors=function(callback)
	{
		if(!callback)return;
		
		var group={text:"anchors",groups:[],links:[]};
		
		function ScanAnchors(node)
		{
			if(node.GetNameLower()=="a")
			{
				var name=node.GetAttribute("name");
				if(name)
				{
					var link={text:"#"+name,href:"#"+name}
					group.links.push(link);
				}
			}
			if(!node.GetChildCount)return;
			var c=node.GetChildCount();
			if(!c)return;
			for(var i=0;i<c;i++)
			{
				ScanAnchors(node.GetChildAt(i))
			}
		}
		
		ScanAnchors(this.GetBodyNode());
		
		setTimeout(function()
		{
			callback(group);
		});
	}
	
	this.LoadLinks=function(callback)
	{
		var config=this._config;
		
		var group=this._linkrootgroup;
		if(group)
		{
			if(callback)
				setTimeout(function(){callback(group);},1);
			return;
		}
		
		group={text:"links",groups:config.linkgrouparray||[],links:config.linkitemarray||[]};
		
		var links=config.linkurlarray||[];
		if(!config.disablestaticlinks)
		{
			links.push(config.folder+"config/staticlinks.xml?"+(config._debugmode?new Date().getTime():config._urlsuffix));
		}
		var index=-1;
		
		function mergenodes(group,parent)
		{
			var cns=parent.childNodes;
			for(var ci=0;ci<cns.length;ci++)
			{
				var cn=cns.item(ci);
				if(cn.nodeName=="link")
				{
					var text=cn.getAttribute("text")||"";
					var href=cn.getAttribute("href")||"";
					group.links.push({text:text,href:href});
					continue;
				}
				if(cn.nodeName!="group")
					continue;

				var subgroup=null;
				var text=cn.getAttribute("text")||"";
				var ggs=group.groups;
				for(var gi=0;gi<ggs.length;gi++)
				{
					if(ggs[gi].text==text)
					{
						subgroup=ggs[gi];
						break;
					}
				}
				if(!subgroup)
				{
					subgroup={text:text,groups:[],links:[]};
					ggs.push(subgroup);
				}
				mergenodes(subgroup,cn);
			}
		}
		
		var nexturl=this.delegate(function()
		{
			index++;
			var url=links[index];
			if(!url)
			{
				this._linkrootgroup=group;
				if(callback)
					callback(group);
				return;
			}
			
			xh=jsml.xmlhttp();
			xh.onreadystatechange=this.delegate(function()
			{
				if(xh.readyState<4)return;
				xh.onreadystatechange=jsml.empty_function;
				
				setTimeout(nexturl,1);
				
				if(xh.status==0)
					return;
				if(xh.status!=200)
					return;
				if(xh.responseXML==null||xh.responseXML.documentElement==null)
					return;
				
				mergenodes(group,xh.responseXML.documentElement);
			});
			xh.open("GET",url,true);
			xh.send("");
		});
		
		setTimeout(nexturl,1);
	}
	
	
	this.LoadTemplates=function(callback)
	{
		var config=this._config;
		
		var group=this._templaterootgroup;
		if(group)
		{
			if(callback)
				setTimeout(function(){callback(group);},1);
			return;
		}
		
		group={text:"templates",groups:config.templategrouparray||[],templates:config.templateitemarray||[]};
	
		var templates=config.templateurlarray||[];
		if(!config.disablestatictemplates)
		{
			templates.push(config.folder+"config/statictemplates.xml?"+(config._debugmode?new Date().getTime():config._urlsuffix));
		}
		var index=-1;
		
		function mergenodes(group,parent)
		{
			var cns=parent.childNodes;
			for(var ci=0;ci<cns.length;ci++)
			{
				var cn=cns.item(ci);
				if(cn.nodeName=="template")
				{
					var text=cn.getAttribute("text")||"";
					var href=cn.getAttribute("href")||"";
					group.templates.push({text:text,href:href,code:jsml.get_node_innertext(cn)});
					continue;
				}
				if(cn.nodeName!="group")
					continue;

				var subgroup=null;
				var text=cn.getAttribute("text")||"";
				var ggs=group.groups;
				for(var gi=0;gi<ggs.length;gi++)
				{
					if(ggs[gi].text==text)
					{
						subgroup=ggs[gi];
						break;
					}
				}
				if(!subgroup)
				{
					subgroup={text:text,groups:[],templates:[]};
					ggs.push(subgroup);
				}
				mergenodes(subgroup,cn);
			}
		}
		
		var loadtempfiles=this.delegate(function()
		{
			this._templaterootgroup=group;
			if(callback)
				callback(group);
		});
		
		var nexturl=this.delegate(function()
		{
			index++;
			var url=templates[index];
			if(!url)
			{
				loadtempfiles();
				return;
			}
			
			xh=jsml.xmlhttp();
			xh.onreadystatechange=this.delegate(function()
			{
				if(xh.readyState<4)return;
				xh.onreadystatechange=jsml.empty_function;
				
				setTimeout(nexturl,1);
				
				if(xh.status==0)
					return;
				if(xh.status!=200)
					return;
				if(xh.responseXML==null||xh.responseXML.documentElement==null)
					return;
				
				mergenodes(group,xh.responseXML.documentElement);
			});
			xh.open("GET",url,true);
			xh.send("");
		});
		
		setTimeout(nexturl,1);
	}
	
	this.FindNodeByName=function(name,node)
	{
		if(!node)node=this.GetBodyNode();
		if(node.nodeType!=1)
			return;
		if(node.GetAttribute("name")==name)
			return node;
		
		if(!node.GetChildCount)return;
		var c=node.GetChildCount();
		if(!c)return;
		for(var i=0;i<c;i++)
		{
			var subnode=node.GetChildAt(i)
			if(!subnode)
				continue;
			subnode=this.FindNodeByName(name,subnode);
			if(subnode)
				return subnode;
		}
	}


});





