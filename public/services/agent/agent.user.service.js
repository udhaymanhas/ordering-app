app.service('agentUser', function(API,$http, $window){
  var agentUser = this;

  agentUser.login = function(data){
    return $http.post(API +'/agent/users/login', data);
  }
})
