var TMSGCCW;
(function(){
	'use strict';
	TMSGCCW = {
		fromCurrency: "",
		toCurrency: "",
		language: "cn",
		exchangeRate: -1,
		getExchangeRate: function(fromCurrency,toCurrency){
			tipStart.innerHTML = "« [正在查询当前汇率]";
			console.log("√ ["+(new Date).toLocaleString()+"] 开始查询汇率：https://www.google.com/ig/calculator?hl="+this.language+"&q=100"+fromCurrency+"=?"+toCurrency);
			var date = new Date;
			var randSeed = date.getUTCFullYear().toString()+date.getUTCMonth()+date.getDate()+date.getHours();// parseInt(9999999*Math.random()) 防止读缓存
			$.ajax({type: 'GET', url: "http://www.google.com/ig/calculator", data: {hl:this.language,q:"100"+fromCurrency+"=?"+toCurrency,randSeed:randSeed}, success: function(result){
				console.log("["+(new Date).toLocaleString()+"] 汇率查询完成。")
				var quickExp = /([A-Za-z][A-Za-z0-9_]+)\s*:\s*"([^"]*)\"/g;
				var rtn = new Object;
				rtn.fromCurrency = fromCurrency;
				rtn.toCurrency = toCurrency;
				do {
					var match = quickExp.exec(result);
					if(match) rtn[match[1]] = match[2];
				} while (match) /* {lhs: "100美元",rhs: "622.560342 人民币",error: "",icc: true} */
				var quickExp = /(\d+\.{0,1}\d*)/;
				tipStart.innerHTML = "« 将"+rtn.fromCurrency+"换算为"+rtn.toCurrency;
				TMSGCCW.exchangeRate = quickExp.exec(rtn.rhs)[1] / quickExp.exec(rtn.lhs)[1];
				TMSGCCW.fromCurrency = rtn.fromCurrency;
				TMSGCCW.toCurrency = rtn.toCurrency;
				TMSGCCW.showExchangeRate(rtn.lhs + " = " + rtn.rhs);
				TMSGCCW.startConvert();
			}, dataType: "html", error: function(xmlHttpRequest, errMsg) {
				TMSGCCW.showExchangeRate("获取数据出现错误 请检查网络连接 [难道...Google又被墙掉了?]");
				tipStart.innerHTML = "« [查询汇率失败...]";
				TMSGCCW.exchangeRate = -1;
				console.log("× ["+(new Date).toLocaleString()+"] 查询汇率失败："+errMsg);
				console.log(["× 错误详情： ",xmlHttpRequest]);
			}});
		},
		showExchangeRate: function(tipString){
			$("#ExchangeRate").html(tipString);
			$("#imgTable").attr("src","http://www.google.com/finance/chart?q=CURRENCY:"+this.fromCurrency+this.toCurrency+"&tkr=1&p=5Y&chst=cob");
		},
		convert: function(amount){
			try{
				if(this.exchangeRate==-1) return "汇率查询失败";
				var quickExp = /[^\d\.]/;
				if(quickExp.test(amount)) return "输入有误";
				amount *= this.exchangeRate;
				if(quickExp.test(amount)) return "输入有误";
				return amount;
			} catch(ex){
				return "输入有误";
			}
		},
		startConvert: function(){
			if(base_list.value!=TMSGCCW.fromCurrency || target_list.value!=TMSGCCW.toCurrency) TMSGCCW.getExchangeRate(base_list.value,target_list.value);
			target_input.value = TMSGCCW.convert(base_input.value);
			localStorage['fromCurrency']=TMSGCCW.fromCurrency;
			localStorage['toCurrency']=TMSGCCW.toCurrency;
		}
	}
})();
base_list.value = localStorage['fromCurrency']||'USD';
target_list.value = localStorage['toCurrency']||'CNY';
setTimeout(function(){TMSGCCW.startConvert()},500);
target_list.onchange=TMSGCCW.startConvert;
base_input.onkeydown=base_input.onkeypress=base_input.onkeyup=TMSGCCW.startConvert;
base_input.onchange=TMSGCCW.startConvert;
base_input.onclick=function(){if(firstRun) {this.value="";firstRun=false;}}
base_list.onchange=TMSGCCW.startConvert;
tipStart.onclick=TMSGCCW.startConvert;
btnFOB.onclick=TMSGCCW.startConvert;
document.body.oncontextmenu=document.body.onselectstart=document.body.ondragstart=document.body.onsource=function(){window.event.returnValue=false;}
base_input.focus();
var firstRun = true;
var debugFlag = 0;
document.body.onkeypress=function(e) {
  if(document.activeElement!=base_input) {
	if(e.keyCode>=48&&e.keyCode<=57) {
		if(firstRun) {base_input.value="";firstRun=false;}
		base_input.value = base_input.value + (e.keyCode-48).toString();
	} else if(e.keyCode==46) {
		if(firstRun) {base_input.value="";firstRun=false;}
		base_input.value = base_input.value + ".";
	}
  }
  TMSGCCW.startConvert();
}
document.body.onkeydown=function(e) {
	if(document.activeElement!=base_input) {
	if(window.event.keyCode==8) {
		if(firstRun) {base_input.value="";firstRun=false;}
		try{base_input.value = base_input.value.substring(0,base_input.value.length-1);}catch(ex){}
	}
	}
	switch(e.keyCode){
		case 90:debugFlag=1;break;
		case 82:++debugFlag;break;
		case 88:if(++debugFlag==3){document.body.oncontextmenu=document.body.onselectstart=document.body.ondragstart=document.body.onsource=null;adDiv.innerHTML="debuging mode initialized.";}break;
	}
	TMSGCCW.startConvert();
}
var advi = 0;
var adva = ['© 翟小明tinymins<br>数据取自即时 Google Finance','Welcome to my web site:<br>ZhaiYiMing.CoM | 翟一鸣.中国','　　　　微博:weibo.com/zymah<br>QQ:59991021 百度:zymah'];
adDiv.onclick = function(){
	advi++;
	this.innerHTML = adva[advi%adva.length];
	if(advi>9) {
		alert('("= =") 点这么多下不如自己去看看。。。');
		window.open("http://www.zhaiyiming.com/",'newwindow','height=768,width=1366,top=40,left=20,toolbar=no,menubar=no,scrollbars=yes, resizable=yes,location=yes, status=yes'); 
		window.open("http://翟一鸣.中国/","","width=800,height=600"); 
	}
	
}