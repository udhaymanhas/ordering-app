app.controller('AgentLoginController',['$scope','$state','agentUser',function($scope, $state, agentUser){
  $scope.submitProgress = false;

  $scope.submit = function(){
    $scope.submitProgress = true;
    var data = {
      type:'form',
      email:$scope.user.email,
      password:$scope.user.password
    }

    agentUser.login(data)
      .then(function(user){
        $scope.submitProgress = false;
        $state.go('agentOrders')
      })
      .catch(function(e){
        console.log('Auth API Not Found',e);
        $scope.submitProgress = false;
      })
  }
}]);
