app.service('order', function(API,$http, $window){
  var order = this;

  order.placeOrder = function(data){
    return $http.post(API +'/users/order', data);
  }
})
