/*
** Function for timeline 
*/

$( document ).ready(function(){

  var date = new Date();
  var month = date.getMonth();
  var day = date.getDate();

  $("#slider").dateRangeSlider({
     bounds:{
      min: new Date(2015, 0, 1),
      max: new Date(date.getFullYear(), month, day)
    }
  });

  initialize();
    showLatest();
    $(function(){
     /* $().timelinr({
      autoPlay: 'true',
      autoPlayDirection: 'forward',
      startAt: 1,
      autoPlayPause:2000
    })*/

    $().timelinr();
  });

  $("#stop").click(function(){
    $("#dates").empty();
    $("#subtitle").empty();
    //alert("stop");
     $(function(){
        $().timelinr({
        autoPlayDirection: 'stop',
      })
    });

    showLatest();

  });



  $('#play').click(function(){
    $("#subtitle").empty();
    //alert("date selected");
    var speed = $("#SliderSingle").slider("value");
    //alert("The speed is "+ 1000*speed);
    //$("#slider").dateRangeSlider("values", new Date(2015, 0, 1), new Date(2015, 3, 31));
    var dateMax = $("#slider").dateRangeSlider("max");
    var dateMin = $("#slider").dateRangeSlider("min");
    //alert("min: "+dateMin + " " + "max: "+dateMax);

    var dateMins = dateMin.toString().split(" ");
    var dateMinDay = dateMins[2];
    var dateMinMonth = dateMins[1];
    var dateMinMonth = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(dateMinMonth) / 3 + 1;
    var dateMinYear = dateMins[3];

    var time_query_Min = dateMinYear + '_' +
    (dateMinMonth<10 ? '0' : '') + dateMinMonth + '_' + dateMinDay;

    //alert(time_query_Min);

  
    var dateMaxs = dateMax.toString().split(" ");
    var dateMaxDay = dateMaxs[2];
    var dateMaxMonth = dateMaxs[1];
    var dateMaxMonth = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(dateMaxMonth) / 3 + 1;
    var dateMaxYear = dateMaxs[3];


    var time_query_Max = dateMaxYear + '_' +
    (dateMaxMonth<10 ? '0' : '') + dateMaxMonth + '_' + dateMaxDay;
    var imageAPI = "http://127.0.0.1:8080/no2?start_date="+time_query_Min+"&end_date="+time_query_Max;

    //alert(imageAPI);
    $("#dates").empty();


    $.ajax({
      type: "GET",
      url: imageAPI,
      //contentType: "application/json; charset:utf-8",
      dataType: "json",
      success: function (data) {
        for(var i = 0; i < data.result.length; i++) {
          var datainfo = data.result[i].toString().split(",");
          var dateFormats = datainfo[0].split("_");
          var dateFormat = dateFormats[0]+"/"+dateFormats[1]+"/"+dateFormats[2];
          //alert(datainfo[0]+" url: "+datainfo[1]);
          var listItem = "<li><a href=\""+"#"+datainfo[0]+"\" onclick=\"setmap('"+datainfo[1]+"')\">"+dateFormat+"</a></li>";
          //alert(listItem);
          $("#timeline ul").append(listItem);
        }

        $("#dates li").css({"list-style":"none","float":"left","width":"100px","height":"50px","font-size":"14px","text-align":"center","background":"url('../images/biggerdot.png') center bottom no-repeat"});
        $("#dates a").css({"line-height":"45px;","padding-bottom":"10px","color":"#ffffcc","text-decoration":"none","-webkit-transition":"0.5s","-moz-transition":"0.5s","-o-transition":"0.5s","-ms-transition":"0.5s","transition":"0.5s"});
        $("#dates .selected").css("font-size","18px");

        $(function(){
            $().timelinr({
            autoPlay: 'true',
            autoPlayDirection: 'forward',
            startAt: 1,
            autoPlayPause:1000*speed
          })
        });

      },
      error: function (fs) {
        alert("error");
      },
    });


/*  alert("Min Modified: "+ time_query_Min);
    alert("Max Modified: "+ time_query_Max);
*/
    // Generate Data 
   
/*    while(dateMin <= dateMax){


        //var imageAPI = "http://127.0.0.1:8080/no2?adate=2015_01_01";

        dateMin = new Date(dateMin.setDate(
                dateMin.getDate() + 1
        ))

        
    }*/



  })

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
  }).appendTo('#subtitle');

  // Ask for the latest data 
  var time_query = date.getFullYear() + '_' +
    (month<10 ? '0' : '') + month + '_' +
    (day<10 ? '0' : '') + day;

  var imageAPI = "http://127.0.0.1:8080/no2?adate="+time_query;
  //var imageAPI = "http://127.0.0.1:8080/no2?adate=2015_01_01";


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
  
}


/*
** Function to support "date" in IE
*/
/*Modernizr.load({
    test: Modernizr.inputtypes.date,
    nope: "js/jquery-ui.custom.js",
    callback: function() {
      $("input[type=date]").datepicker();
    }
});*/

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


      