(function() {
	"use strict";
var ikData = [
	{
		"type": "УИКи",
		"iconUrl": "images/number_{number}.png",
		"shadowUrl": "images/shadow.png",
		"popupTpl": "<strong><a href='{url}'>УИК {number}</a></strong><br/><a href='tel:{phone}'>{phone}</a>. {addr}<br>{obj}"
	},
	{
		"type": "ТИКи",
		"iconUrl": "images/symbol_sum.png",
		"shadowUrl": "images/shadow.png",
		"popupTpl": "<strong>ТИК <a href='{url}'>{name}</a> ({members} ПРГ)</strong><br/>{phone}. {desc}"
	}
];

var getMapYaCentered = function() {
	var map = new L.Map('map'),
		/*cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/4dbea02acb2d47779913c727fa16dda9/997/256/{z}/{x}/{y}.png',
			{
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
				maxZoom: 18
			}
		),*/
		mapnik = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			{
				attribution: 'Map data &copy; <a href="http://osm.org">OpenStreetMap</a> contributors',
				maxZoom: 18
			}
		);
	var center = new L.LatLng(55.98, 35.96);
	map.setView(center, 10).addLayer(mapnik);
	return map;
};
var tplObj = function(templ, obj) {
	var res = {};
	for (var prop in templ) {
		if (typeof templ[prop] == 'string') {
			res[prop] = templ[prop].replace(/{([^}]+)}/g, function(a, b) {
				return obj[b];
			});
		}
	}
	return res;
};
var tpl = function(templ, obj) {
	return templ.replace(/{([^}]+)}/g, function(a, b) {
		return obj[b];
	});
};
var createMap = function() {
	var map = getMapYaCentered(),
		IkIcon = L.Icon.extend({
			options: {
				"iconSize": [32, 37],
				"shadowSize": [51, 37],
				"popupAnchor": [0, -16]
			}
		}),
		groupIcon, arr, i, len;

	for (i = 0, len = ikData.length; i < len; i++) {
		arr = ikData[i].data;
		for (var j = 0, leng = arr.length; j < leng; j++) {
			groupIcon = new IkIcon(tplObj(ikData[i], arr[j]));
			L.marker([arr[j].lat, arr[j].lon], {icon: groupIcon}).addTo(map)
				.bindPopup(tpl(ikData[i].popupTpl, arr[j]));
		}
	}


	/*var successGetLoc = function(position) {
		map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 15);
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
