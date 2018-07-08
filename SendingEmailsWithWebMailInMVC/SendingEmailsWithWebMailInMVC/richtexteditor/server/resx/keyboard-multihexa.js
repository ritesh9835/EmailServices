var caps=0, lock=0, hexchars="0123456789ABCDEF", accent="0000", clavdeb=0
var clav=new Array();j=0;for (i in Maj){clav[j]=i;j++}
var ns6=((!document.all)&&(document.getElementById))
var ie=document.all

var langue=getCk();if (langue==""){langue=clav[clavdeb]}
CarMaj=Maj[langue].split("|");CarMin=Min[langue].split("|")

/*clavier*/
var posClavierLeft=0, posClavierTop=0
if (ns6){posClavierLeft=0;posClavierTop=80}
else if (ie){posClavierLeft=0;posClavierTop=80}
tracer("fond",posClavierLeft,posClavierTop,'<img src="images/multiclavier.gif" width=404 height=152 border="0"><br />',"sign")

/*touches*/
var posX=new Array(0,28,56,84,112,140,168,196,224,252,280,308,336,42,70,98,126,154,182,210,238,266,294,322,350,50,78,106,134,162,190,218,246,274,302,330,64,92,120,148,176,204,232,260,288,316,28,56,84,294,322,350)
var posY=new Array(14,14,14,14,14,14,14,14,14,14,14,14,14,42,42,42,42,42,42,42,42,42,42,42,42,70,70,70,70,70,70,70,70,70,70,70,98,98,98,98,98,98,98,98,98,98,126,126,126,126,126,126)
var nbTouches=52
for (i=0;i<nbTouches;i++){
	CarMaj[i]=((CarMaj[i]!="0000")?(fromhexby4tocar(CarMaj[i])):"")
	CarMin[i]=((CarMin[i]!="0000")?(fromhexby4tocar(CarMin[i])):"")
	if (CarMaj[i]==CarMin[i].toUpperCase()){
		cecar=((lock==0)&&(caps==0)?CarMin[i]:CarMaj[i]) 
		tracer("car"+i,posClavierLeft+6+posX[i],posClavierTop+3+posY[i],cecar,((dia[hexa(cecar)]!=null)?"simpledia":"simple"))
		tracer("majus"+i,posClavierLeft+15+posX[i],posClavierTop+1+posY[i],"&nbsp;","double")
		tracer("minus"+i,posClavierLeft+3+posX[i],posClavierTop+9+posY[i],"&nbsp;","double")
	}
	else{
		tracer("car"+i,posClavierLeft+6+posX[i],posClavierTop+3+posY[i],"&nbsp;","simple")
		cecar=CarMin[i]
		tracer("minus"+i,posClavierLeft+3+posX[i],posClavierTop+9+posY[i],cecar,((dia[hexa(cecar)]!=null)?"doubledia":"double"))
		cecar=CarMaj[i]
		tracer("majus"+i,posClavierLeft+15+posX[i],posClavierTop+1+posY[i],cecar,((dia[hexa(cecar)]!=null)?"doubledia":"double"))
	}
}
/*touches de fonctions*/
var actC1=new Array(0,371,364,0,378,0,358,0,344,0,112,378)
var actC2=new Array(0,0,14,42,42,70,70,98,98,126,126,126)
var actC3=new Array(32,403,403,39,403,47,403,61,403,25,291,403)
var actC4=new Array(11,11,39,67,67,95,95,123,123,151,151,151)
var act  =new Array("kb-","kb+","Delete","Clear","Back","CapsLock","Enter","Shift","Shift","<|<","Space",">|>")
var effet=new Array("clavscroll(-3)","clavscroll(3)","faire(\"del\")","RAZ()","faire(\"bck\")","bloq()","faire(\"\\n\")","haut()","haut()","faire(\"ar\")","faire(\" \")","faire(\"av\")")
var nbActions=12
for (i=0;i<nbActions;i++){tracer("act"+i,posClavierLeft+1+actC1[i],posClavierTop-1+actC2[i],act[i],"action")}
/*navigation*/
var clavC1=new Array(35,119,203,287)
var clavC2=new Array(0,0,0,0)
var clavC3=new Array(116,200,284,368)
var clavC4=new Array(11,11,11,11)
for (i=0;i<4;i++){tracer("clav"+i,posClavierLeft+5+clavC1[i],posClavierTop-1+clavC2[i],clav[i],"clavier")}
/*zones reactives*/
tracer("masque",posClavierLeft,posClavierTop,'<img src="images/1x1.gif" width=404 height=152 border="0" usemap="#clavier">')
document.write('<map name="clavier">')
for (i=0;i<nbTouches;i++){document.write('<area coords="'+posX[i]+','+posY[i]+','+(posX[i]+25)+','+(posY[i]+25)+'" href="javascript:void(0)" onClick=\'javascript:ecrire('+i+')\'>')}
for (i=0;i<nbActions;i++){document.write('<area coords="'+actC1[i]+','+actC2[i]+','+actC3[i]+','+actC4[i]+'" href="javascript:void(0)" onClick=\'javascript:'+effet[i]+'\'>')}
for (i=0;i<4;i++){document.write('<area coords="'+clavC1[i]+','+clavC2[i]+','+clavC3[i]+','+clavC4[i]+'" href=\'javascript:charger('+i+')\'>')}
document.write('</map>')

/*fonctions*/
function ecrire(i){
	txt=rechercher()+"|";subtxt=txt.split("|")
	ceci=(lock==1)?CarMaj[i]:((caps==1)?CarMaj[i]:CarMin[i])
	if (test(ceci)){subtxt[0]+=cardia(ceci);distinguer(false)}
	else if(dia[accent]!=null&&dia[hexa(ceci)]!=null){distinguer(false);accent=hexa(ceci);distinguer(true)}
	else if(dia[accent]!=null){subtxt[0]+=fromhexby4tocar(accent)+ceci;distinguer(false)}
	else if(dia[hexa(ceci)]!=null){accent=hexa(ceci);distinguer(true)}
	else {subtxt[0]+=ceci}
	txt=subtxt[0]+"|"+subtxt[1]
	afficher(txt)
	if (caps==1){caps=0;MinusMajus()}
}
function faire(ceci){
	txt=rechercher()+"|";subtxt=txt.split("|")
	l0=subtxt[0].length
	l1=subtxt[1].length
	c1=subtxt[0].substring(0,(l0-2))
	c2=subtxt[0].substring(0,(l0-1))
	c3=subtxt[1].substring(0,1)
	c4=subtxt[1].substring(0,2)
	c5=subtxt[0].substring((l0-2),l0)
	c6=subtxt[0].substring((l0-1),l0)
	c7=subtxt[1].substring(1,l1)
	c8=subtxt[1].substring(2,l1)
	if(dia[accent]!=null){if(ceci==" "){ceci=fromhexby4tocar(accent)}distinguer(false)}
	switch (ceci){
	case("av") :if(escape(c4)!="%0D%0A"){txt=subtxt[0]+c3+"|"+c7}else{txt=subtxt[0]+c4+"|"+c8}break
	case("ar") :if(escape(c5)!="%0D%0A"){txt=c2+"|"+c6+subtxt[1]}else{txt=c1+"|"+c5+subtxt[1]}break
	case("bck"):if(escape(c5)!="%0D%0A"){txt=c2+"|"+subtxt[1]}else{txt=c1+"|"+subtxt[1]}break
	case("del"):if(escape(c4)!="%0D%0A"){txt=subtxt[0]+"|"+c7}else{txt=subtxt[0]+"|"+c8}break
	default:txt=subtxt[0]+ceci+"|"+subtxt[1];break
	}
	afficher(txt)
}
function RAZ(){txt="";if(dia[accent]!=null){distinguer(false)}afficher(txt)}
function haut(){caps=1;MinusMajus()}
function bloq(){lock=(lock==1)?0:1;MinusMajus()}

/*fonctions de traitement du clavier*/
function tracer(nom,gauche,haut,ceci,classe){ceci="<span class="+classe+">"+ceci+"</span>";document.write('<div id="'+nom+'" >'+ceci+'</div>');if (ns6){document.getElementById(nom).style.left=gauche+"px";document.getElementById(nom).style.top=haut+"px";}else if (ie){document.all(nom).style.left=gauche;document.all(nom).style.top=haut}}
function retracer(nom,ceci,classe){ceci="<span class="+classe+">"+ceci+"</span>";if (ns6){document.getElementById(nom).innerHTML=ceci}else if (ie){doc=document.all(nom);doc.innerHTML=ceci}}
function clavscroll(n){
	clavdeb+=n
	if (clavdeb<0){clavdeb=0}
	if (clavdeb>clav.length-4){clavdeb=clav.length-4}
	for (i=clavdeb;i<clavdeb+4;i++){retracer("clav"+(i-clavdeb),clav[i],"clavier")}
	if (clavdeb==0){retracer("act0","&nbsp;","action")}else {retracer("act0",act[0],"action")}
	if (clavdeb==clav.length-4){retracer("act1","&nbsp;","action")}else {retracer("act1",act[1],"action")}
}
function charger(i){
	langue=clav[i+clavdeb];setCk(langue);accent="0000"
	CarMaj=Maj[langue].split("|");CarMin=Min[langue].split("|")
	for (i=0;i<nbTouches;i++){
		CarMaj[i]=((CarMaj[i]!="0000")?(fromhexby4tocar(CarMaj[i])):"")
		CarMin[i]=((CarMin[i]!="0000")?(fromhexby4tocar(CarMin[i])):"")
		if (CarMaj[i]==CarMin[i].toUpperCase()){
			cecar=((lock==0)&&(caps==0)?CarMin[i]:CarMaj[i]) 
			retracer("car"+i,cecar,((dia[hexa(cecar)]!=null)?"simpledia":"simple"))
			retracer("minus"+i,"&nbsp;")
			retracer("majus"+i,"&nbsp;")
		}
		else{
			retracer("car"+i,"&nbsp;")
			cecar=CarMin[i]
			retracer("minus"+i,cecar,((dia[hexa(cecar)]!=null)?"doubledia":"double"))
			cecar=CarMaj[i]
			retracer("majus"+i,cecar,((dia[hexa(cecar)]!=null)?"doubledia":"double"))
		}
	}
}
function distinguer(oui){
	for (i=0;i<nbTouches;i++){
		if (CarMaj[i]==CarMin[i].toUpperCase()){
			cecar=((lock==0)&&(caps==0)?CarMin[i]:CarMaj[i]) 
			if(test(cecar)){retracer("car"+i,oui?(cardia(cecar)):cecar,oui?"simpledia":"simple")}
		}
		else{
			cecar=CarMin[i]
			if(test(cecar)){retracer("minus"+i,oui?(cardia(cecar)):cecar,oui?"doubledia":"double")}
			cecar=CarMaj[i]
			if(test(cecar)){retracer("majus"+i,oui?(cardia(cecar)):cecar,oui?"doubledia":"double")}
		}
	}
	if (!oui){accent="0000"}
}
function MinusMajus(){
	for (i=0;i<nbTouches;i++){
		if (CarMaj[i]==CarMin[i].toUpperCase()){
			cecar=((lock==0)&&(caps==0)?CarMin[i]:CarMaj[i]) 
			retracer("car"+i,(test(cecar)?cardia(cecar):cecar),((dia[hexa(cecar)]!=null||test(cecar))?"simpledia":"simple"))
		}
	}
}
function test(cecar){return(dia[accent]!=null&&dia[accent][hexa(cecar)]!=null)}
function cardia(cecar){return(fromhexby4tocar(dia[accent][hexa(cecar)]))}
function fromhex(inval){out=0;for (a=inval.length-1;a>=0;a--){out+=Math.pow(16,inval.length-a-1)*hexchars.indexOf(inval.charAt(a))}return out}
function fromhexby4tocar(ceci){out4=new String();for (l=0;l<ceci.length;l+=4){out4+=String.fromCharCode(fromhex(ceci.substring(l,l+4)))}return out4}
function tohex(inval){return hexchars.charAt(inval/16)+hexchars.charAt(inval%16)}
function tohex2(inval){return tohex(inval/256)+tohex(inval%256)}
function hexa(ceci){out="";for (k=0;k<ceci.length;k++){out+=(tohex2(ceci.charCodeAt(k)))}return out}
function getCk(){fromN=document.cookie.indexOf("langue=")+0;if((fromN)!=-1){fromN+=7;toN=document.cookie.indexOf(";",fromN)+0;if(toN==-1){toN=document.cookie.length}return unescape(document.cookie.substring(fromN,toN))}return ""}
function setCk(inval){if(inval!=null){exp=new Date();time=365*60*60*24*1000;exp.setTime(exp.getTime()+time);document.cookie=escape("langue")+"="+escape(inval)+"; "+"expires="+exp.toGMTString()}}
