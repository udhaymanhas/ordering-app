app.controller('LoginController',['$scope','user','$state',function($scope, user, $state){

  $scope.submitProgress = false;

  $scope.submit = function(){
    $scope.submitProgress = true;
    var data = {
      type:'form',
      email:$scope.user.email,
      password:$scope.user.password
    }

    user.login(data)
      .then(function(user){
        // console.log(user);
        $scope.submitProgress = false;
        window.socket = io.connect();
        $state.go('home')
      })
      .catch(function(e){
        console.log('Auth API Not Found',e);
        $scope.submitProgress = false;
      })
  }
}]);
