
//alert("script load correctly v0.1");


/****************************************************************\
	Cookie Functions
\****************************************************************/


function SetCookie(name,value,seconds)
{
	var cookie=name+"="+escape(value)+"; path=/;";
	if(seconds)
	{
		var d=new Date();
		d.setSeconds(d.getSeconds()+seconds);
		cookie+=" expires="+d.toUTCString()+";";
	}
	document.cookie=cookie;
}
function GetCookie(name)
{
	var cookies=document.cookie.split(';');
	for(var i=0;i<cookies.length;i++)
	{
		var parts=cookies[i].split('=');
		if(name==parts[0].replace(/\s/g,''))
			return unescape(parts[1])
	}
	//return undefined..
}
function GetCookieDictionary()
{
	var dict={};
	var cookies=document.cookie.split(';');
	for(var i=0;i<cookies.length;i++)
	{
		var parts=cookies[i].split('=');
		dict[parts[0].replace(/\s/g,'')]=unescape(parts[1]);
	}
	return dict;
}
function GetCookieArray()
{
	var arr=[];
	var cookies=document.cookie.split(';');
	for(var i=0;i<cookies.length;i++)
	{
		var parts=cookies[i].split('=');
		var cookie={name:parts[0].replace(/\s/g,''),value:unescape(parts[1])};
		arr[arr.length]=cookie;
	}
	return arr;
}

var __defaultcustomlist=["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"];
			
function GetCustomColors()
{
	var customlist=__defaultcustomlist.concat();
	for(var i=0;i<18;i++)
	{
		var color=GetCustomColor(i);
		if(color)customlist[i]=color;
	}
	return customlist;
}
function GetCustomColor(slot)
{
	return GetCookie("CECC"+slot);
}
function SetCustomColor(slot,color)
{
	SetCookie("CECC"+slot,color,60*60*24*365);
}

var _origincolor="";

document.onmouseover=function(event)
{
	event=window.event||event;
	var t=event.srcElement||event.target;
	if(t.className=="colordiv")
	{
		firecolorchange(t.style.backgroundColor);
	}
}
document.onmouseout=function(event)
{
	event=window.event||event;
	var t=event.srcElement||event.target;
	if(t.className=="colordiv")
	{
		firecolorchange(_origincolor);
	}
}
document.onclick=function(event)
{
	event=window.event||event;
	var t=event.srcElement||event.target;
	if(t.className=="colordiv")
	{
		var showname=document.getElementById("CheckboxColorNames")&&document.getElementById("CheckboxColorNames").checked;
		if(showname)
		{
			do_select(t.getAttribute("cname")||t.style.backgroundColor);
		}
		else
		{
			do_select(t.getAttribute("cvalue")||t.style.backgroundColor);
		}
	}
}


var _editor;

function firecolorchange(change)
{
	
}

if(top.dialogArguments)
{
	if(typeof(top.dialogArguments)=='object')
	{
		if(top.dialogArguments.onchange)
		{
			firecolorchange=top.dialogArguments.onchange;
			_origincolor=top.dialogArguments.color;
			_editor=top.dialogArguments.editor;
		}
	}
}

var _selectedcolor=null;
function do_select(color)
{
	_selectedcolor=color;
	firecolorchange(color);
	var span=document.getElementById("divpreview");
	if(span)span.value=color;
}
function do_saverecent(color)
{
	if(!color)return;
	if(color.length!=7)return;
	if(color.substring(0,1)!="#")return;
	var hex=color.substring(1,7);
	var recent = GetCookie("RecentColors");
	if(!recent)recent="";
	if((recent.length%6)!=0)recent="";
	for(var i = 0; i < recent.length; i += 6)
	{
		if(recent.substr(i, 6) == hex)
		{
			recent = recent.substr(0, i) + recent.substr(i + 6);
			i -= 6;
		}
	}
	if(recent.length > 31 * 6)
		recent = recent.substr(0, 31 * 6);
	recent = hex + recent;
	//alert(recent);
	SetCookie("RecentColors", recent,60*60*24*365);
}
function do_insert()
{
	var color;	
	var divpreview=document.getElementById("divpreview");
	if(divpreview)
		color=divpreview.value;
	else
		color=_selectedcolor;
	if(!color)return;
	if(/^[0-9A-F]{6}$/ig.test(color))
	{
		color="#"+color;
	}
	try{
		document.createElement("SPAN").style.color = color;
		do_saverecent(color);
		parent.rtecolorpickerdialog.result=color;
		parent.rtecolorpickerdialog.close();
	}
	catch(x)
	{
		alert(x.message);
		divpreview.value="";
		return false;
	}
}

function do_Close()
{
	parent.rtecolorpickerdialog.close();
}