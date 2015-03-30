/*
** Function for timeline 
*/

$( document ).ready(function(){
  initialize();
  //showLatest();
});


function showLatest(){

  var date = new Date();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var time = date.getFullYear() + '/' +
    (month<10 ? '0' : '') + month + '/' +
    (day<10 ? '0' : '') + day;

  jQuery('<div/>', {
    id: 'heading',
    style: 'text-align:center',
    text: time,
  }).appendTo('#dates');

  // Ask for the latest data 
  var time_query = date.getFullYear() + '_' +
    (month<10 ? '0' : '') + month + '_' +
    (day<10 ? '0' : '') + day;

  var imageAPI = "http://127.0.0.1:8080/no2?date="+time_query;
  var imageAPI = "http://127.0.0.1:8080/no2?date=2015_01_01";


  $.ajax({
    type: "GET",
    url: imageAPI,
    //contentType: "application/json; charset:utf-8",
    dataType: "json",
    success: function (data) {
      //alert("succ");
      setmap(data.result);
      
    },
    error: function (fs) {
      alert("error");
    }
  });
 

  //setmap('2015.png');

   $("#search").click(function(){
        alert("hi"); 
    });
  
}




$(function(){
    $().timelinr({
		autoPlay: 'true',
		autoPlayDirection: 'forward',
		startAt: 1
	})
});


/*
** Function to support "date" in IE
*/
Modernizr.load({
    test: Modernizr.inputtypes.date,
    nope: "js/jquery-ui.custom.js",
    callback: function() {
      $("input[type=date]").datepicker();
    }
});

/*
** Function for map
*/

var map;
var overlay;
var showed = false;

function initialize() {
  var vancouver = new google.maps.LatLng(49.1,-123.0);
  //var chicago = new google.maps.LatLng(41.875696,-87.624207);
  var mapOptions = {
    zoom: 9,
    center: vancouver
  }

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  //setmap('test.png');

  /*
  var ctaLayer = new google.maps.KmlLayer({
    //url: 'http://gmaps-samples.googlecode.com/svn/trunk/ggeoxml/cta.kml'
    //url: 'http://localhost:8000/NO_len_en.kmz'
    url: 'http://ws.mss.icics.ubc.ca/~jcchen25/NO_len_en.kmz'
  });
  ctaLayer.setMap(map);
  */
  $("#play").click(function(){
        alert("The button play is clicked");
        var speed = $("#SliderSingle").slider("value");
        alert("The speed is "+ speed);
        var year = $("#Slider4").slider("value");
        alert("starting year is "+ year.substring(0,4));
        alert("ending year is "+ year.substring(5,9));
  });
}

function setmap(str) {
  var imageBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(48.963588, -123.364349),
      new google.maps.LatLng(49.411317, -122.317993));
  var overlayOpts = {
      opacity:0.5
  }

  if (showed) {
    overlay.setMap(null);
  }

  showed = true;


  overlay = new google.maps.GroundOverlay(
      str,
      imageBounds, overlayOpts);
  overlay.setMap(null);
  overlay.setMap(map);
}

function myfunc() {
  console.log("clicked");
  setmap('no2.png');
}

function myremove() {
  showed = false;
  overlay.setMap(null);

}

//google.maps.event.addDomListener(window, 'load', initialize);


      