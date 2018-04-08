app.controller('OrderController',['$scope','order','location','$mdToast','$window', function($scope, order, location, $mdToast, $window){

  $scope.submitProgress = false;

  $scope.order = {
    address:'',
    lattitue:'',
    longitude:'',
    restraunt:'',
    item:''
  }

  var last = {
      bottom: true,
      top: false,
      left: false,
      right: true
    };

  $scope.toastPosition = angular.extend({},last);

  $scope.getToastPosition = function() {
    sanitizePosition();

    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  function sanitizePosition() {
    var current = $scope.toastPosition;

    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;

    last = angular.extend({},current);
  }

  $scope.showSuccess = function() {
    var pinTo = $scope.getToastPosition();

    $mdToast.show(
      $mdToast.simple()
        .textContent('Order Placed Successfully')
        .position(pinTo )
        .hideDelay(3000)
    );
  };

  $scope.setLocation = function(lat, long){
    $scope.order.lattitude = lat;
    $scope.order.longitude = long;
    console.log('setLocation', lat, long);
  };

  $scope.showPosition = function (position) {
      $scope.setLocation(position.coords.latitude, position.coords.longitude);
      location.setLocation(position.coords.latitude, position.coords.longitude);
      console.log(position.coords.latitude, position.coords.longitude);
      $scope.$apply();
  }

  $scope.showError = function (error) {
      switch (error.code) {
          case error.PERMISSION_DENIED:
              $scope.error = "User denied the request for Geolocation."
              break;
          case error.POSITION_UNAVAILABLE:
              $scope.error = "Location information is unavailable."
              break;
          case error.TIMEOUT:
              $scope.error = "The request to get user location timed out."
              break;
          case error.UNKNOWN_ERROR:
              $scope.error = "An unknown error occurred."
              break;
      }
      $scope.$apply();
  }

  $scope.getLocation = function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
    }
  }

  $scope.getLocation();

  $scope.submit = function(){
    $scope.submitProgress = true;

    var data = {};
    data = {
      address:{
        text:$scope.order.address,
      },
      loc:[$scope.order.longitude, $scope.order.lattitude],
      restraunt:$scope.order.restraunt,
      item:$scope.order.item,
      device:"web",
      status:"pending"
    }

    order.placeOrder(data)
      .then(function(order){
        if(order.status == "200"){
          $scope.order = {};
          $scope.orderForm.$setPristine();
          $scope.orderForm.$setUntouched();
          $scope.submitProgress = false;
          $scope.showSuccess();
          console.log('---->Order Success');
        }
      })
      .catch(function(e){
        console.log('Service-Order: placeOrder() err', e);
      })
  }





}]);
