app.service('user', function(API,$http, $window){
  var user = this;

  user.login = function(data){
    return $http.post(API +'/users/login', data);
  }
  // user.tokenRenew = function() {
  //     var refreshToken = $window.localStorage.refreshToken;
  //     return $http.post(API + '/refreshAccessToken', {
  //         "refreshToken": refreshToken
  //     });
  // };
})
