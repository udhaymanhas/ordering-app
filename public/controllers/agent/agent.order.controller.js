app.controller('AgentOrderController', ['$scope','$state','agentOrder',function($scope, $state, agentOrder){

  agentOrder.getOrders()
    .then(function(res){
      $scope.orders = res.data.orders;
      console.log($scope.orders);
    })
    .catch(function(e){
      console.log('fetch Orders err', e);
    })

  $scope.acceptOrder = function(index){
    var data = {
      _id:$scope.orders[index]._id,
      status:'assigned'
    }
    agentOrder.acceptOrder(data)
      .then(function(res){
        console.log(res);
        if(res.status == 200){
          $scope.orders[index].status = 'assigned';
        }
      })
      .catch(function(err){
        console.log(err);
      })
  }
}]);
