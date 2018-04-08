app.service('location', function(API,$http, $window){
  var order = this;
  var lat = null;
  var long = null;

  order.setLocation = function(lat, long){
      lat = lat;
      long = long;
  }

  order.getLocation = function(){

      return {
        lat:lat,
        long:long
      }
  }
})
