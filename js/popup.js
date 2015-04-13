$(window).ready(function(){
	$("#config_button").unbind().click(function(){
		if($("#config_button").data('switch_flag')=='open') {
			$("#config_container").animate({height:"0px"},500);
			$("body").animate({height:"134px"},500);
			$("#config_button").data('switch_flag','close');
		}else{
			$("#config_container").animate({height:"100px"},500);
			$("body").animate({height:"234px"},500);
			$("#config_button").data('switch_flag','open');
		}
	});
	$("#config_decimal_places").change(function(){
		TMSGCCW.data("decimalPlaces", parseInt(config_decimal_places.value));TMSGCCW.saveSettings();TMSGCCW.startConvert();
	});
	$("#config_decimal_complemented_with_zero").change(function(){
		TMSGCCW.data("decimalComplementedWithZero", config_decimal_complemented_with_zero.checked);TMSGCCW.saveSettings();TMSGCCW.startConvert();
	});
	$("#config_font_family").change(function(){
		TMSGCCW.data("fontFamily", config_font_family.value);TMSGCCW.saveSettings();
		$("body").css("font-family",TMSGCCW.data("fontFamily"));
	});
});
