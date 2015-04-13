var save = function(para,value){
	localStorage[para] = value;
};
var load = function(para){
	return localStorage[para];
};