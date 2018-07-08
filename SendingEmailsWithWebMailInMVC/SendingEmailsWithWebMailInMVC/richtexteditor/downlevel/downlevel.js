window.RTEDownlevelInit=function(config)
{
	var ua=navigator.userAgent;
	
	if(!config.ubbmode&&ua.match(/MSIE [5678]/i))
		return;
	if (ua.match(/MSIE/i) && ua.match(/Mac/i))
		return;
	if(ua.match(/Firefox\/1\.[0-4]/i))
		return;
	if(ua.match(/Safari\/41/i))
		return;
	
	var _debugmode=false;
	if(location.href.indexOf("://127.0.0.1")!=-1||location.href.indexOf("rtenocache")!=-1)
		_debugmode=true;

	var d=new Date();
	var urlsuffix="20140529"	//String(d.getFullYear()*10000+(1+d.getMonth())*100+d.getDate());

	if(_debugmode)
		urlsuffix=d.getTime();
	
	var _showLangWarning=false;
	
	function createxh()
	{
		return window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");;
	}
	
	var scriptmap={};
	function asyncloadscript(url,callback,runcode)
	{
		var item=scriptmap[url];
		if(item)
		{
			if(item.loading!='loading')
			{
				setTimeout(function()
				{
					callback(item.loading);
				},0);
			}
			else
			{
				item.callbacks.push(callback);
			}
			return;
		}
		
		item={url:url,loading:'loading',callbacks:[callback]};
		scriptmap[url]=item;
		
		var index=0;
		function runcallbacks()
		{
			var func=item.callbacks[index];
			index++;
			if(index<item.callbacks.length)setTimeout(runcallbacks,0);
			func(item.loading);
		}
		
		var xh=createxh();
		xh.open("GET",url,true);
		xh.onreadystatechange=function()
		{
			if(xh.readyState!=4)return;
			xh.onreadystatechange=new Function("","");
			setTimeout(runcallbacks,0);
			if(xh.status!=200)
			{
				item.succeed=false;
				item.loading='httperror:'+xh.status;
				//alert(item.loading)
				throw(new Error("failed to load "+url+" , \r\n http"+xh.status));
			}

			try
			{
				var code=xh.responseText;
				if(!runcode)
					runcode=new Function("","eval(arguments[0])");
				runcode(code);
				item.loading=null;
			}
			catch(x)
			{
				item.loading='scripterror:'+x.message;
				alert(x.message);
				throw(new Error("failed to load "+url+" , \r\n"+x.message));
			}

		}
		xh.send("");
	}
	
	
	var loader={};
	loader._config=config;
	
	config._debugmode=_debugmode;
		
	var folder=config.folder;
	if(folder.indexOf("://")==-1&&folder.charAt(0)!="/")
	{
		var url=window.location.href.split('#')[0].split('?')[0].split('/');
		url[url.length-1]=folder;
		url.splice(0,3);
		config.folder=folder="/"+url.join('/');
	}
	
	config.initdate=new Date();
	config._urlsuffix=urlsuffix;
	
	
	var langs=[];
	
	function runlangcode(lang,code)
	{
		var func=new Function("lang,__code","eval(__code)");
		if(!lang._data)lang._data={};
		func(lang._data,code);
	}
	function asyncloadlangindex(index)
	{
		var lang=langs[index];
		if(!lang)return;
		if(lang.loading)return;
		lang.loading=true;
		function runcode(code)
		{
			runlangcode(lang,code);
		}
		function nextstep(err)
		{
			lang.loading=false;
			lang.loaded=true;
			if(index>0)asyncloadlangindex(index+1);
		}
		if(!lang.loaded)
		{
			asyncloadscript(lang.langurl,nextstep,runcode)
		}
		else
		{
			nextstep();
		}
	}
	function syncloadlang(lang)
	{
		var xh=createxh();
		xh.open("GET",lang.langurl,false);
		xh.send("");
		if(xh.status!=200)return;
		runlangcode(lang,xh.responseText);
	}
	
	loader.getLangText=function(name)
	{
		var showWarning=_showLangWarning;
		if(!name)return "{empty}";

		name=name.toLowerCase().replace(/(^\s+|\s+$)/g,"");
		for(var i=0;i<langs.length;i++)
		{
			var lang=langs[i];
			var dict=lang._data;
			if(!dict)
			{
				if(showWarning)
				{
					showWarning=false;
					setTimeout(function()
					{
						throw(new Error("Warning,sync load "+lang.langurl+" for text {"+name+"}"));
					},1);
				}
				syncloadlang(lang);
				dict=lang._data;
			}
			if(!dict)continue;
			var text=dict[name];
			if(!text)continue;
			if(text.indexOf("{")!=-1&&text.indexOf("}")!=-1)
			{
				for(var i=1;i<arguments.length;i++)
				{
					text=text.split("{"+(i-1)+"}").join(arguments[i]);
				}
			}
			return text;
		}
		
		if(config._debugmode)
			return "{"+name+"}";
		return name;
	}

	
	function translate_lang(val)
	{
		if(val.indexOf("|")==-1)
			return loader.getLangText(val.substring(1));
		var pairs=val.split("|");
		for(var i=0;i<pairs.length;i++)
		{
			val=pairs[i];
			if(val.charAt(0)=="@")
			{
				if(val.length==1)
					pairs[i]="";
				else
					pairs[i]=loader.getLangText(val.substring(1));
			}
		}
		return pairs.join("");
	}
	
	loader.translateText=function(text)
	{
		if(!text)return "";
		if(text.charAt(0)=="@")
			return translate_lang(text);
		return text;
	}
	
	
	function _loadmain()
	{
		if(loader._loadcalled)return;
		loader._loadcalled=true;

		var ctrls=document.getElementsByName(config.uniqueid);
		for(var i=0;i<ctrls.length;i++)
		{
			var ctrl=ctrls[i];
			if(ctrl.nodeName=="INPUT"||ctrl.nodeName=="TEXTAREA")
				loader.textarea=ctrl;
		}
		if(!loader.textarea)
		{
			//error no textarea
			return;
		}
		
		loader.textareainitvalue=loader.textarea.value;
		
		function nextstep(err)
		{
			if(err)
			{
				alert("Unable to load config.js \r\n"+err);
			}
			else
			{
				_configready()
			}
		};
		if(config.baseconfig||window.RTE_Configuration)
			_configready();
		else
			asyncloadscript(config.folder+"scripts/config.js?"+config._urlsuffix,nextstep)
	}
	function _configready()
	{
		var baseconfig=config.baseconfig||window.RTE_Configuration;
		
		if(baseconfig)
		{
			for(var p in baseconfig)
			{
				if(!config.hasOwnProperty(p))
					config[p]=baseconfig[p];
			}
		}
		
		var csscontainer=document.getElementsByTagName("head")[0]||document.body;
		
		if(!window.richtexteditorcss)
		{
			var link=document.createElement("LINK");
			link.setAttribute("rel","stylesheet");
			link.setAttribute("href",config.folder+"downlevel/style.css?"+config._urlsuffix);
			csscontainer.insertBefore(link,csscontainer.firstChild);
			window.richtexteditorcss=link;
		}

		config.skin_div=document.getElementById(config.containerid);
		config.skin_divborder=config.skin_div.style.border;
		config.skin_div.style.border="solid 1px #eeeeee";
		
		config.skin_div.innerHTML="<table style='width:100%;height:100%;'><tr>"
			+"<td style='vertical-align:center;text-align:center;'>"
			+"<img src='"+config.folder+"images/"+config.loader_loadingimage+"'/></td></tr></table>";


		if(config.langfiles)
		{
			var langarr=config.langfiles.split(',');
			for(var i=0;i<langarr.length;i++)
			{
				langs.push({langfile:langarr[i],langurl:config.folder+"lang/"+langarr[i]+".js?"+config._urlsuffix});
			}
			asyncloadlangindex(0);
		}


		setTimeout(function()
		{
			_loadjsml();
		},config.loader_loadcodedelay||1);

	
	}
	function _loadjsml()
	{
		function nextstep()
		{
			_loadcommonxml();
		};
		if(window.jsml)
			nextstep();
		else
			asyncloadscript(config.folder+"core/jsml.js?"+config._urlsuffix,nextstep)
	}

	function translate_value(val)
	{
		if(val.charAt(0)=="@")
			return translate_lang(val);
		if(val.indexOf('}')==-1)
			return val;
		val=val.split('{folder}').join(config.folder);
		val=val.split('{timems}').join(config._debugmode?new Date().getTime():config._urlsuffix);
		return val;
	}
	
	function _load_jsml_xml(url,callback)
	{
		jsml.jsmlfolder=config.folder+"core";
		var xh=jsml.xmlhttp();
		xh.onreadystatechange=function()
		{
			if(xh.readyState<4)return;
			xh.onreadystatechange=new Function();
			if(xh.status==0)return;
			if(xh.status!=200)
			{
				alert("Unable to load "+url+", http error "+xh.status);
				xh=null;//RELEASE_XMLHTTP_FOR_BROWSER_BUG
				return;
			}
			try
			{
				jsml.parse_xmldoc(xh.responseXML,null,null,null,translate_value);
			}
			catch(x)
			{
				alert("Unable to parse "+url+" , "+x.message);
				xh=null;//RELEASE_XMLHTTP_FOR_BROWSER_BUG
				return;
			}
			xh=null;//RELEASE_XMLHTTP_FOR_BROWSER_BUG
			//callback();
			setTimeout(callback,12);
		};
		xh.open("GET",url,true);
		xh.send("");
	}
	
	function _loadcommonxml()
	{
		if(jsml.rtecommonlibraryloaded)
		{
			_loaduihtml();
			return;
		}
		var url=config.folder+"downlevel/common.xml?"+config._urlsuffix;
		_load_jsml_xml(url,function()
		{
			_loaduihtml();
		});
	}
	function _loaduihtml()
	{
		config.uixmlclass=config.ubbmode?"rteubblayout":"rtehtmlayout";
		if(jsml.class_exists(config.uixmlclass))
		{
			_loadeditorui();
			return;
		}
		var url=config.folder+"downlevel/"+(config.ubbmode?"rteubb":"rtehtm")+".xml?"+config._urlsuffix;
		_load_jsml_xml(url,_loadeditorui);
	}

	function _loadeditorui()
	{
		config.skin_div.style.border=config.skin_divborder;
		jsml.suppend_layout();
		config.skin_control=jsml.class_create_instance(config.uixmlclass);
		
		config.skin_control._rteconfig=config;
		config.skin_container=config.skin_control.editor_frame_container;
		var width=config.skin_div.clientWidth||parseInt(config.skin_div.style.width)||760;
		var height=config.skin_div.clientHeight||parseInt(config.skin_div.style.height)||480;
		config.skin_control.set_width(width);
		config.skin_control.set_height(height);
		
		
		
		if(config.ubbmode)
		{
			loader.textbox=jsml.class_create_instance("textbox",[loader.textarea]);
			//fix IE bug : 
			loader.textbox.set_text(loader.textareainitvalue);
			loader.textbox.set_dock("fill");
			config.skin_container.append_child(loader.textbox);
			config.skin_div.innerHTML="";
			config.skin_control.set_parent(config.skin_div);
			setTimeout(_loadtextbox,1);
		}
		else
		{
			loader.textarea.style.display='none';
			config.skin_div.parentNode.insertBefore(loader.textarea,config.skin_div);
			config.skin_div.innerHTML="";
			config.skin_control.set_parent(config.skin_div);
			setTimeout(_loadframe,1);
		}
		
		jsml.resume_layout();
	}
	
	function _loadtextbox()
	{
		_loadscript();
	}

	function _loadframe()
	{
		var frame=document.createElement("IFRAME");
		config.skin_frame=frame;
		function handle_resize()
		{
			frame.style.width=Math.max(0,config.skin_container.get_client_width()-0)+"px";
			frame.style.height=Math.max(0,config.skin_container.get_client_height()-0)+"px";
		}
		var frameurl=config.folder+"downlevel/blank.htm?"+config._urlsuffix;
		var frameloaded=false;
		function frameonload()
		{
			frameloaded=true;
			frame.onload=new Function();

			if(config.designtimeblankhtml)
			{
				_loadscript();
				return;
			}
			
			var url=frameurl;
			var xh=jsml.xmlhttp();
			xh.onreadystatechange=function()
			{
				if(xh.readyState<4)return;
				xh.onreadystatechange=new Function();
				if(xh.status==0)return;
				if(xh.status!=200)
				{
					alert("Unable to load "+url);
					xh=null;//RELEASE_XMLHTTP_FOR_BROWSER_BUG
					return;
				}
				config.designtimeblankhtml=xh.responseText;
				xh=null;//RELEASE_XMLHTTP_FOR_BROWSER_BUG
				_loadscript();
			};
			xh.open("GET",url,true);
			xh.send("");
		};
		//frame.onload=frameonload;
		frame.frameBorder=0;
		frame.setAttribute("src",frameurl);
		config.skin_container._content.appendChild(frame);
		config.skin_container.attach_event("resize",handle_resize);
		handle_resize();

		//some browsers has trouble on frame.onload
		function checkframeload()
		{
			if(frameloaded)return;
			var win=frame.contentWindow;
			//if(win&&win.document&&win.document.readyState=="complete")
			//	return frameonload();
			if(win&&win.document&&win.document.body)
				return frameonload();
			setTimeout(checkframeload,10);
			
		}
		setTimeout(checkframeload,10);
	}
	
	function GetEditorClass()
	{
		return config.ubbmode?window.RTEBBCodeEditor:window.RTESimpleEditor;
	}
	
	function _loadscript()
	{
		if(GetEditorClass())
		{
			_loadeditor();
			return;
		}
		if(config.ubbmode)
			asyncloadscript(config.folder+"downlevel/rteubb.js?"+config._urlsuffix,_loadeditor);
		else
			asyncloadscript(config.folder+"downlevel/rtehtm.js?"+config._urlsuffix,_loadeditor);
	}
	
	function _loadeditor()
	{
		var frame=config.skin_frame;
		var editorctor=GetEditorClass();
		var editor=new editorctor(config,loader.textarea,loader);
		config.skin_control._rteinstance=editor;
		config.skin_control.invoke_recursive("editor_ready",editor);

		asyncloadlangindex(1);

	}
	
	loader.asyncloadscript=asyncloadscript;
	
	loader.translate_value=translate_value;
	
	loader.load=function()
	{
		_loadmain();
	}
	loader.startLoadTimer=function(timeout)
	{
		loader._loadtimerid=setTimeout(_loadmain,timeout);
	}
	loader.cancelLoadTimer=function()
	{
		clearTimeout(loader._loadtimerid);
	}
	
	loader.preloadScripts=function()
	{
		var arr=[];
		arr.push(config.folder+"scripts/config.js?"+config._urlsuffix);
		arr.push(config.folder+"core/jsml.js?"+config._urlsuffix);
		if(config.ubbmode)
			arr.push(config.folder+"downlevel/rteubb.js?"+config._urlsuffix);
		else
			arr.push(config.folder+"downlevel/rtehtm.js?"+config._urlsuffix);
		var index=-1;
		function LoadNext()
		{
			var url=arr[++index];
			if(url)asyncloadscript(url,LoadNext)
			//else , load the xml..
		}
		LoadNext();
	}

	
	_loadmain();
	
	
		
		
}

