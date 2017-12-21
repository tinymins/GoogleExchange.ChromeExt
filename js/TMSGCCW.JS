var TMSGCCW;
(function(){
	'use strict';
	TMSGCCW = {
		fromCurrency: undefined,
		toCurrency: undefined,
		language: "cn",
		exchangeRate: -1,
		fromCurrencyList:[],
		toCurrencyList:[],
		config:{
			decimalPlaces:5,
			decimalComplementedWithZero:false,
			fontFamily: "Microsoft YaHei"
		},
		data:function(key,val){
			if(typeof(val)=="undefined") return TMSGCCW.config[key]; else TMSGCCW.config[key]=val;
		},
		currencyList: {
			"USD":"美元",
			"CNY":"人民币",
			"DKK":"丹麦克朗",
			"UAH":"乌克兰格里夫尼亚",
			"UZS":"乌兹别克斯坦苏姆",
			"UGX":"乌干达先令",
			"UYU":"乌拉圭比索",
			"YER":"也门里亚尔",
			"ILS":"以色列新谢克尔",
			"RUB":"俄国卢布",
			"BGN":"保加利亚新列弗",
			"HRK":"克罗地亚库纳",
			"CAD":"加拿大元",
			"HUF":"匈牙利福林",
			"ZAR":"南非兰特",
			"BWP":"博茨瓦纳普拉",
			"QAR":"卡塔尔里亚尔",
			"INR":"印度卢比",
			"IDR":"印度尼西亚盾",
			"KZT":"哈萨克斯坦坚戈",
			"COP":"哥伦比亚比索",
			"CRC":"哥斯达黎加科朗",
			"TRY":"土耳其里拉",
			"TZS":"坦桑尼亚先令",
			"EGP":"埃及镑",
			"RSD":"塞尔维亚第纳尔",
			"SLL":"塞拉利昂利昂",
			"SCR":"塞舌尔卢比",
			"MXN":"墨西哥比索",
			"DOP":"多米尼加比索",
			"VEB":"委内瑞拉博利瓦",
			"NIO":"尼加拉瓜金科多巴",
			"NGN":"尼日利亚奈拉",
			"NPR":"尼泊尔卢比",
			"PKR":"巴基斯坦卢比",
			"PGK":"巴布亚新几内亚基那",
			"PYG":"巴拉圭瓜拉尼",
			"BHD":"巴林第纳尔",
			"BRL":"巴西雷亚尔",
			"KYD":"开曼元",
			"LVL":"拉脱维亚拉特",
			"NOK":"挪威克朗",
			"CZK":"捷克克郎",
			"MDL":"摩尔多瓦列伊",
			"MAD":"摩洛哥迪拉姆",
			"BND":"文莱元",
			"FJD":"斐济元",
			"SKK":"斯洛伐克克朗",
			"LKR":"斯里兰卡卢比",
			"SGD":"新加坡元",
			"TWD":"新台币",
			"NZD":"新西兰元",
			"JPY":"日元",
			"CLP":"智利比索",
			"EUR":"欧元",
			"MUR":"毛里求斯卢比",
			"SAR":"沙特里亚尔",
			"PLN":"波兰兹罗提",
			"THB":"泰铢",
			"HNL":"洪都拉斯拉伦皮拉",
			"HKD":"港元",
			"AUD":"澳大利亚元",
			"EEK":"爱沙尼亚克朗",
			"JMD":"牙买加元",
			"TTD":"特立尼达和多巴哥元",
			"BOB":"玻利维亚诺",
			"SEK":"瑞典克朗",
			"CHF":"瑞士法郎",
			"KWD":"科威特第纳尔",
			"PEN":"秘鲁新索尔",
			"TND":"突尼斯第纳尔",
			"LTL":"立陶宛立特",
			"JOD":"约旦第纳尔",
			"NAD":"纳米比亚元",
			"RON":"罗马尼亚列伊",
			"KES":"肯尼亚先令",
			"GBP":"英镑",
			"ANG":"荷兰安的列斯盾",
			"PHP":"菲律宾比索",
			"SVC":"萨尔瓦多科朗",
			"ZMK":"赞比亚克瓦查",
			"VND":"越南盾",
			"DZD":"阿尔及利亚第纳尔",
			"OMR":"阿曼里亚尔",
			"ARS":"阿根廷比索",
			"AED":"阿联酋迪拉姆",
			"XOF":"非洲金融共同体法郎",
			"KRW":"韩圆",
			"MKD":"马其顿戴代纳尔",
			"MYR":"马来西亚林吉特",
			"LBP":"黎巴嫩镑"
		},
		loadComboList: function(fromCombo,toCombo){
			var sHtml = ''; var currencyAdded = {};
			for(var i = this.fromCurrencyList.length-1; i >= 0; i--){
				sHtml+='<option value="'+this.fromCurrencyList[i]+'" >'+this.currencyList[this.fromCurrencyList[i]]+'</option>';currencyAdded[this.fromCurrencyList[i]]=1;
			};
			for(var p in this.currencyList){
				if(typeof(currencyAdded[p])=="undefined") sHtml+='<option value="'+p+'" >'+this.currencyList[p]+'</option>';
			};
			fromCombo.innerHTML=sHtml;

			sHtml = ''; currencyAdded = {};
			for(var i = this.toCurrencyList.length-1; i >= 0; i--){
				sHtml+='<option value="'+this.toCurrencyList[i]+'" >'+this.currencyList[this.toCurrencyList[i]]+'</option>';currencyAdded[this.toCurrencyList[i]]=1;
			};
			for(var p in this.currencyList){
				if(typeof(currencyAdded[p])=="undefined") sHtml+='<option value="'+p+'" >'+this.currencyList[p]+'</option>';
			};
			toCombo.innerHTML=sHtml;

			fromCombo.value = TMSGCCW.fromCurrency||'USD';
			toCombo.value = TMSGCCW.toCurrency||'CNY';
		},
		loadUi:function(){
			config_decimal_places.value = TMSGCCW.data("decimalPlaces");
			config_font_family.value = TMSGCCW.data("fontFamily");
			config_decimal_complemented_with_zero.checked = TMSGCCW.data("decimalComplementedWithZero");
			$('body').css("font-family", TMSGCCW.data("fontFamily"));
			TMSGCCW.loadComboList(base_list,target_list);
		},
		loadSettings: function(){
			TMSGCCW.fromCurrency=localStorage['fromCurrency'];
			TMSGCCW.toCurrency=localStorage['toCurrency'];
			if(typeof(localStorage['decimalPlaces'])!="undefined") TMSGCCW.data("decimalPlaces",localStorage['decimalPlaces']);
			if(typeof(localStorage['decimalComplementedWithZero'])!="undefined") TMSGCCW.data("decimalComplementedWithZero",localStorage['decimalComplementedWithZero']);
			if(typeof(localStorage['fontFamily'])!="undefined") TMSGCCW.data("fontFamily",localStorage['fontFamily']);
			if(typeof(localStorage['fromCurrencyList'])!="undefined") TMSGCCW.fromCurrencyList=localStorage['fromCurrencyList'].split('|');
			if(typeof(localStorage['toCurrencyList'])!="undefined") TMSGCCW.toCurrencyList=localStorage['toCurrencyList'].split('|');
			$(window).ready(function(){TMSGCCW.loadUi();});
		},
		saveSettings: function(){
			localStorage['fromCurrency']=TMSGCCW.fromCurrency;
			localStorage['toCurrency']=TMSGCCW.toCurrency;
			localStorage['decimalPlaces']=TMSGCCW.data("decimalPlaces");
			localStorage['decimalComplementedWithZero']=TMSGCCW.data("decimalComplementedWithZero");
			localStorage['fontFamily']=TMSGCCW.data("fontFamily");
			localStorage['fromCurrencyList']=TMSGCCW.fromCurrencyList.join('|');
			localStorage['toCurrencyList']=TMSGCCW.toCurrencyList.join('|');
		},
		setFromCurrency: function(fromCurrency){
			this.fromCurrency = fromCurrency;var bMatched = false;
			for(var i = 0, l = this.fromCurrencyList.length; i < l; i++){
				if(bMatched){
					this.fromCurrencyList[i-1]=this.fromCurrencyList[i];
				}else if(this.fromCurrencyList[i]==fromCurrency){
					bMatched = true;
				}
			}
			if(bMatched) this.fromCurrencyList.pop();
			this.fromCurrencyList.push(fromCurrency);
		},
		setToCurrency: function(toCurrency){
			this.toCurrency = toCurrency;var bMatched = false;
			for(var i = 0, l = this.toCurrencyList.length; i < l; i++){
				if(bMatched){
					this.toCurrencyList[i-1]=this.toCurrencyList[i];
				}else if(this.toCurrencyList[i]==toCurrency){
					bMatched = true;
				}
			}
			if(bMatched) this.toCurrencyList.pop();
			this.toCurrencyList.push(toCurrency);
		},
		/**
		 * 获取最新汇率
		 * @param String 源货币缩写
		 * @param String 目标货币缩写
		 * @param function 回调函数,回调参数为汇率,获取失败时值为-1
		 **/
		getExchangeRate: function(fromCurrency,toCurrency,callback){
			tipStart.innerHTML = "« [正在查询当前汇率]";
			console.log("√ ["+(new Date).toLocaleString()+"] 开始查询汇率：https://www.google.com/finance/converter?a=1&from="+fromCurrency+"&to="+toCurrency);
			var date = new Date;
			var randSeed = date.getUTCFullYear().toString()+date.getUTCMonth()+date.getDate()+date.getHours();// parseInt(9999999*Math.random()) 防止读缓存
			$.ajax({
				type: 'GET', url: "https://finance.google.com/finance/converter", data: {hl:this.language,a:"1",from:fromCurrency,to:toCurrency,randSeed:randSeed}, success: function(result){
				console.log("["+(new Date).toLocaleString()+"] 汇率查询完成。")
				callback && callback(parseFloat($(result).find('#currency_converter_result').find('.bld').text().replace(/[^\d\.]+/ig,'')));
			}, dataType: "html", error: function(xmlHttpRequest, errMsg) {
				console.log("× ["+(new Date).toLocaleString()+"] 查询汇率失败："+errMsg);
				console.log(["× 错误详情： ",xmlHttpRequest]);
				callback && callback(-1);
			}});
		},
		/**
		 * 显示汇率提示Tip
		 * @param string 要显示的文字
		 **/
		showExchangeRateTip: function(tipString){
			$("#ExchangeRate").html(tipString);
			$("#imgTable").attr("src","http://www.google.com/finance/chart?q=CURRENCY:"+this.fromCurrency+this.toCurrency+"&tkr=1&p=5Y&chst=cob");
		},
		/**
		 * 开始汇率转换
		 * @param number 源货币面值
		 * @return string 目标货币面值或出错信息
		 **/
		convert: function(amount){
			try{
				amount = amount.toString().replace(/[ ,]+/g, '')
				if(this.exchangeRate==-1) return "汇率查询失败";
				var quickExp = /[^\d\.]/;
				if(quickExp.test(amount)) return "输入有误";
				amount *= this.exchangeRate;
				if(quickExp.test(amount)) return "输入有误";
				return TMSGCCW.data("decimalComplementedWithZero")?amount.toFixed(TMSGCCW.data("decimalPlaces")):parseFloat(amount.toFixed(TMSGCCW.data("decimalPlaces")));
			} catch(ex){
				return "输入有误";
			}
		},
		/**
		 * UI接口函数,触发汇率转换的所有事件绑定到该函数
		 * void(void);
		 **/
		startConvert: function(){
			if(base_list.value!=TMSGCCW.fromCurrency || target_list.value!=TMSGCCW.toCurrency || TMSGCCW.exchangeRate==-1) {
				TMSGCCW.getExchangeRate(base_list.value,target_list.value,function(exchangeRate){
					if(exchangeRate!=-1){   //获取汇率成功
						TMSGCCW.setFromCurrency(base_list.value);
						TMSGCCW.setToCurrency(target_list.value);
						TMSGCCW.saveSettings();

						TMSGCCW.showExchangeRateTip("1 " + TMSGCCW.fromCurrency + " = " + exchangeRate + ' ' + TMSGCCW.toCurrency);
						tipStart.innerHTML = "« 将"+TMSGCCW.fromCurrency+"换算为"+TMSGCCW.toCurrency;
						//TMSGCCW.startConvert();
					}else{  //获取汇率失败
						TMSGCCW.showExchangeRateTip("获取数据出现错误 请检查网络连接 [难道...Google又被墙掉了?]");
						tipStart.innerHTML = "« [查询汇率失败...]";
					}
					TMSGCCW.exchangeRate = exchangeRate;
					target_input.value = TMSGCCW.convert(base_input.value);
				});
				localStorage['fromCurrency']=TMSGCCW.fromCurrency;
				localStorage['toCurrency']=TMSGCCW.toCurrency;
			}else{
				target_input.value = TMSGCCW.convert(base_input.value);
			};
		}
	}
})();
TMSGCCW.loadSettings();
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
var adva = ['© 一名宅<br>数据取自即时 Google Finance'];
adDiv.onclick = function(){
	advi++;
	this.innerHTML = adva[advi%adva.length];
}
