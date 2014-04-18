(function() {
	"use strict";
var ikData = [
	{
		"type": "УИКи",
		"pict": "images/number_{number}.png",
		"shadow": "images/shadow.png",
		"popupTpl": "<strong><a href='{url}'>УИК {number}</a></strong><br/>{phone}. {addr}<br>{obj}"
	},
	{
		"type": "ТИКи",
		"pict": "images/symbol_sum.png",
		"shadow": "images/shadow.png",
		"popupTpl": "<strong>ТИК <a href='{url}'>{name}</a> ({members} ПРГ)</strong><br/>{phone}. {desc}"
	}
];

var getMapYaCentered = function() {
	return (new google.maps.Map(document.getElementById('map'),
	{
		zoom: 10,
		center: new google.maps.LatLng(55.98, 35.96),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}));
};
var tpl = function(templ, obj) {
	return templ.replace(/{([^}]+)}/g, function(a, b) {
		return obj[b];
	});
};
var createMap = function() {
	var map = getMapYaCentered(),
		shadow = new google.maps.MarkerImage("images/shadow.png", new google.maps.Size(51, 37)),
		ikIcon,
		marker,
		arr,
		infoWindow;

	for (var i = 0, len = ikData.length; i < len; i++) {
		arr = ikData[i].data;
		for (var j = 0, leng = arr.length; j < leng; j++) {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(arr[j].lat, arr[j].lon),
				map: map,
				shadow: shadow,
				icon: new google.maps.MarkerImage(tpl(ikData[i].pict, arr[j]),
					new google.maps.Size(32, 37)),
				title: '' + arr[j].number
			});
			(function(marker, html) {
				infoWindow = new google.maps.InfoWindow();
				google.maps.event.addListener(marker, 'click', function() {
					infoWindow.setContent(html);
					infoWindow.open(map, marker);
				});
			})(marker, tpl(ikData[i].popupTpl, arr[j]));
		}
	}


	/*var successGetLoc = function(position) {
		map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
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
