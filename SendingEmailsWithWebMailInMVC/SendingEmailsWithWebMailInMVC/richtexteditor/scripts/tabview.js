//this script file is for preview mode

document.onclick=function(e)
{
	e=e||window.event;
	var node=e.srcElement||e.target;
	for(;node;node=node.parentNode)
	{
		var name=node.nodeName;
		switch(name)
		{
			case "A":
			case "AREA":
				node.setAttribute("target","_blank");
				return true;
			case "INPUT":
			case "BUTTON":
				return false;
		}
	}
}

