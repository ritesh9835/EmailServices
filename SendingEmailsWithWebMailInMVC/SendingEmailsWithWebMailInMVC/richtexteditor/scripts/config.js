// this file stores the default settings for RichTextEditor
// some settings are overrided by server settings
window.RTE_Configuration =
{
	version: "2014040302",

	//some properties , skin&toolbar etc, always be overrided by server side code

	skin: "office2007blue", //sets the skin for how the toolbar is draw
	toolbar: "full",//auto configures the toolbar with a set of buttons

	autofocus: false,//specifies whether the editor grabs focus when the page loads
	readonly: false,//specifies whether editor is read-only
	showrulers: false,//specifies whether to display horizontal and/or vertical rulers 
	showlinkbar: false,//specifies whether to display the link editing box
	showtoolbar: true,//specifies whether to display the editor toolbar
	showtoolbar_code: true,//specifies whether to display the code mode toolbar
	showtoolbar_view: true,//specifies whether to display the preview toolbar 	
	showbottombar: true,//specifies whether to display the editor bottom bar 		
	showeditmode: true,//specifies whether to display the edit mode button in the bottom bar
	showcodemode: true,//specifies whether to display the code mode button in the bottom bar 
	showpreviewmode: true,//specifies whether to display the preview mode button in the bottom bar	
	showtaglist: true,//specifies whether to display the tag selector in the bottom bar
	showzoomview: true,//specifies whether to display a zoom factor drop down in the bottom bar
	showstatistics: true,//specifies whether to display the content statistics in the bottom bar
	showresizecorner: true,//specifies whether to display the resize handle at the corner of the editor	
	resize_mode: "resizeboth",	//"disabled","autoadjustheight","resizeheight","resizewidth","resizeboth" gets or sets the resize mode	
	enabledragdrop: true,//specifies whether to enable drag-and-drop support for the editor
	enablecontextmenu: true,//specifies whether to display the context menu
	enableobjectresizing: true,//specifies whether to enable the object resizing	
	autoparseclasses: true,//specifies whether or not the Editor should automatically parse the CSS classes from ContentCss	
	savebuttonmode: "submit",	//specifies the default behavior for save button
	initialtabmode: "edit",	//"edit","code","view"
	initialfullscreen: false,//specifies whether the Editor is used in a full-screen mode
	initialtoggleborder: true,//specifies the ToggleBorder state
	maxhtmllength: 0,//specifies the maximum number of characters including the HTML tags allowed. Default is 0, indicating no maximum
	maxtextlength: 0,//specifies the maximum number of characters excluding the HTML tags allowed. Default is 0, indicating no maximum
	editorbodyclass: "",//specifies the class name that will be added to the body of the editor document
	editorbodystyle: "",//specifies the css style that will be applied to the body of the editor document
	insertparagraph: 'p',//default tag for insertparagraph
	unlistparagraph: 'p',//default tag for unlistparagraph
	justifyparagraph: 'p',//default tag for justifyparagraph
	enterkeytag: 'p',//default tag for enterkeytag
	shiftenterkeytag: 'br',//default tag for shiftenterkeytag	
	divisblockforpbr: true,	//editor will not try to break div , if the enter key tag set to p or br
	insertbodyline: '<p>&nbsp;</p>',//default code for inserttopline
	indentoutdentsize: 40,//by default, editor would use "margin-left:40px" for indentation, increasing its value by 40px for each new indentation.
	tabkeyhtml: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',	// '<span style="white-space:pre">	</span>',  specifies the number of spaces to be inserted when the user hits the "tab" key. 
	codetabindent: '    ',//default 4 spaces for code indentation	
	tabtonextcell: true,// when pressing the tab key the cursor jumps to the next cell. set to 'select' for selecting content of the next td.
	paste_default_command: "confirmword",	// "disabled","paste","pasteword","confirmword","pastetext","pastepuretext"
	pastetext_whitespace: 'auto',	// 'auto',true,false
	pastetext_tabspaces: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',


	// for past from word , the list item
	paste_replacelist: { "&#183;": "<span style='font-family:webdings'>=</span>" },

	paste_removestylelist: "none",
	inserttemplate_removestylelist: "none",
	//paste_removestylelist:  "font-family,line-height,text-decoration,text-align,text-underline,letter-spacing,line-height,padding,border",
	//inserttemplate_removestylelist:  "font-family,line-height,text-decoration,text-align,text-underline,letter-spacing,line-height,padding,border",


	format_painter_list: "subscript,superscript,bold,italic,underline,linethrough,overline,forecolor,backcolor,fontsize,fontname,mark", //which format the painter shall collect from document
	format_painter_preclear: true,	//remove format before apply the new style
	format_subscript: "<sub>",	//or "<span style='vertical-align:sub;font-size:0.8em'>", //default tag for subscript
	format_superscript: "<sup>",	//or "<span style='vertical-align:super;font-size:0.8em'>", //default tag for superscript
	format_bold: "<strong>",	//or "<b>" or "<span style='font-weight:bold'>",  //default behavior for bold
	format_italic: "<em>",		//or "<i>" or "<span style='font-style:italic'>", //default behavior for italic
	format_underline: "<span style='text-decoration:underline'>",	//or "<u>", //default behavior for underline
	format_linethrough: "<span style='text-decoration:line-through'>",//or "<strike>", or "<s>" //default behavior for linethrough
	format_overline: "<span style='text-decoration:overline'>",//default behavior for overline	
	format_forecolor: "<span style='color:%1'>",
	format_backcolor: "<span style='background-color:%1'>",
	format_fontsize: "<span style='font-size:%1'>",
	format_fontname: "<span style='font-family:%1'>",
	format_cssclass: "<span class='%1'>",
	format_cssstyle: "<span style='%1'>",
	format_mark: "<mark>",
	default_link_text: "New Link Text",
	default_forecolor: "#ff0000",
	default_backcolor: "#ffff00",
	default_table_cols: 6,
	default_table_rows: 4,
	default_code_table: "<table cellspacing='2' cellpadding='2' style='width:480px'></table>",	// default table attributes
	default_code_tr: "<tr></tr>",
	default_code_td: "<td>&nbsp;</td>",
	default_code_box: "<div>Type text here..</div>",
	default_code_layer: "<div style='position:absolute;left:300px;top:100px;height:100px;width:100px;overflow:visible;'>&nbsp;</div>",
	default_code_audio: "<audio controls='1' preload='1' loop='1' autoplay='1' style='width:320px;height:40px'/>",
	default_code_video: "<video controls='1' preload='1' loop='1' autoplay='1' style='width:320px;height:240px'/>",
	default_code_form: "<form method='POST' enctype='multipart/form-data'><p>&nbsp;</p></form>",
	default_code_textarea: "<textarea style='width:240px;height:120px'></textarea>",
	default_code_inptext: "<input type='text' />",
	default_code_inpfile: "<input type='file' />",
	default_code_inpimage: "<input type='image' />",
	default_code_inpreset: "<input type='reset' />",
	default_code_inpsubmit: "<input type='submit' />",
	default_code_inphidden: "<input type='hidden' />",
	default_code_inppassword: "<input type='password' />",
	default_code_inpbutton: "<input type='button' />",
	default_code_radiobox: "<input type='radio' />",
	default_code_checkbox: "<input type='checkbox' />",
	default_code_button: "<button>Button</button>",
	default_code_dropdown: "<select style='margin:0px;width:120px' />",
	default_code_listbox: "<select style='margin:0px;width:120px;height:120px;' size='8' />",
	default_code_fieldset: "<fieldset><legend>Title</legend><p>Content...</p></fieldset>",
	default_code_details: "<details style='padding:3px;margin:3px;'><summary>Summary</summary><p>Content...</p></details>",
	default_code_blockquote: "<blockquote>", //  class='myblockquote'	
	default_code_printbreak: '<div class="printpagebreak" title="Print Page Break" style="font-size:1px;page-break-before:always;">&nbsp;</div>',

	command_insertdatetime: function () {
		var date = new Date();
		var dval = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
		dval = dval * 1000000 + date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds();
		return String(dval).replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3 $4:$5:$6");
	},

	//full page edit mode key ,	F12=123 , -1 means disable hot key for fullscreen
	event_fullscreenkeycode: 123,

	//set to 5000 to test the loading gif
	loader_loadcodedelay: 0,

	//means richtexteditor/images/loading5.gif
	loader_loadingimage: 'loading5.gif',

	//auto format the source code when switch to source code view ?
	codeview_autoformat: true,//"oneline",

	preview_disabletooltip: false,
	preview_disablefontname: false,
	preview_disablefontsize: false,
	preview_disableforecolor: true,
	preview_disablebackcolor: true,

	fontnamelist: 'Arial,Verdana,Tahoma,Segoe UI,Sans-Serif,Comic Sans MS,Courier New,Georgia,Impact,Lucida Console,Times New Roman,Trebuchet MS,Monospace',
	fontsizelist: '8px,9px,10px,11px,12px,13px,14px,16px,18px,20px,24px,36px',


	colorpicker_forecolor: ["#000000", "#993300", "#333300", "#003300", "#003366", "#000080", "#333399", "#333333",
			"#800000", "#ff6600", "#808000", "#008000", "#008080", "#0000ff", "#666699", "#808080",
			"#ff0000", "#ff9900", "#99cc00", "#339966", "#33cccc", "#3366ff", "#800080", "#999999",
			"#ff00ff", "#ffcc00", "#ffff00", "#00ff00", "#00ffff", "#00ccff", "#993366", "#c0c0c0",
			"#ff99cc", "#ffcc99", "#ffff99", "#ccffcc", "#ccffff", "#99ccff", "#cc99ff", "#ffffff"],

	colorpicker_backcolor: ["#000000", "#993300", "#333300", "#003300", "#003366", "#000080", "#333399", "#333333",
			"#800000", "#ff6600", "#808000", "#008000", "#008080", "#0000ff", "#666699", "#808080",
			"#ff0000", "#ff9900", "#99cc00", "#339966", "#33cccc", "#3366ff", "#800080", "#999999",
			"#ff00ff", "#ffcc00", "#ffff00", "#00ff00", "#00ffff", "#00ccff", "#993366", "#c0c0c0",
			"#ff99cc", "#ffcc99", "#ffff99", "#ccffcc", "#ccffff", "#99ccff", "#cc99ff", "#ffffff"],

	colorpicker_othercolor: ["#000000", "#993300", "#333300", "#003300", "#003366", "#000080", "#333399", "#333333",
			"#800000", "#ff6600", "#808000", "#008000", "#008080", "#0000ff", "#666699", "#808080",
			"#ff0000", "#ff9900", "#99cc00", "#339966", "#33cccc", "#3366ff", "#800080", "#999999",
			"#ff00ff", "#ffcc00", "#ffff00", "#00ff00", "#00ffff", "#00ccff", "#993366", "#c0c0c0",
			"#ff99cc", "#ffcc99", "#ffff99", "#ccffcc", "#ccffff", "#99ccff", "#cc99ff", "#ffffff"],

	htmlcode_forcehexformat: true,

	codeview_autoadjustmode: "normalize,indent",

	//this indexes matchs the images/all.png
	//comment it , or set to null/empty to disable the all.png solution
	//if you want to modify the context manually, please search our blog about 'allimageindexdata' and 'joinallimages'
	allimageindexdata: 'save,newdoc,print,find,fit,cleanup,unformat,spell,cut,copy,paste,pastetext,pasteword,delete,undo,redo,insertpagebreak,insertdate,timer,specialchar,keyboard,div,layer,groupbox,image,gallery,flash,media,document,template,youtube,insrow_t,insrow_b,delrow,inscol_l,inscol_r,delcol,inscell,delcell,row,cell,mrgcell,spltcell,break,paragraph,textarea,textbox,passwordfield,hiddenfield,listbox,dropdownbox,optionbutton,checkbox,imagebutton,submit,reset,pushbutton,page,bold,italic,under,left,center,right,justifyfull,justifynone,numlist,bullist,indent,outdent,superscript,subscript,strike,ucase,lcase,rule,link,unlink,anchor,imagemap,borders,selectall,selectnone,help,code,overline,forecolor,backcolor,inserttable,insertform,blockquote,formatpainter,lineheight,dir_ltr,dir_rtl,preview,design,htmlview,map,topline,bottomline,html5',
	//whether load the ihtml5.js for html5 browsers
	useimagedatacache: false,

	//for SiteRelative, 
	forcerelative: true,

	syncloadtoolbar: false,

	floatbox_leaveclosetimer: 500,

	floatbox_showloaingimage: true,

	fullscreen_zindex: 100011,
	ctrltool_zindex: 100022,
	dialog_zindex: 110011,	//don't greater then 123450 , otherwise uploader will not works

	//load the plugin into memory and activate its default function
	preloadplugins: "controldesigner,googlemap,insertyoutube,elementtoolbar,syntaxhighlighter",	// ,

	htmlfilter_disabledlist: "",

	editor_player_url: null,

	editor_help_url: null,

	toolbars:
	{
		"ribbon": "<@COMMON,ribbonpaste,pastetext,pasteword,{save,new,print,spellcheck}{cut,copy,delete,find}{undo,redo|formatpainter}><@FORMAT,[fontname,fontsize]{bold,italic,underlinemenu|forecolor,backcolor}{superscript,subscript,changecase|removeformat,cleancode,selectall}><@PARAGRAPHS,[paragraphs,styles]{justifymenu,lineheight,ltr,rtl,insertlinemenu}{insertorderedlist,insertunorderedlist,outdent,indent,insertblockquote}><@INSERT,ribbontable,insertgallery,insertimage,{insertform,insertbox,insertlayer,insertfieldset,pageproperties,help,toggleborder,fullscreen}{insertlink,unlink,insertanchor,insertimagemap,insertdate,insertchars,virtualkeyboard}{inserttemplate,insertdocument,insertvideo,syntaxhighlighter,insertyoutube,html5,googlemap}>",
		"full": "{save,new,print,find,spellcheck}{cut,copy,paste,pastetext,pasteword,delete}{undo,redo}{formatpainter}{inserttable,insertbox,insertlayer,insertfieldset}{insertform}{insertchars,syntaxhighlighter,virtualkeyboard,insertdate}{pageproperties,fullscreen}/{bold,italic,underlinemenu,justifymenu,forecolor,backcolor}{lineheight,ltr,rtl}{insertlinemenu}{superscript,subscript,changecase}{insertorderedlist,insertunorderedlist,outdent,indent,insertblockquote}{removeformat,cleancode}{help,toggleborder,selectall}/[paragraphs,styles][fontname,fontsize]{insertlink,unlink,insertanchor,insertimagemap}{insertgallery,insertimage,insertvideo,inserttemplate,insertdocument,insertyoutube,html5,googlemap}",
		"light": "{cut,copy,paste,pastetext,pasteword,delete}{undo,redo}{spellcheck,find}{formatpainter}{insertlink,unlink}{insertlinemenu}{inserttable,insertbox}{insertgallery,insertimage,insertdocument,insertvideo,insertyoutube,inserttemplate}{removeformat,cleancode}{help,toggleborder,selectall}{fullscreen}/[paragraphs,styles][fontname,fontsize]{bold,italic,underlinemenu}{forecolor,backcolor}{superscript,subscript,changecase}{justifymenu,insertorderedlist,insertunorderedlist,outdent,indent,insertblockquote}",
		"forum": "{bold,italic,underline}{forecolor,backcolor,fontname,fontsize}{justifymenu}{insertorderedlist,insertunorderedlist,outdent,indent}{insertlink,insertgallery,insertimage,insertblockquote,syntaxhighlighter}{unlink,removeformat}{fullscreen}",
		"email": "{bold,italic,underline,fontname,fontsize,forecolor,backcolor,insertlink,unlink,insertorderedlist,insertunorderedlist,outdent,indent,insertblockquote,justifyleft,justifycenter,justifyright,removeformat}",
		"minimal": "{bold,italic,underline,justifyleft,justifycenter,justifyright}",
		"none": ""
	},

	toolbaritems: "",
	disableditems: "",
	googlemap_saveinsession: true,
	googlemap_initialplace: "USA",
	googlemap_initialzoom: 4,

	antispamemailencoder: true,

	allowbrowserspellcheck: false,

	//MISC UI BEHAVIOR:

	dialog_tag_a_disablesynclinktotext: false,

	plugin_taglist_hidepreviousitems: false,

	////others
	//urltype	:	null,	//"siterelative","absolute"
	//textdirection	:	null,	//"ltr","rtl"	

	'': ''
}

// The settings in this file will apply all instances of your editor objects.
// When you upgrade your RTE with newer versions, this file may be overwritten. To avoid losting the changes, we suggest you use the following method overwrite the setting.
// RTE_Configuration.enterkeytag="br";
// Just copy the code back to config.js after upgrading.





