function afficher(txt)
{
//	editor.InsertHTML(txt);
	document.getElementById('keyboard_area').value = txt ;
}

function rechercher()
{
//	editor.getHTML();
	return document.getElementById('keyboard_area').value ;
}