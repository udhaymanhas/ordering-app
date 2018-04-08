app.service('auth', function($window, $location) {
    var auth = this;

    auth.saveToken = function(token) {
        $window.localStorage['x-auth'] = token;
    }
    auth.getToken = function() {
        return $window.localStorage['x-auth'];
    };

    auth.saveAgentToken = function(token) {
        $window.localStorage['x-agent-auth'] = token;
    }
    auth.getAgentToken = function() {
        return $window.localStorage['x-agent-auth'];
    };
    // auth.isTokenValid = function() {
    //   var currentTime = new Date().getTime();
    //   if ($window.localStorage.jwtToken && $window.localStorage.refreshToken && currentTime < $window.localStorage.tokenExpiryTime){
    //     return true;
    //   }
    //   else {
    //     return false;
    //   }
    // };

    // auth.logout = function() {
    //   $window.localStorage.removeItem('jwtToken');
    //   $window.localStorage.removeItem('refreshToken');
    //   $window.localStorage.removeItem('tokenExpiryTime');
    //
    //   $location.path('/');
    // };
});
