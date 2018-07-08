

//----------------------------------------------------------------
//----------------------------------------------------------------

//this file put in front of body

var editor=parent.rteinsertcharseditor

function getchar(obj)
{
	var h=obj.innerHTML;
	if(!h)
		return;

	var fontval=getFontValue()||"Verdana";

	if(fontval=="Unicode")
	{
		h=obj.innerText;
	}
	else if(fontval!="Verdana")
	{
		h="<span style=\x27font-family:"+fontval+"\x27>"+obj.innerHTML+"</span>";
	}
	
	editor.InsertHTML(h);
	
	parent.rteinsertcharsdialog.close();
	
	editor.Focus();
}
function do_cancel()
{
	parent.rteinsertcharsdialog.close();
	editor.Focus();
}

function getFontValue()
{
	var coll=document.getElementsByName("selfont");
	for(var i=0;i<coll.length;i++)
		if(coll.item(i).checked)
			return coll.item(i).value;
}
function sel_font_change()
{
	var font=getFontValue()||"Verdana";
	
	var charstable1=document.getElementById("charstable1")
	var charstable2=document.getElementById("charstable2")

	charstable1.style.fontFamily=font;
	charstable1.style.display=(font!="Unicode"?"block":"none")
	charstable2.style.display=(font=="Unicode"?"block":"none")

}

new function()
{
	var ns=document.getElementsByTagName("*");
	for(var i=0;i<ns.length;i++)
	{
		var n=ns[i];
		if(n.getAttribute('langtext')!="1")continue;
		var t=n.innerText||n.textContent||"";
		if(t)
		{
			t=editor.GetLangText(t);
			n.innerText=t;
			n.textContent=t;
		}
		var t=n.value||"";
		if(t)
		{
			t=editor.GetLangText(t);
			n.value=t;
		}
	}
}
