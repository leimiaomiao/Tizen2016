var pos_index = 0;
var MAP_VIEW = 0;
var LIST_VIEW = 1;
var DETAIL_VIEW = 2;
var currentView = MAP_VIEW;
var searchFlag = 0;
var resultMakerArray;

var test_position = {
	coords:{latitude:31.97327, longitude:118.759912}
}

window.onload = function() {
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
			if (currentView == LIST_VIEW) {
				currentView = MAP_VIEW;
				switch_view();
			} else if (currentView == DETAIL_VIEW) {
				currentView = LIST_VIEW;
				switch_view();
			} else {
				try {
	                tizen.application.getCurrentApplication().exit();
	            } catch (ignore) {}
			}
        }
    });

	start_map();

	$("#morebtn").bind("click", function(){
		console.log("More tap");
		currentView = LIST_VIEW;
		switch_view();
		//$("#morebtn").slideUp();
	});
};

function goToHere(map, myPoint, poi)
{
	console.log("gohere button clicked");
	currentView = MAP_VIEW;
	switch_view();

	map.clearOverlays();

	var walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, autoViewport: true}});
	walking.search(myPoint, poi);
}

function launchCaller(numberString)
{
	var tel = "tel:"+numberString;

	var appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/dial",
		tel, null, null, null, null);
	tizen.application.launchAppControl(appControl, null, function() {
		console.log("launch application control succeed");
	},function(e) {
		console.log("launch application control failed. reason: " + e.message);
	},null);
}

function callMerchant(posInfo)
{
	console.log("call button clicked, phone number: "+posInfo.phoneNumber);
	var index = posInfo.phoneNumber.indexOf(" ");

	if(index == -1){
		launchCaller(posInfo.phoneNumber);
	}else {
		var numberString = posInfo.phoneNumber.slice(0, index);
		launchCaller(numberString);
	}

	var numberArray = new Array();
	var startIndex = 0;
	var phoneNumber = posInfo.phoneNumber;
	do{
		index = phoneNumber.indexOf(" ", startIndex);
		if(index != -1)
			numberArray.push(phoneNumber.slice(startIndex, index));
		else
			numberArray.push(phoneNumber.slice(startIndex, index));
		startIndex = index+1;
	} while(index != -1)

	var x;
	for(x in numberArray)
		console.log("number: "+numberArray[x]);

}

function switch_view()
{
	var thisview;
	return;
	switch (currentView)
	{
		case MAP_VIEW:
			thisview = $("#allmap");
			break;
		case LIST_VIEW:
			thisview = $("#contents");
			break;
		case DETAIL_VIEW:
			thisview = $("#detailview");
			break;
		default:
			break;
	}
	thisview.siblings().hide();
	thisview.show();
	if (currentView == MAP_VIEW) $("#morebtn").show();
}

function start_map()
{
	console.log("start map");
	try {
		var map = new BMap.Map("bMap");
		var myPoint = new BMap.Point(118.81, 32.03);
		map.enableScrollWheelZoom();
		map.centerAndZoom(myPoint,14);
		map.enableDragging();
		map.enableDoubleClickZoom() ;
		console.log("map init end");

		//successCallback(test_position);
	} catch (e) {
		alert(e.message);
		alert("Error: no network");
	}

	var geolocationControl = new BMap.GeolocationControl({anchor: BMAP_ANCHOR_TOP_LEFT,
			offset: new BMap.Size(15, 180),
			showAddressBar: false, enableAutoLocation: true});
	geolocationControl.addEventListener("locationSuccess", function(e){
		var address = '';
		address += e.addressComponent.province;
		address += e.addressComponent.city;
		address += e.addressComponent.district;
		address += e.addressComponent.street;
		address += e.addressComponent.streetNumber;
		console.log("当前定位地址为："+ address);
		myPoint = e.point;

		/*map.removeOverlay(marker);

		var marker = new BMap.Marker(myPoint,{
    		icon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT)}
		);
		map.addOverlay(marker);*/

		addSearch(myPoint);
	});

	geolocationControl.addEventListener("locationError", function(e){
		//alert(e.message);
		console.log(e.message);
	});
	map.addControl(geolocationControl);
	var allpage = document.querySelector('#allmap');

	var objX = 2;
	var objY = 2;
	allpage.addEventListener("touchstart", function(e){
		console.log("touchstart");
		map.closeInfoWindow();

		var touch = e.targetTouches[0];
	    var startX = touch.pageX;
	    var startY = touch.pageY;
	   	objX = startX;
	    objY = startY;
	});

	allpage.addEventListener("touchmove", function(e){
		var center = map.getCenter();
		console.log("地图中心点为：" + center.lng + ", " + center.lat);

		var pixel = map.pointToPixel(center);
		pixel.x = pixel.x - (e.targetTouches[0].pageX - objX);
		pixel.y = pixel.y - (e.targetTouches[0].pageY - objY);
		console.log("pixel：" + pixel.x + ", " + pixel.y);

		var point = map.pixelToPoint(pixel);
		map.setCenter(point);
		console.log("地图中心点变更为：" + point.lng + ", " + point.lat);

		objX = e.targetTouches[0].pageX;
		objY = e.targetTouches[0].pageY;
	});

  document.addEventListener("rotarydetent", function(e) {
	    var direction = e.detail.direction;
	    if (direction === "CW") {
	        map.zoomIn();
	    } else if (direction === "CCW") {
	    		map.zoomOut();
	    }
	    map.closeInfoWindow();
	    console.log("rotarydetent: "+direction);
	});


	function successCallback(position)
	{
		console.log("Latitude: " +position.coords.latitude + "Longitude: " + position.coords.longitude);
		var point = new BMap.Point(position.coords.longitude, position.coords.latitude);
		map.setCenter(point);

		var pointArr = [];
		pointArr.push(point);
		var convertor = new BMap.Convertor();
		convertor.translate(pointArr, 1, 5, function(data){
			if(data.status == 0) {
				for (var i = 0; i < data.points.length; i++) {
					myPoint = data.points[i];
				    map.setCenter(myPoint);
				}
			}
			console.log("translate point: "+myPoint.lng+" "+myPoint.lat);
			//geolocationControl.location();
			addSearch(myPoint);
		});
	}

	function errorCallback(error)
	{
	   switch (error.code)
	   {
	      case error.PERMISSION_DENIED:
	         console.log("User denied the request for Geolocation.");
	         break;
	      case error.POSITION_UNAVAILABLE:
	         console.log("Location information is unavailable.");
	         break;
	      case error.TIMEOUT:
	         console.log("The request to get user location timed out.");
	         break;
	      case error.UNKNOWN_ERROR:
	         console.log("An unknown error occurred.");
	         break;
	   }
	}

	function oneShotFunc()
	{
	   if (navigator.geolocation)
	   {
	      navigator.geolocation.getCurrentPosition(successCallback, errorCallback,
	                                               {maximumAge: 60000});
	   }
	   else
	   {
	      console.log("Geolocation is not supported.");
	   }
	}

	oneShotFunc();

	function addSearch()
	{
		console.log("search start");
		var local =  new BMap.LocalSearch(map);
		if(searchFlag % 2 == 1)
			local.searchNearby('KFC', myPoint, 5000);
		else
			local.searchNearby('samsung', myPoint, 5000);

		searchFlag++;

		local.setSearchCompleteCallback(function(results){
			if (local.getStatus() == BMAP_STATUS_SUCCESS){
				removeResultMarker();
				showResults(results);
				$("#morebtn").show();
			}
			console.log("search result show done");
		});

		local.setMarkersSetCallback(function(){
			console.log("search marker");
		});
	}

	function removeResultMarker(){
		for(x in resultMakerArray)
			map.removeOverlay(resultMakerArray[x]);

		resultMakerArray = [];
	}

	function showResults(results){
		var contentsUL = $("#contents_ul");
		contentsUL.empty();
		for (var i = 0; i < results.getCurrentNumPois(); i++){
			console.log(results.getPoi(i).title);
			console.log(results.getPoi(i).title.replace(new RegExp(results.keyword,"g"),'<b>' + results.keyword + '</b>'));
			var distance = map.getDistance(myPoint, results.getPoi(i).point);
			var title = (i+1) + "." + results.getPoi(i).title.replace(new RegExp(results.keyword,"g"),'<b>' + results.keyword + '</b>');
			var liststr = '<li class="content_list">' +
				'<span class="list_title">' + title + '</span>' +
				'<span class="list_distance">' + Math.floor(distance) + " 米" + '</span>' +
				/*'<img class="list_pingfen" src="images/stars.png"/>' +
				'<span class="list_renjun">人均:</span>' +
				'<span class="list_jiage">&#65509;26.0</span>' +*/
				'<div class="list_address">' + "地址： "+ results.getPoi(i).address + '</div>' +
				'<div class="list_phoneNumber">' +"电话： "+ results.getPoi(i).phoneNumber + '</div>' +
				/*'<div class="divider_line"></div>' +
				'<div class="list_btn_1">到这去</div>' +
				'<div class="btn_divider_line"></div>' +
				'<div class="list_btn_2">电话</div>' +*/
			'</li>';

			contentsUL.append(liststr);

			var marker = addMarker(results.getPoi(i).point,i);
			addInfoWindow(marker,results.getPoi(i),i);
			resultMakerArray.push(marker);

			$("ul li:last-child").click(function(){
				pos_index = $(this).index();
				console.log("ui li click:" + pos_index);
				goToDetailView(map, myPoint, results.getPoi(pos_index));
			});
		}
	}

	function addMarker(point, index){
		var myIcon = new BMap.Icon("images/marker.png", new BMap.Size(48, 48),
			{anchor: new BMap.Size(24, 48)});
		var marker = new BMap.Marker(point, {icon: myIcon});
		map.addOverlay(marker);
		return marker;
	}

	function addInfoWindow(marker,poi,index){
	    var maxLen = 10;
	    var name = null;
	    if(poi.type == BMAP_POI_TYPE_NORMAL){
	        name = "地址：  ";
	    }else if(poi.type == BMAP_POI_TYPE_BUSSTOP){
	        name = "公交：  ";
	    }else if(poi.type == BMAP_POI_TYPE_SUBSTOP){
	        name = "地铁：   ";
	    }

	    var infoWindowTitle = '<div style="font-weight:bold;color:#CE5521;font-size:14px">'+poi.title+'</div>';

	    var infoWindowHtml = [];
	    infoWindowHtml.push('<table cellspacing="0" style="table-layout:fixed;width:100%;font:12px arial,simsun,sans-serif"><tbody>');
	    infoWindowHtml.push('<tr>');
	    infoWindowHtml.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">' + name + '</td>');
	    infoWindowHtml.push('<td style="vertical-align:top;line-height:16px">' + poi.address + ' </td>');
		infoWindowHtml.push('</tr>');
		infoWindowHtml.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">' + "电话:   " + '</td>');
		infoWindowHtml.push('<td style="vertical-align:top;line-height:16px">' + poi.phoneNumber + ' </td>');
	    infoWindowHtml.push('</tr>');
	    infoWindowHtml.push('</tbody></table>');
	    var infoWindow = new BMap.InfoWindow(infoWindowHtml.join(""),{title:infoWindowTitle,width:200});
	    var openInfoWinFun = function(){
	    	console.log(poi.point+" >> "+ poi.url+" >> "+ poi.detailUrl+" >> "+ poi.phoneNumber+" >> "+ poi.city);
			marker.openInfoWindow(infoWindow);

			map.setCenter(poi.point);
	    }

	    marker.addEventListener("click", openInfoWinFun);
		marker.disableMassClear();
	    return openInfoWinFun;
	}
}

function goToDetailView(map, myPoint, posInfo)
{
	$("#dv-main-title").text(posInfo.title);
	$("#dv-main-address").text(posInfo.address);

	$("#dv-btn-gohere").unbind("click");
	$("#dv-btn-call").unbind("click");

	$("#dv-btn-gohere").bind("click", function(){
		goToHere(map, myPoint, posInfo);
	});
	$("#dv-btn-call").bind("click",  function(){
		callMerchant(posInfo);
	});

	currentView = DETAIL_VIEW;
	switch_view();
}

function addOrder(){
	alert("发布订单成功");
}