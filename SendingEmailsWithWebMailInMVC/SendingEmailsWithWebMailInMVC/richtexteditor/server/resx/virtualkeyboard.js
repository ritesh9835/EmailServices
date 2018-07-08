

//----------------------------------------------------------------
//----------------------------------------------------------------

var editor=parent.rtevirtualkeyboardeditor;
function do_insert()
{
	var keyboard_area = document.getElementById("keyboard_area");
	var val=keyboard_area.value;
	val=val.replace(/\|$/,'');

	if ( val )
	{
		editor.InsertHTML(val);
		parent.rtevirtualkeyboarddialog.close();
		editor.Focus();
	}
}
function do_Close()
{
	parent.rtevirtualkeyboarddialog.close();
	editor.Focus();
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
