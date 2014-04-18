(function() {
	"use strict";
var ikData = [
	{
		"type": "УИКи",
		"pict": "images/number_{number}.png",
		"shadow": "images/shadow.png",
		"popupTpl": "{phone}. {addr}<br>{obj}",
		"nameTpl": "<a href='{url}'>УИК {number}</a>"
	},
	{
		"type": "ТИКи",
		"pict": "images/symbol_sum.png",
		"shadow": "images/shadow.png",
		"popupTpl": "{phone}. {desc}",
		"nameTpl": "ТИК <a href='{url}'>{name}</a> ({members} ПРГ)"
	}
];

var getMapYaCentered = function() {
	var map = new YMaps.Map(document.getElementById("map"));
	map.setCenter(new YMaps.GeoPoint(35.96, 55.98), 10, YMaps.MapType.PMAP);
	map.addControl(new YMaps.TypeControl([YMaps.MapType.PMAP, YMaps.MapType.PHYBRID, YMaps.MapType.SATELLITE]));
	map.addControl(new YMaps.ToolBar());
	map.addControl(new YMaps.Zoom());
	map.addControl(new YMaps.ScaleLine());
return map;
};
var tpl = function(templ, obj) {
	return templ.replace(/{([^}]+)}/g, function(a, b) {
		return obj[b];
	});
};
var createMap = function() {
	var map = getMapYaCentered(),
		ikStyle,
		marker,
		arr;

	for (var i = 0, len = ikData.length; i < len; i++) {
		arr = ikData[i].data;
		for (var j = 0, leng = arr.length; j < leng; j++) {
			ikStyle = new YMaps.Style();

			ikStyle.iconStyle = new YMaps.IconStyle();
			ikStyle.iconStyle.href = tpl(ikData[i].pict, arr[j]);
			ikStyle.iconStyle.size = new YMaps.Size(32, 37);

			ikStyle.iconStyle.shadow = new YMaps.IconShadowStyle();
			ikStyle.iconStyle.shadow.href = "images/shadow.png";
			ikStyle.iconStyle.shadow.size = new YMaps.Size(51, 37);
			ikStyle.iconStyle.shadow.offset = new YMaps.Point(-15, -30);

			marker = new YMaps.Placemark(new YMaps.GeoPoint(arr[j].lon, arr[j].lat), {style: ikStyle});
			marker.name = tpl(ikData[i].nameTpl, arr[j]);
			marker.description = tpl(ikData[i].popupTpl, arr[j]);
			map.addOverlay(marker);
		}
	}


	/*var successGetLoc = function(position) {
		map.setCenter(new YMaps.GeoPoint(position.coords.longitude, position.coords.latitude), 15);
	};
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successGetLoc);
	}*/
};
function getHTTPObject() {
	if (typeof XMLHttpRequest != "undefined") {
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0"];
		for (var i = 0; i < versions.length; i++) {
			try {
				var oXmlHttp = new ActiveXObject(versions[i]);
				return oXmlHttp;
			} catch (err) {}
		}
	}
}
var xhr = getHTTPObject();
xhr.open("GET", "iks.json", true);
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		if (xhr.status == 200 || xhr.status == 304) {
			var iks = JSON.parse(xhr.responseText);
			ikData[0].data = iks.uiks;
			ikData[1].data = iks.tiks;
			createMap();
		}
	}
};
xhr.send(null);
})();
