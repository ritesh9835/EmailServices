

if (!window.CreateRTELoader) new function () {
	var _debugmode = false;
	if (location.href.indexOf("://127.0.0.1") != -1 || location.href.indexOf("rtenocache") != -1)
		_debugmode = true;
	var debugloadingsteps = false;
	if (location.href.indexOf("rteloadstep") != -1)
		debugloadingsteps = true;

	var d = new Date();
	var urlsuffix = "160322a"	//String(d.getFullYear()*10000+(1+d.getMonth())*100+d.getDate());

	if (_debugmode)
		urlsuffix = d.getTime();

	var _showLangWarning = false;

	var ismsie = /MSIE/.test(navigator.userAgent);

	function createxh() {
		return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	}

	function trace(msg) {
		if (debugloadingsteps && window.console)
			console.log(msg);
	}

	var textmap = {}

	function asyncloadtext(url, callback) {
		var item = textmap[url];
		if (item) {
			if (!callback)
				return;
			if (item.loading != 'loading') {
				setTimeout(function () {
					callback(item.text, item.xml);
				}, 0);
			}
			else {
				item.callbacks.push(callback);
			}
			return;
		}

		item = { url: url, loading: 'loading', callbacks: callback ? [callback] : [] };
		textmap[url] = item;

		trace("loadtext " + url);

		var index = 0;
		function runcallbacks() {
			var func = item.callbacks[index];
			index++;
			if (index < item.callbacks.length) setTimeout(runcallbacks, 0);
			if (func) func(item.text, item.xml);
		}

		var xh = createxh();
		xh.open("GET", url, true);
		xh.onreadystatechange = function () {
			if (xh.readyState != 4) return;
			xh.onreadystatechange = new Function("", "");

			if (xh.status != 200) {
				item.succeed = false;
				item.loading = 'httperror:' + xh.status;
				if (xh.status != 0)
					throw (new Error("failed to load " + url + " , \r\n http" + xh.status));
				return;
			}

			item.loading = 'ready';
			item.text = xh.responseText;
			item.xml = xh.responseXML;
			setTimeout(runcallbacks, 1);

			if (item.xml && window.jsml && jsml.xmlfilemap) {
				jsml.xmlfilemap[url] = item.xml;
			}
		}
		xh.send("");
	}

	function asyncloadscript(url, callback, runcode) {
		asyncloadtext(url, function (code) {
			if (!runcode)
				runcode = new Function("", code);
			try {
				runcode(code);
			}
			catch (x) {
				callback();
				throw (new Error("failed to load " + url + " , \r\n" + x.message));
			}
			callback();
		});
	}

	var stylemap = {};
	function asyncloadstyle(url, callback) {
		var item = stylemap[url];
		if (item) {
			setTimeout(function () {
				callback();
			}, 0);
			return;
		}

		item = { url: url, callbacks: [callback] };
		stylemap[url] = item;

		var index = 0;
		function runcallbacks() {
			var func = item.callbacks[index];
			index++;
			if (index < item.callbacks.length) setTimeout(runcallbacks, 0);
			if (func) func(3);
		}

		var csscontainer = document.getElementsByTagName("head")[0] || document.body;
		var stytag = document.createElement("LINK");
		if ("onload" in stytag) {
			stytag.onload = runcallbacks;
			stytag.onerror = runcallbacks;
			setTimeout(runcallbacks, 3000);
		}
		else {
			setTimeout(runcallbacks, 100);
		}
		stytag.setAttribute("type", "text/css");
		stytag.setAttribute("rel", "stylesheet");
		stytag.setAttribute("href", url);
		csscontainer.appendChild(stytag);
	}

	window.CreateRTELoader = function (config) {
		var loader = {};

		loader.asyncloadtext = function (url, callback) {
			asyncloadtext(url, callback);
		}

		loader._config = config;
		config._debugmode = _debugmode;

		var folder = config.folder;
		if (folder.indexOf("://") == -1 && folder.charAt(0) != "/") {
			var url = window.location.href.split('#')[0].split('?')[0].split('/');
			url[url.length - 1] = folder;
			url.splice(0, 3);
			config.folder = folder = "/" + url.join('/');
		}

		config.initdate = new Date();
		config._urlsuffix = urlsuffix;
		loader._html5 = !!document.createElement("canvas").getContext;

		config.configjsurl = config.folder + "scripts/config.js?" + config._urlsuffix;
		config.rtecssurl = config.folder + "styles/richtexteditor.css?" + config._urlsuffix;
		config.jsmljsurl = config.folder + "core/jsml.js?" + config._urlsuffix;
		config.commonxmlurl = config.folder + "scripts/common.xml?" + config._urlsuffix;
		config.editorjsurl = config.folder + "scripts/editor.js?" + config._urlsuffix;
		config.corejsurl = config.folder + "core/core.js?" + config._urlsuffix;

		var langs = [];

		function runlangcode(lang, code) {
			var func = new Function("lang,__code", "eval(__code)");
			if (!lang._data) lang._data = {};
			func(lang._data, code);
		}
		function asyncloadlangindex(index) {
			var lang = langs[index];
			if (!lang) return;
			if (lang.loading) return;
			lang.loading = true;
			function runcode(code) {
				runlangcode(lang, code);
			}
			function nextstep(err) {
				lang.loading = false;
				lang.loaded = true;
				if (index > 0) asyncloadlangindex(index + 1);
			}
			if (!lang.loaded) {
				asyncloadscript(lang.langurl, nextstep, runcode)
			}
			else {
				nextstep();
			}
		}
		function syncloadlang(lang) {
			var xh = createxh();
			xh.open("GET", lang.langurl, false);
			xh.send("");
			if (xh.status != 200) return;
			runlangcode(lang, xh.responseText);
		}

		loader.getLangKeys = function (urlfilter) {
			var map = {}
			var arr = [];
			for (var i = 0; i < langs.length; i++) {
				var lang = langs[i];
				if (urlfilter && !urlfilter(lang.langurl))
					continue;
				var dict = lang._data;
				if (!dict) {
					syncloadlang(lang);
					dict = lang._data;
				}
				if (!dict) continue;
				for (var key in dict) {
					if (map[key]) continue;
					map[key] = true;
					arr.push(key);
				}
			}
			return arr;
		}

		loader.getLangText = function (name, nullifnotfound) {
			var showWarning = _showLangWarning;
			if (!name) return nullifnotfound ? null : "{empty}";

			name = name.toLowerCase().replace(/(^\s+|\s+$)/g, "");
			for (var i = 0; i < langs.length; i++) {
				var lang = langs[i];
				var dict = lang._data;
				if (!dict) {
					if (showWarning) {
						showWarning = false;
						setTimeout(function () {
							throw (new Error("Warning,sync load " + lang.langurl + " for text {" + name + "}"));
						}, 1);
					}
					syncloadlang(lang);
					dict = lang._data;
				}
				if (!dict) continue;
				var text = dict[name];
				if (!text) continue;
				if (text.indexOf("{") != -1 && text.indexOf("}") != -1) {
					for (var i = 1; i < arguments.length; i++) {
						text = text.split("{" + (i - 1) + "}").join(arguments[i]);
					}
				}
				return text;
			}

			if (nullifnotfound)
				return null;

			if (config._debugmode)
				return "{" + name + "}";
			return name;
		}


		function translate_lang(val) {
			if (val.indexOf("|") == -1)
				return loader.getLangText(val.substring(1));
			var pairs = val.split("|");
			for (var i = 0; i < pairs.length; i++) {
				val = pairs[i];
				if (val.charAt(0) == "@") {
					if (val.length == 1)
						pairs[i] = "";
					else
						pairs[i] = loader.getLangText(val.substring(1));
				}
			}
			return pairs.join("");
		}

		loader.translateText = function (text) {
			if (!text) return "";
			if (text.charAt(0) == "@")
				return translate_lang(text);
			return text;
		}


		function onstyleload() {
			loader._stylestep++;

			trace("onstyleload " + loader._stylestep);

			if (loader._stylestep != 3)
				return;

			_loadeditorui();
		}

		function loadintodom(xml) {
			if (window.DOMParser) {
				return new DOMParser().parseFromString(xml, "text/xml");
			}
			if (window.ActiveXObject) {
				var doc = (new ActiveXObject("Microsoft.XMLDOM"));
				doc.loadXML(xml);
				return doc;
			}
			return null;
		}

		function _loadmain() {
			if (loader._loadcalled) return;
			loader._loadcalled = true;


			if (config.servertype == "AspNet") {
				var addedcount = 0;
				loader.addurltext = function (url, text) {
					url = config.folder + url;
					var item = { url: url, loading: 'ready', callbacks: [], text: text };
					if (url.indexOf('.xml') != -1) {
						item.xml = loadintodom(text);
						if (!item.xml)
							return;
					}
					trace("addurltext " + (++addedcount) + ":" + url);
					textmap[url] = item;
				}
				config.serverloaderurl = config.folder + "server/Loader.aspx?suffix=" + config._urlsuffix;
				if (config.skin) {
					config.serverloaderurl += "&skin=" + translateskin(config.skin.toLowerCase()).split('-')[0];
				}
				if (config.langfiles) {
					config.serverloaderurl += "&langfiles=" + config.langfiles;
				}

				asyncloadscript(config.serverloaderurl, Function, function (code) {
					var func = new Function("loader", code);
					func.apply(loader, [loader]);
					trace(config.servertype + " script ready");
					loadconfigjs()
				});
			}
			else {
				loader.preloadScripts();
				loadconfigjs()
			}
		}

		function loadconfigjs() {
			function nextstep(err) {
				if (err) {
					alert("Unable to load config.js \r\n" + err);
				}
				else {
					_configready()
				}
			};

			if (config.baseconfig || window.RTE_Configuration)
				_configready();
			else
				asyncloadscript(config.configjsurl, nextstep)
		}

		function translateskin(skin) {

			switch (skin) {
				case "office2007blue":
					skin = "office2007-blue";
					break;
				case "office2007silver":
					skin = "office2007-silver";
					break;
				case "office2007silver2":
					skin = "office2007-silver2";
					break;
				case "office2010blue":
					skin = "office2010-blue";
					break;
				case "office2010blue2":
					skin = "office2010-blue2";
					break;
				case "office2010silver2":
					skin = "office2010-silver2";
					break;
				case "office2010silver":
					skin = "office2010-silver";
					break;
				case "office2010black":
					skin = "office2010-black";
					break;
				case "office2003blue":
					skin = "office2003-blue";
					break;
				case "office2003silver":
					skin = "office2003-silver";
					break;
				case "office2003silver2":
					skin = "office2003-silver2";
					break;
				case "officexpblue":
					skin = "officexp-blue";
					break;
				case "officexpsilver":
					skin = "officexp-silver";
					break;
				case "smartblue":
					skin = "smart-blue";
					break;
				case "smartsilver":
					skin = "smart-silver";
					break;
				case "smartgray":
					skin = "smart-gray";
					break;
				case "phonesilver":
					skin = "phone-lightsilver";
					break;
			}

			if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
				skin = "phone-lightsilver";
			}

			return skin;
		}

		function _configready() {
			trace("configready");

			var baseconfig = config.baseconfig || window.RTE_Configuration;

			if (baseconfig) {
				for (var p in baseconfig) {
					if (!config.hasOwnProperty(p))
						config[p] = baseconfig[p];
				}
			}

			var skin = config.skin.toLowerCase();

			skin = translateskin(skin);

			var skinpair = skin.split('-');
			if (skinpair.length > 1) {
				config.skin = skinpair[0];
				config.color = skinpair[1];
			}
			else {
				//invalid toolbar set!
			}

			if (config.toolbaritems || config.toolbar != "custom") {
				config._toolbartemplate = "template";
			}

			if (config.skin == "phone" || config.skin == "pad") {
				config.ismobileversion = true;
			}

			if (!config.containerid) {
				alert("Fail to load editor because the ID is not set.");
				return;
			}

			config.editorelement = document.getElementById(config.containerid);
			config.skin_div = config.editorelement;
			config.skin_div_holder = config.skin_div;
			config.skin_div_parent = config.skin_div.parentNode;
			config.skin_divborder = config.skin_div.style.border;
			config.skin_div.style.border = "solid 1px #eeeeee";

			config.skin_div.innerHTML = "<table style='width:100%;height:100%;'><tr>"
				+ "<td style='vertical-align:center;text-align:center;'>"
				+ "<img src='" + config.folder + "images/" + config.loader_loadingimage + "'/></td></tr></table>";


			if (config.langfiles) {
				var langarr = config.langfiles.split(',');
				for (var i = 0; i < langarr.length; i++) {
					langs.push({ langfile: langarr[i], langurl: config.folder + "lang/" + langarr[i] + ".js?" + config._urlsuffix });
				}
				asyncloadlangindex(0);
			}

			config.blankfileurl = config.folder + "scripts/blank" + (config.designdoctype || "") + ".htm?" + config._urlsuffix;


			if (!window.localStorage && ismsie) {
				config.userDataBehavior = document.createElement("textarea");
				config.userDataBehavior.style.cssText = "behavior:url('#default#userData');display:none;position:absolute;width:0px;height:0px;"
				document.body.insertBefore(config.userDataBehavior, document.body.firstChild);
			}
			else {
				config.localStorage = window.localStorage;
			}

			config.skincssurl = config.folder + "skins/" + config.skin + "/skin.css?" + config._urlsuffix;
			config.skinxmlurl = config.folder + "skins/" + (config.skin) + "/skin.xml?" + config._urlsuffix;

			//preload
			asyncloadtext(config.skinxmlurl);

			loader._stylestep = 0;
			asyncloadstyle(config.rtecssurl, onstyleload);
			asyncloadstyle(config.skincssurl, onstyleload);



			setTimeout(function () {
				_loadjsml();
			}, config.loader_loadcodedelay || 1);
		}


		function loadframeurl() {
			asyncloadtext(config.blankfileurl, function (text) {
				config.designtimeblankhtml = text;
				if (config._frameloaded)
					_loadscript();
			});
		}

		function _loadjsml() {
			trace("_loadjsml");

			function nextstep() {
				//IE may crash for this feature
				//jsml.enableieborderradius=config.enableieborderradius;


				if (jsml.xmlfilemap) {
					for (var url in textmap) {
						var item = textmap[url];
						if (item.xml)
							jsml.xmlfilemap[url] = item.xml;
					}
				}

				jsml.jsmlfolder = config.folder + "core"
				jsml.default_textbox_bordercolor = "#eeeeee";
				if (config.ismobileversion)
					jsml.mobile = true;

				if (!config.designtimeblankhtml)
					loadframeurl();

				_loadicache();
			};

			if (window.jsml)
				nextstep();
			else
				asyncloadscript(config.jsmljsurl, nextstep)
		}
		function _loadicache() {
			if (!loader._html5 || !config.useimagedatacache) {
				_loadcommonxml();
				return;
			}

			function nextstep(err) {
				if (!err) config._rte_image_cache = window._rte_image_cache;
				_loadcommonxml();
			};
			if (config._rte_image_cache)
				nextstep();
			else
				asyncloadscript(config.folder + "scripts/ihtml5.js?" + config._urlsuffix, nextstep)
		}

		function translate_value(val) {
			if (val.charAt(0) == "@")
				return translate_lang(val);
			if (val.indexOf('}') == -1)
				return val;
			val = val.split('{skin}').join(config.skin);
			val = val.split('{color}').join(config.color);
			val = val.split('{folder}').join(config.folder);
			val = val.split('{toolbar}').join(config._toolbartemplate || config.toolbar);
			val = val.split('{timems}').join(config._debugmode ? new Date().getTime() : config._urlsuffix);
			return val;
		}

		function _load_jsml_xml(url, callback) {
			asyncloadtext(url, function (text, xml) {
				try {
					jsml.parse_xmldoc(xml, null, null, null, translate_value);
				}
				catch (x) {
					alert("Unable to parse " + url + " , " + x.message);
					return;
				}
				setTimeout(callback, 12);
			});
		}

		function _loadcommonxml() {
			trace("_loadcommonxml");

			if (jsml.rtecommonlibraryloaded) {
				_loadskinxml();
				return;
			}

			_load_jsml_xml(config.commonxmlurl, function () {
				_loadskinxml();
			});
		}
		function _loadskinxml() {
			trace("_loadskinxml");

			config.skinxmlclass = "rteskin_" + (config.skin) + "_" + config.color;
			if (jsml.class_exists(config.skinxmlclass)) {
				onstyleload();
				return;
			}

			_load_jsml_xml(config.skinxmlurl, onstyleload);
		}

		function _loadeditorui() {
			trace("_loadeditorui");

			try {
				config.skin_div.style.border = config.skin_divborder;
				config.skin_div.innerHTML = "";
				jsml.suppend_layout();
				config.skin_control = jsml.class_create_instance(config.skinxmlclass);
				config.skin_control._rteconfig = config;
				config.skin_container = config.skin_control.editor_frame_container;
				var width = config.skin_div.clientWidth || parseInt(config.skin_div.style.width) || 760;
				var height = config.skin_div.clientHeight || parseInt(config.skin_div.style.height) || 480;
				config.skin_control.set_width(width);
				config.skin_control.set_height(height);
				config.skin_control.set_parent(config.skin_div);
				jsml.resume_layout();
			}
			catch (x) {
				alert("Unable to initialize the UI , " + x.message);
			}

			setTimeout(function () {
				try {
					_loadframe();
				}
				catch (x) {
					alert("Unable to initialize the IFrame , " + x.message);
				}
			}, 1);
		}


		function _loadframe() {
			trace("_loadframe");

			var frame = document.createElement("IFRAME");
			config.skin_frame = frame;
			function handle_resize() {
				frame.style.width = Math.max(0, config.skin_container.get_client_width() - 0) + "px";
				frame.style.height = Math.max(0, config.skin_container.get_client_height() - 0) + "px";
			}


			//config._frameloaded=false;

			//frame.onload=frameonload;
			frame.frameBorder = 0;
			frame.setAttribute("src", "about:blank");
			config.skin_container._content.appendChild(frame);
			config.skin_container.attach_event("resize", handle_resize);
			handle_resize();

			//some browsers has trouble on frame.onload
			function checkframeload() {
				if (config._frameloaded) return;
				var win = frame.contentWindow;
				if (win && win.document && win.document.body) {
					if (config.designtimeblankhtml)
						_loadscript();
				}
				else {
					setTimeout(checkframeload, 10);
				}
			}
			setTimeout(checkframeload, 10);
		}

		function _loadscript() {
			trace("_loadscript");

			function editorjsready() {
				_loadeditor();

				try {

				}
				catch (x) {
					alert("Unable to initialize the Editor class , " + x.message);
				}
			};

			if ($rte.Editor) {
				editorjsready();
				return;
			}

			function corejsready() {
				asyncloadscript(config.editorjsurl, editorjsready);
				if (loader.oncoreload) {
					loader.oncoreload(loader);
				}
				if (window.RichTextEditor_OnCoreLoad) {
					window.RichTextEditor_OnCoreLoad(loader);
				}
			};

			if ($rte.Core) {
				corejsready();
				return;
			}

			asyncloadscript(config.corejsurl, corejsready);
		}

		function _loadeditor() {
			trace("_loadeditor");

			var frame = config.skin_frame;
			var editor = new $rte.Editor(config, frame, frame.contentWindow, loader);
			config.skin_control._rteinstance = editor;
			config.skin_control.invoke_recursive("editor_ready", editor);
			//config.skin_div.onclick=editor.delegate(editor.Focus);

			var timerid;
			function disposeeditor() {
				window.clearInterval(timerid);
				jsml.dom_detach_event(window, "unload", windowunload);
				editor.Dispose();
				for (var i = 0; i < $rte._editorlist.length; i++) {
					if ($rte._editorlist[i] == editor) {
						$rte._editorlist.splice(i, 1);
					}
				}
			}
			function windowunload() {
				disposeeditor()
				if ($rte._editorlist.length == 0) {
					jsml.disposeall();
				}
			}

			jsml.dom_attach_event(window, "unload", windowunload);
			if (!$rte._editorlist) $rte._editorlist = [];
			$rte._editorlist.push(editor);

			timerid = window.setInterval(function () {
				for (var n = config.skin_div; n; n = n.parentNode)
					if (n.nodeName == "BODY")
						return;
				disposeeditor()
			}, 200);



			asyncloadlangindex(1);
			if (config.preloadplugins) {
				var arr = config.preloadplugins.split(',');
				for (var i = 0; i < arr.length; i++)
					editor.LoadPlugin(arr[i]);
			}


			if (config.autofocus) {
				setTimeout(function () {
					editor.Focus();
				}, 222);
			}

			if (config.initialtabmode)
				editor.ExecUICommand(null, "tab" + config.initialtabmode);
			if (!config.initialtoggleborder)
				editor.ExecUICommand(null, "ToggleBorder");


			if (config.initialfullscreen) {
				setTimeout(function () {
					editor.ExecUICommand(null, "FullScreen");
					editor.Focus();
				}, 55);
			}
		}

		loader.asyncloadscript = asyncloadscript;

		loader.translate_value = translate_value;

		loader.load = function () {
			_loadmain();
		}
		loader.startLoadTimer = function (timeout) {
			clearTimeout(loader._loadtimerid);
			loader._loadtimerid = setTimeout(_loadmain, timeout);
		}
		loader.cancelLoadTimer = function () {
			clearTimeout(loader._loadtimerid);
		}

		loader.preloadScripts = function () {
			asyncloadtext(config.configjsurl);
			asyncloadtext(config.rtecssurl);
			asyncloadtext(config.jsmljsurl);
			asyncloadtext(config.commonxmlurl);
			asyncloadtext(config.corejsurl);
			asyncloadtext(config.editorjsurl);
		}

		if (window.RichTextEditor_OnLoader)
			window.RichTextEditor_OnLoader(loader);

		return loader;

	}
}
