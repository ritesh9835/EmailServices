/****************************************************
* Spell Checker Client JavaScript Code
****************************************************/
// spell checker constants
var showCompleteAlert = true;

var editor=parent.rtespellcheckeditor;

function get_text(index)
{
	return editor.GetText();
}
function set_text(index,text)
{
	editor.SetText(text);
}
function get_elements_length()
{
	return 1;
}

/****************************************************
* Spell Checker Suggestion Window JavaScript Code
****************************************************/
var iElementIndex = -1;

function doinit(guid)
{
	iElementIndex = parseInt(document.getElementById("ElementIndex").value);

	var spellMode = document.getElementById("SpellMode").value;

	switch (spellMode)
	{
		case "start" :
			//do nothing client side
			break;
		case "suggest" :
			//update text from parent document
			updateText();
			//wait for input
			break;
		case "end" :
			//update text from parent document
			updateText();
			//fall through to default
		default :
			//get text block from parent document
			if(loadText())
				document.getElementById("SpellingForm").submit();
			else
				endCheck()
			break;
	}
}

function loadText()
{
	// check if there is any text to spell check
	for (++iElementIndex; iElementIndex < get_elements_length(); iElementIndex++)
	{
		var newText = get_text(iElementIndex);
		if (newText.length > 0)
		{
			updateSettings(newText, 0, iElementIndex, "start");
			document.getElementById("StatusText").innerText = "Spell Checking Text ...";
			return true;
		}
	}

	return false;
}

function updateSettings(currentText, wordIndex, elementIndex, mode)
{
	currentText=currentText.replace(/<([^>]+)/g,function(a,b,c)
	{
		return "<"+b.toLowerCase();
	});
	var div=document.createElement("DIV");
	div.appendChild(document.createTextNode(currentText));
	document.getElementById("CurrentText").value = div.innerHTML;
	document.getElementById("WordIndex").value = wordIndex;
	document.getElementById("ElementIndex").value = elementIndex;
	document.getElementById("SpellMode").value = mode;
}

function updateText()
{
	var newText = document.getElementById("CurrentText").value;
	var div=document.createElement("DIV");
	div.setAttribute("contentEditable","true");
	div.innerHTML=newText;
	var txt=div.innerText||div.textContent||"";
	div.innerHTML="";
	if(document.getElementById("Replaced").value=="ALL")
	{
		set_text(iElementIndex, txt);
	}
}

function endCheck()
{
	if (showCompleteAlert)
		alert("Spell Check Complete");
	closeWindow();
}

function closeWindow()
{
	parent.rtespellcheckdialog.close();
}

function changeWord(oElement)
{
	var k = oElement.selectedIndex;
	oElement.form.ReplacementWord.value = oElement.options[k].value;
}
