var POSITIONADJUSTX=22;
var POSITIONADJUSTY=52;
var POSITIONADJUSTZ=48;

/*
 * -----------------------------------------------------
 * Author: Lewis E. Moten III
 * Date: May, 16, 2004
 * Homepage: http://www.lewismoten.com
 * Email: lewis@moten.com
 * -----------------------------------------------------
 * 
 * This code is Copyright (c) 2004 Lewis Moten, all rights reserved. 
 * In order to receive the right to license this code for use on your 
 * site the original code must be downloaded from lewismoten.com.
 * License is granted to user to reuse this code on their own Web
 * site if and only if this entire copyright notice is included. 
 * Code written by Lewis Moten.
 */
 

var ColorMode = 1;
var GradientPositionDark = new Boolean(false);
var frm = new Object();
var msg = new Object();
var _xmlDocs = new Array();
var _xmlIndex = -1;
var _xml = null;
LoadLanguage();

window.onload = window_load;

function initialize()
{
	frm.btnCancel.onclick = btnCancel_Click;
	frm.btnOK.onclick = btnOK_Click;
	frm.txtHSB_Hue.onkeyup = Hsb_Changed;
	frm.txtHSB_Hue.onkeypress = validateNumber;
	frm.txtHSB_Saturation.onkeyup = Hsb_Changed;
	frm.txtHSB_Saturation.onkeypress = validateNumber;
	frm.txtHSB_Brightness.onkeyup = Hsb_Changed;
	frm.txtHSB_Brightness.onkeypress = validateNumber;
	frm.txtRGB_Red.onkeyup = Rgb_Changed;
	frm.txtRGB_Red.onkeypress = validateNumber;
	frm.txtRGB_Green.onkeyup = Rgb_Changed;
	frm.txtRGB_Green.onkeypress = validateNumber;
	frm.txtRGB_Blue.onkeyup = Rgb_Changed;
	frm.txtRGB_Blue.onkeypress = validateNumber;
	frm.txtHex.onkeyup = Hex_Changed;
	frm.txtHex.onkeypress = validateHex;
	frm.btnWebSafeColor.onclick = btnWebSafeColor_Click;
	frm.rdoHSB_Hue.onclick = rdoHsb_Hue_Click;
	frm.rdoHSB_Saturation.onclick = rdoHsb_Saturation_Click;
	frm.rdoHSB_Brightness.onclick = rdoHsb_Brightness_Click;

	document.getElementById("pnlGradient_Top").onclick = pnlGradient_Top_Click;
	document.getElementById("pnlGradient_Top").onmousemove = pnlGradient_Top_MouseMove;
	document.getElementById("pnlGradient_Top").onmousedown = pnlGradient_Top_MouseDown;
	document.getElementById("pnlGradient_Top").onmouseup = pnlGradient_Top_MouseUp;
	
	document.getElementById("pnlVertical_Top").onclick = pnlVertical_Top_Click;
	document.getElementById("pnlVertical_Top").onmousemove = pnlVertical_Top_MouseMove;
	document.getElementById("pnlVertical_Top").onmousedown = pnlVertical_Top_MouseDown;
	document.getElementById("pnlVertical_Top").onmouseup = pnlVertical_Top_MouseUp;
	document.getElementById("pnlWebSafeColor").onclick = btnWebSafeColor_Click;
	document.getElementById("pnlWebSafeColorBorder").onclick = btnWebSafeColor_Click;
	document.getElementById("pnlOldColor").onclick = pnlOldClick_Click;

	document.getElementById("lblHSB_Hue").onclick = rdoHsb_Hue_Click;
	document.getElementById("lblHSB_Saturation").onclick = rdoHsb_Saturation_Click;
	document.getElementById("lblHSB_Brightness").onclick = rdoHsb_Brightness_Click;

	frm.txtHSB_Hue.focus();
	window.focus();
}
function formatString(format)
{
	format = new String(format);
	for(var i = 1; i < arguments.length; i++)
		format = format.replace(new RegExp("\\{" + (i-1) + "\\}"), arguments[i]);
	return format;
}
function AddValue(o, value)
{
	value = new String(value).toLowerCase();
	for(var i = 0; i < o.length; i++)
		if(o[i] == value) return;
	o[o.length] = value;
}
function SniffLanguage(l)
{

}
function LoadNextLanguage()
{

}
function LoadLanguage()
{
	// set default language (en-us)
	msg.BadNumber = "A number between {0} and {1} is required. Closest value inserted.";
	msg.Title = "Color Picker";
	msg.SelectAColor = "Select a color:";
	msg.OKButton = "OK";
	msg.CancelButton = "Cancel";
	msg.Recent = "Recent";
	msg.WebSafeWarning = "Warning: not a web safe color";
	msg.WebSafeClick = "Click to select web safe color";
	msg.HsbHue = "H:";
	msg.HsbHueTooltip = "Hue";
	msg.HsbHueUnit = "%";
	msg.HsbSaturation = "S:";
	msg.HsbSaturationTooltip = "Saturation";
	msg.HsbSaturationUnit = "%";
	msg.HsbBrightness = "B:";
	msg.HsbBrightnessTooltip = "Brightness";
	msg.HsbBrightnessUnit = "%";
	msg.RgbRed = "R:";
	msg.RgbRedTooltip = "Red";
	msg.RgbGreen = "G:";
	msg.RgbGreenTooltip = "Green";
	msg.RgbBlue = "B:";
	msg.RgbBlueTooltip = "Blue";
	msg.Hex = "#";
	msg.RecentTooltip = "Recent:";

}
function AssignLanguage()
{
	
}
function localize()
{
	SetHTML(
		document.getElementById("lblSelectColorMessage"), msg.SelectAColor,
		document.getElementById("lblRecent"), msg.Recent,
		document.getElementById("lblHSB_Hue"), msg.HsbHue,
		document.getElementById("lblHSB_Saturation"), msg.HsbSaturation,
		document.getElementById("lblHSB_Brightness"), msg.HsbBrightness,
		document.getElementById("lblRGB_Red"), msg.RgbRed,
		document.getElementById("lblRGB_Green"), msg.RgbGreen,
		document.getElementById("lblRGB_Blue"), msg.RgbBlue,
		document.getElementById("lblHex"), msg.Hex,
		document.getElementById("lblUnitHSB_Hue"), msg.HsbHueUnit,
		document.getElementById("lblUnitHSB_Saturation"), msg.HsbSaturationUnit,
		document.getElementById("lblUnitHSB_Brightness"), msg.HsbBrightnessUnit
	);
	SetValue(
		frm.btnCancel, msg.CancelButton,
		frm.btnOK, msg.OKButton
	);
	SetTitle(
		frm.btnWebSafeColor, msg.WebSafeWarning,
		document.getElementById("pnlWebSafeColor"), msg.WebSafeClick,
		document.getElementById("pnlHSB_Hue"), msg.HsbHueTooltip,
		document.getElementById("pnlHSB_Saturation"), msg.HsbSaturationTooltip,
		document.getElementById("pnlHSB_Brightness"), msg.HsbBrightnessTooltip,
		document.getElementById("pnlRGB_Red"), msg.RgbRedTooltip,
		document.getElementById("pnlRGB_Green"), msg.RgbGreenTooltip,
		document.getElementById("pnlRGB_Blue"), msg.RgbBlueTooltip
	);
	
}
function window_load(e)
{
	frm = document.getElementById("frmColorPicker");
	localize();
	initialize();

	var hex = GetQuery("Color").toUpperCase();
	if(hex == "") hex = "FFFFFF";
	if(hex.length == 7) hex = hex.substr(1,6);
	frm.txtHex.value = hex;
	Hex_Changed(e);
	hex = Form_Get_Hex();
	SetBg(document.getElementById("pnlOldColor"), hex);
	
	frm.ColorType[new Number(GetCookie("ColorMode")||0)].checked = true;
	ColorMode_Changed(e);
	
	var recent = GetCookie("RecentColors")||"";
		
	var RecentTooltip = msg.RecentTooltip;
	for(var i = 1; i < 33; i++)
		if(recent.length / 6 >= i)
		{
			hex = recent.substr((i-1) * 6, 6);
			var rgb = HexToRgb(hex);
			var title = formatString(msg.RecentTooltip, hex, rgb[0], rgb[1], rgb[2]);
			SetBg(document.getElementById("pnlRecent" + i), hex);
			SetTitle(document.getElementById("pnlRecent" + i), title);
			document.getElementById("pnlRecent" + i).onclick = pnlRecent_Click;		
		}
		else
			document.getElementById("pnlRecent" + i).style.border = "0px";
			//Hide(document.all["pnlRecent" + i]);
}

function pnlRecent_Click(e)
{
	var color = e.target.style.backgroundColor;
	if(color.indexOf("rgb") != -1)
	{
		var rgb = new Array();
		color = color.substr(color.indexOf("(") + 1);
		color = color.substr(0, color.indexOf(")"));
		rgb[0] = new Number(color.substr(0, color.indexOf(",")));
		color = color.substr(color.indexOf(",") + 1);
		rgb[1] = new Number(color.substr(0, color.indexOf(",")));
		rgb[2] = new Number(color.substr(color.indexOf(",") + 1));
		color = RgbToHex(rgb);
	}
	else
	{
		color = color.substr(1, 6).toUpperCase();
	}
	frm.txtHex.value = color;
	Hex_Changed(e);
}
function pnlOldClick_Click(e)
{
	frm.txtHex.value = document.getElementById("pnlOldColor").style.backgroundColor.substr(1, 6).toUpperCase();
	Hex_Changed(e);
}
function rdoHsb_Hue_Click(e)
{
	frm.rdoHSB_Hue.checked = true;
	ColorMode_Changed(e);
}
function rdoHsb_Saturation_Click(e)
{
	frm.rdoHSB_Saturation.checked = true;
	ColorMode_Changed(e);
}
function rdoHsb_Brightness_Click(e)
{
	frm.rdoHSB_Brightness.checked = true;
	ColorMode_Changed(e);
}
function Hide()
{
	for(var i = 0; i < arguments.length; i++)
		if(arguments[i])
			arguments[i].style.display = "none";
}
function Show()
{
	for(var i = 0; i < arguments.length; i++)
		if(arguments[i])
			arguments[i].style.display = "";
}
function SetValue()
{
	for(var i = 0; i < arguments.length; i+=2)
		arguments[i].value = arguments[i+1];
}
function SetTitle()
{
	for(var i = 0; i < arguments.length; i+=2)
		arguments[i].title = arguments[i+1];
}
function SetHTML()
{
	for(var i = 0; i < arguments.length; i+=2)
		arguments[i].innerHTML = arguments[i+1];
}
function SetBg()
{
	for(var i = 0; i < arguments.length; i+=2)
	{
		if(arguments[i])
		arguments[i].style.backgroundColor = "#" + arguments[i+1];
	}
}
function SetBgPosition()
{
	for(var i = 0; i < arguments.length; i+=3)
		arguments[i].style.backgroundPosition = arguments[i+1] + "px " + arguments[i+2] + "px";
}
function ColorMode_Changed(e)
{
	for(var i = 0; i < 3; i++)
		if(frm.ColorType[i].checked) ColorMode = i;
	SetCookie("ColorMode", ColorMode,60*60*24*365);

	Hide(
		document.getElementById("pnlGradientHsbHue_Hue"),
		document.getElementById("pnlGradientHsbHue_Black"),
		document.getElementById("pnlGradientHsbHue_White"),
		document.getElementById("pnlVerticalHsbHue_Background"),
		document.getElementById("pnlVerticalHsbSaturation_Hue"),
		document.getElementById("pnlVerticalHsbSaturation_White"),
		document.getElementById("pnlVerticalHsbBrightness_Hue"),
		document.getElementById("pnlVerticalHsbBrightness_Black"),
		document.getElementById("pnlVerticalRgb_Start"),
		document.getElementById("pnlVerticalRgb_End"),
		document.getElementById("pnlGradientRgb_Base"),
		document.getElementById("pnlGradientRgb_Invert"),
		document.getElementById("pnlGradientRgb_Overlay1"),
		document.getElementById("pnlGradientRgb_Overlay2")
	);

	switch(ColorMode)
	{
		case 0:
			document.getElementById("imgGradient").src = "images/cpns_ColorSpace1.png";
			Show(
				document.getElementById("pnlGradientHsbHue_Hue"),
				document.getElementById("pnlGradientHsbHue_Black"),
				document.getElementById("pnlGradientHsbHue_White"),
				document.getElementById("pnlVerticalHsbHue_Background")
			);
			Hsb_Changed(e);
			break;
		case 1:
			document.getElementById("imgGradient").src = "images/cpns_ColorSpace2.png";
			document.getElementById("pnlVerticalHsbSaturation_Hue").src = "images/cpns_Vertical1.png";
			Show(
				document.getElementById("pnlGradientHsbHue_Hue"),
				document.getElementById("pnlVerticalHsbSaturation_Hue")
			);
			document.getElementById("pnlGradientHsbHue_Hue").style.backgroundColor = "#000000";
			Hsb_Changed(e);
			break;
		case 2:
			document.getElementById("imgGradient").src = "images/cpns_ColorSpace2.png";
			document.getElementById("pnlVerticalHsbSaturation_Hue").src = "images/cpns_Vertical2.png";
			Show(
				document.getElementById("pnlGradientHsbHue_Hue"),
				document.getElementById("pnlVerticalHsbSaturation_Hue")
			);
			document.getElementById("pnlGradientHsbHue_Hue").style.backgroundColor = "#ffffff";
			Hsb_Changed(e);
			break;
		default:
			break;
	}
}
function btnWebSafeColor_Click(e)
{
	var rgb = HexToRgb(frm.txtHex.value);
	rgb = RgbToWebSafeRgb(rgb);
	frm.txtHex.value = RgbToHex(rgb);
	Hex_Changed(e);
}
function checkWebSafe()
{
	var rgb = Form_Get_Rgb();
	if(RgbIsWebSafe(rgb))
	{
		Hide(
			frm.btnWebSafeColor,
			document.getElementById("pnlWebSafeColor"),
			document.getElementById("pnlWebSafeColorBorder")
		);
	}
	else
	{
		rgb = RgbToWebSafeRgb(rgb);
		SetBg(document.getElementById("pnlWebSafeColor"), RgbToHex(rgb));
		Show(
			frm.btnWebSafeColor,
			document.getElementById("pnlWebSafeColor"),
			document.getElementById("pnlWebSafeColorBorder")
		);
	}
}
function validateNumber(e)
{
	var key = String.fromCharCode(e.which);
	if(IgnoreKey(e)) return;
	if("01234567879".indexOf(key) != -1) return;
	e.which = 0;	
}
function validateHex(e)
{
	if(IgnoreKey(e)) return;
	var key = String.fromCharCode(e.which);
	if("abcdef".indexOf(key) != -1)
	{
		//e.which = key.toUpperCase().charCodeAt(0);
		return;
	}
	if("01234567879ABCDEF".indexOf(key) != -1) return;
	//e.which = 0;	
}
function IgnoreKey(e)
{
	var key = String.fromCharCode(e.which);
	var keys = new Array(0, 8, 9, 13, 27);
	if(key == null) return true;
	for(var i = 0; i < 5; i++)
		if(e.which == keys[i]) return true;
	return false;
}
function btnCancel_Click()
{
	if(window.opener)
	{
		window.opener.focus();
	}
	(top.closeeditordialog||top.close)();
}
function btnOK_Click()
{
	var hex = new String(frm.txtHex.value);
	if(window.opener)
	{
		try
		{
			window.opener.ColorPicker_Picked(hex);
		}
		catch(e)
		{
		}
		window.opener.focus();
	}
	recent = GetCookie("RecentColors")||"";
	for(var i = 0; i < recent.length; i += 6)
		if(recent.substr(i, 6) == hex)
		{
			recent = recent.substr(0, i) + recent.substr(i + 6);
			i -= 6;
		}
	if(recent.length > 31 * 6)
		recent = recent.substr(0, 31 * 6);
	recent = frm.txtHex.value + recent;
	SetCookie("RecentColors", recent,60*60*24*365);
	(top.closeeditordialog||top.close)();
}
function SetGradientPosition(e, x, y)
{
	x=x-POSITIONADJUSTX+5;
	y=y-POSITIONADJUSTY+5;
	
	x -= 7;
	y -= 27;
	x=x<0?0:x>255?255:x;
	y=y<0?0:y>255?255:y;

	SetBgPosition(document.getElementById("pnlGradientPosition"), x - 5, y - 5);
	switch(ColorMode)
	{
		case 0:
			var hsb = new Array(0, 0, 0);
			hsb[1] = x / 255;
			hsb[2] = 1 - (y / 255);
			frm.txtHSB_Saturation.value = Math.round(hsb[1] * 100);
			frm.txtHSB_Brightness.value = Math.round(hsb[2] * 100);
			Hsb_Changed(e);
			break;
		case 1:
			var hsb = new Array(0, 0, 0);
			hsb[0] = x / 255;
			hsb[2] = 1 - (y / 255);
			frm.txtHSB_Hue.value = hsb[0] == 1 ? 0 : Math.round(hsb[0] * 360);
			frm.txtHSB_Brightness.value = Math.round(hsb[2] * 100);
			Hsb_Changed(e);
			break;
		case 2:
			var hsb = new Array(0, 0, 0);
			hsb[0] = x / 255;
			hsb[1] = 1 - (y / 255);
			frm.txtHSB_Hue.value = hsb[0] == 1 ? 0 : Math.round(hsb[0] * 360);
			frm.txtHSB_Saturation.value = Math.round(hsb[1] * 100);
			Hsb_Changed(e);
			break;
	}
}
function Hex_Changed(e)
{
	var hex = Form_Get_Hex();
	var rgb = HexToRgb(hex);
	var hsb = RgbToHsb(rgb);
	Form_Set_Rgb(rgb);
	Form_Set_Hsb(hsb);
	SetBg(document.getElementById("pnlNewColor"), hex);
	SetupCursors(e);
	SetupGradients();
	checkWebSafe();
}
function Rgb_Changed(e)
{
	var rgb = Form_Get_Rgb();
	var hsb = RgbToHsb(rgb);
	var hex = RgbToHex(rgb);
	Form_Set_Hsb(hsb);
	Form_Set_Hex(hex);
	SetBg(document.getElementById("pnlNewColor"), hex);
	SetupCursors(e);
	SetupGradients();
	checkWebSafe();
}
function Hsb_Changed(e)
{
	var hsb = Form_Get_Hsb();
	var rgb = HsbToRgb(hsb);
	var hex = RgbToHex(rgb);
	Form_Set_Rgb(rgb);
	Form_Set_Hex(hex);
	SetBg(document.getElementById("pnlNewColor"), hex);
	SetupCursors(e);
	SetupGradients();
	checkWebSafe();
}
function Form_Set_Hex(hex)
{
	frm.txtHex.value = hex;
}

function Form_Get_Hex()
{
	var hex = new String(frm.txtHex.value);
	for(var i = 0; i < hex.length; i++)
		if("0123456789ABCDEFabcdef".indexOf(hex.substr(i, 1)) == -1)
		{
			hex = "000000";
			frm.txtHex.value = hex;
			alert(formatString(msg.BadNumber, "000000", "FFFFFF"));
			break;
		}
	while(hex.length < 6)
		hex = "0" + hex;
	return hex;
}
function Form_Get_Hsb()
{
	var hsb = new Array(0, 0, 0);
	
	hsb[0] = new Number(frm.txtHSB_Hue.value) / 360;
	hsb[1] = new Number(frm.txtHSB_Saturation.value) / 100;
	hsb[2] = new Number(frm.txtHSB_Brightness.value) / 100;
	if(hsb[0] > 1 || isNaN(hsb[0]))
	{
		hsb[0] = 1;
		frm.txtHSB_Hue.value = 360;
		alert(formatString(msg.BadNumber, 0, 360));
	}
	if(hsb[1] > 1 || isNaN(hsb[1]))
	{
		hsb[1] = 1;
		frm.txtHSB_Saturation.value = 100;
		alert(formatString(msg.BadNumber, 0, 100));
	}
	if(hsb[2] > 1 || isNaN(hsb[2]))
	{
		hsb[2] = 1;
		frm.txtHSB_Brightness.value = 100;
		alert(formatString(msg.BadNumber, 0, 100));
	}
	return hsb;
}
function Form_Set_Hsb(hsb)
{
	SetValue(
		frm.txtHSB_Hue, Math.round(hsb[0] * 360),
		frm.txtHSB_Saturation, Math.round(hsb[1] * 100),
		frm.txtHSB_Brightness, Math.round(hsb[2] * 100)
	)
}
function Form_Get_Rgb()
{
	var rgb = new Array(0, 0, 0);
	rgb[0] = new Number(frm.txtRGB_Red.value);
	rgb[1] = new Number(frm.txtRGB_Green.value);
	rgb[2] = new Number(frm.txtRGB_Blue.value);
	
	if(rgb[0] > 255 || isNaN(rgb[0]) || rgb[0] != Math.round(rgb[0]))
	{
		rgb[0] = 255;
		frm.txtRGB_Red.value = 255;
		alert(formatString(msg.BadNumber, 0, 255));
	}
	if(rgb[1] > 255 || isNaN(rgb[1]) || rgb[1] != Math.round(rgb[1]))
	{
		rgb[1] = 255;
		frm.txtRGB_Green.value = 255;
		alert(formatString(msg.BadNumber, 0, 255));
	}
	if(rgb[2] > 255 || isNaN(rgb[2]) || rgb[2] != Math.round(rgb[2]))
	{
		rgb[2] = 255;
		frm.txtRGB_Blue.value = 255;
		alert(formatString(msg.BadNumber, 0, 255));
	}
	return rgb;
}
function Form_Set_Rgb(rgb)
{
	frm.txtRGB_Red.value = rgb[0];
	frm.txtRGB_Green.value = rgb[1];
	frm.txtRGB_Blue.value = rgb[2];
}
function SetupCursors(e)
{
	var hsb = Form_Get_Hsb();
	var rgb = Form_Get_Rgb();
	if(RgbToYuv(rgb)[0] >= .5) SetGradientPositionDark();
	else SetGradientPositionLight();
	if(e.target != null)
	{
		if(e.target.id == "pnlGradient_Top") return;
		if(e.target.id == "pnlVertical_Top") return;
	}
	var x;
	var y;
	var z;

	if(ColorMode >= 0 && ColorMode <= 2)
		for(var i = 0; i < 3; i++)
			hsb[i] *= 255;

	switch(ColorMode)
	{
		case 0:
			x = hsb[1];
			y = hsb[2];
			z = hsb[0] == 0 ? 1 : hsb[0];
			break;
		case 1:
			x = hsb[0] == 0 ? 1 : hsb[0];
			y = hsb[2];
			z = hsb[1];
			break;
		case 2:
			x = hsb[0] == 0 ? 1 : hsb[0];
			y = hsb[1];
			z = hsb[2];
			break;
	}

	y = 255 - y;
	z = 255 - z;
	
	SetBgPosition(document.getElementById("pnlGradientPosition"), x - 5, y - 5);
	document.getElementById("pnlVerticalPosition").style.top = (z+27) + "px";
}
function SetupGradients()
{
	var hsb = Form_Get_Hsb();
	var rgb = Form_Get_Rgb();
	switch(ColorMode)
	{
		case 0:
			SetBg(document.getElementById("pnlGradientHsbHue_Hue"), RgbToHex(HueToRgb(hsb[0])));
			break;
		case 1:
			SetBg(document.getElementById("pnlVerticalHsbSaturation_Hue"), RgbToHex(HsbToRgb(new Array(hsb[0], 1, hsb[2]))));
			break;
		case 2:
			SetBg(document.getElementById("pnlVerticalHsbSaturation_Hue"), RgbToHex(HsbToRgb(new Array(hsb[0], hsb[1], 1))));
			break;
		default:
	}
}
function SetGradientPositionDark()
{
	if(GradientPositionDark) return;
	GradientPositionDark = true;
	document.getElementById("pnlGradientPosition").style.backgroundImage = "url(images/cpns_GradientPositionDark.gif)";
}
function SetGradientPositionLight()
{
	if(!GradientPositionDark) return;
	GradientPositionDark = false;
	document.getElementById("pnlGradientPosition").style.backgroundImage = "url(images/cpns_GradientPositionLight.gif)";
}
function pnlGradient_Top_Click(e)
{
	e.cancelBubble = true;
	SetGradientPosition(e, e.pageX - 5, e.pageY - 5);
	document.getElementById("pnlGradient_Top").className = "GradientNormal";
	_down = false;
}
var _down = false;
function pnlGradient_Top_MouseMove(e)
{
	e.cancelBubble = true;
	if(!_down) return;
	SetGradientPosition(e, e.pageX - 5, e.pageY - 5);
}
function pnlGradient_Top_MouseDown(e)
{
	e.cancelBubble = true;
	_down = true;
	SetGradientPosition(e, e.pageX - 5, e.pageY - 5);
	document.getElementById("pnlGradient_Top").className = "GradientFullScreen";
}
function pnlGradient_Top_MouseUp(e)
{
	_down = false;
	e.cancelBubble = true;
	SetGradientPosition(e, e.pageX - 5, e.pageY - 5);
	document.getElementById("pnlGradient_Top").className = "GradientNormal";
}
function Document_MouseUp()
{
	e.cancelBubble = true;
	document.getElementById("pnlGradient_Top").className = "GradientNormal";
}
function SetVerticalPosition(e, z)
{
	var z=z-POSITIONADJUSTZ;
	
	if(z < 27) z = 27;
	if(z > 282) z = 282;
	document.getElementById("pnlVerticalPosition").style.top = z + "px";
	z = 1 - ((z - 27) / 255);

	switch(ColorMode)
	{
		case 0:
			if(z == 1) z = 0;
			frm.txtHSB_Hue.value = Math.round(z * 360);
			Hsb_Changed(e);
			break;
		case 1:
			frm.txtHSB_Saturation.value = Math.round(z * 100);
			Hsb_Changed(e);
			break;
		case 2:
			frm.txtHSB_Brightness.value = Math.round(z * 100);
			Hsb_Changed(e);
			break;
	}
}
function pnlVertical_Top_Click(e)
{
	SetVerticalPosition(e, e.pageY - 5);
	e.cancelBubble = true;
}
function pnlVertical_Top_MouseMove(e)
{
	if(!window._isverdown)return;
	if(e.which != 1) return;
	SetVerticalPosition(e, e.pageY - 5);
	e.cancelBubble = true;
}
function pnlVertical_Top_MouseDown(e)
{
	window._isverdown=true;
	SetVerticalPosition(e, e.pageY - 5);
	e.cancelBubble = true;
}
function pnlVertical_Top_MouseUp(e)
{
	window._isverdown=false;
	SetVerticalPosition(e, e.pageY - 5);
	e.cancelBubble = true;
}


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
function GetQuery(name)
{
	var i = 0;
	while(window.location.search.indexOf(name + "=", i) != -1)
	{
		var value = window.location.search.substr(window.location.search.indexOf(name + "=", i));
		value = value.substr(name.length + 1);
		if(value.indexOf("&") != -1)
			if(value.indexOf("&") == 0)
				value = "";
			else
				value = value.substr(0, value.indexOf("&"));
		return unescape(value);
	}
	return "";
}
function RgbIsWebSafe(rgb)
{
	var hex = RgbToHex(rgb);
	for(var i = 0; i < 3; i++)
		if("00336699CCFF".indexOf(hex.substr(i*2, 2)) == -1) return false;
	return true;
}
function RgbToWebSafeRgb(rgb)
{
	var safeRgb = new Array(rgb[0], rgb[1], rgb[2]);
	if(RgbIsWebSafe(rgb)) return safeRgb;
	var safeValue = new Array(0x00, 0x33, 0x66, 0x99, 0xCC, 0xFF);	
	for(var i = 0; i < 3; i++)
		for(var j = 1; j < 6; j++)
			if(safeRgb[i] > safeValue[j-1] && safeRgb[i] < safeValue[j])
			{
				if(safeRgb[i] - safeValue[j-1] > safeValue[j] - safeRgb[i]) 
					safeRgb[i] = safeValue[j];
				else
					safeRgb[i] = safeValue[j-1];
				break;
			}
	return safeRgb;
}
function RgbToYuv(rgb)
{
	var yuv = new Array();
	
	yuv[0] = (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) / 255;
	yuv[1] = (rgb[0] * -0.169 + rgb[1] * -0.332 + rgb[2] * 0.500 + 128) / 255;
	yuv[2] = (rgb[0]* 0.500 + rgb[1] * -0.419 + rgb[2] * -0.0813 + 128) / 255;
	
	return yuv;
}
function RgbToHsb(rgb)
{
	var sRgb = new Array(rgb[0], rgb[1], rgb[2]);
	var min = new Number(1);
	var max = new Number(0);
	var delta = new Number(1);
	var hsb = new Array(0, 0, 0);
	var deltaRgb = new Array();

	for(var i = 0; i < 3; i++)
	{
		sRgb[i] = rgb[i] / 255;
		if(sRgb[i] < min) min = sRgb[i];
		if(sRgb[i] > max) max = sRgb[i];
	}

	delta = max - min;
	hsb[2] = max;

	if(delta == 0) return hsb;

	hsb[1] = delta / max;

	for(var i = 0; i < 3; i++)
		deltaRgb[i] = (((max - sRgb[i]) / 6) + (delta / 2)) / delta;

	if (sRgb[0] == max)
		hsb[0] = deltaRgb[2] - deltaRgb[1];
	else if (sRgb[1] == max)
		hsb[0] = (1 / 3) + deltaRgb[0] - deltaRgb[2];
	else if (sRgb[2] == max)
		hsb[0] = (2 / 3) + deltaRgb[1] - deltaRgb[0];

	if(hsb[0] < 0)
		hsb[0] += 1;
	else if(hsb[0] > 1)
		hsb[0] -= 1;
	return hsb;
}
function HsbToRgb(hsb)
{
	var rgb = HueToRgb(hsb[0]);
	var s = hsb[2] * 255;

	for(var i = 0; i < 3; i++)
	{
		rgb[i] = rgb[i] * hsb[2];
		rgb[i] = ((rgb[i] - s) * hsb[1]) + s;
		rgb[i] = Math.round(rgb[i]);
	}
	return rgb;
}
function RgbToHex(rgb)
{
	var hex = new String();
	
	for(var i = 0; i < 3; i++)
	{
		rgb[2 - i] = Math.round(rgb[2 - i]);
		hex = rgb[2 - i].toString(16) + hex;
		if(hex.length % 2 == 1) hex = "0" + hex;
	}
	
	return hex.toUpperCase();
}
function HexToRgb(hex)
{
	var rgb = new Array();
	for(var i = 0; i < 3; i++)
		rgb[i] = new Number("0x" + hex.substr(i * 2, 2));
	return rgb;	
}
function HueToRgb(hue)
{
	var degrees = hue * 360;
	var rgb = new Array(0, 0, 0);
	var percent = (degrees % 60) / 60;
	
	if(degrees < 60)
	{
		rgb[0] = 255;
		rgb[1] = percent * 255;
	}
	else if(degrees < 120)
	{
		rgb[1] = 255;
		rgb[0] = (1 - percent) * 255;
	}
	else if(degrees < 180)
	{
		rgb[1] = 255;
		rgb[2] = percent * 255;
	}
	else if(degrees < 240)
	{
		rgb[2] = 255;
		rgb[1] = (1 - percent) * 255;
	}
	else if(degrees < 300)
	{
		rgb[2] = 255;
		rgb[0] = percent * 255;
	}
	else if(degrees < 360)
	{
		rgb[0] = 255;
		rgb[2] = (1 - percent) * 255;
	}
	
	return rgb;
}
function CheckHexSelect()
{
	if(window.do_select&&window.frm&&frm.txtHex)
	{
		var color="#"+frm.txtHex.value;
		if(color.length==7)
		{
			if(window.__cphex!=color)
			{
				window.__cphex=color;
				window.do_select(color)
			}
		}
	}
}
setInterval(CheckHexSelect,10);