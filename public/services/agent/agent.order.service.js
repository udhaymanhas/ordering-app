app.service('agentOrder', function(API,$http, $window){
  var agentOrder = this;

  agentOrder.getOrders = function(){
    return $http.get(API +'/agent/users/orders');
  }
  agentOrder.acceptOrder = function(data){
    return $http.post(API +'/agent/users/order', data);
  }
})
