app.constant('API', '/api');

app.config(['$stateProvider','$httpProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider){

  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('httpInterceptor');

  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: './../views/login/login.html',
      controller: 'LoginController'
    })
    .state('home', {
      url: "/home",
      templateUrl: './../views/home/home.html',
      controller: 'HomeController'
    })
    .state('order', {
      url: "/order",
      templateUrl: './../views/order/order.html',
      controller: 'OrderController'
    })
    .state('track', {
      url: "/track",
      templateUrl: './../views/track/track.html',
      controller: 'TrackController'
    })
    .state('agentLogin', {
      url: "/agent/login",
      templateUrl: './../views/agent/login/login.html',
      controller: 'AgentLoginController'
    })
    .state('agentOrders', {
      url: "/agent/orders",
      templateUrl: './../views/agent/order/order.html',
      controller: 'AgentOrderController'
    })

}])

app.run(function(auth, user, $location) {
  var publicPages = ['/'];

  function redirect(){
    var restrictedPage = publicPages.indexOf($location.path()) === -1;
    if(restrictedPage){
      if(($location.path().indexOf('agent') != -1) && !auth.getAgentToken()){
        $location.path('/agent/login');
      }
      else
      if(($location.path().indexOf('agent') === -1) && !auth.getToken()){
        $location.path('/login');
      }

      if(($location.path().indexOf('agent') != -1) && auth.getAgentToken()){
        $location.path('/agent/orders');
      }
      else
      if(($location.path().indexOf('agent') === -1) && auth.getToken()){
        $location.path('/home');
      }

      // if($location.path().indexOf('agent') != -1){
      //   $location.path('/agent/login');
      // }
      // else{
      //   console.log('here3')
      //   $location.path('/login');
      // }
    }

  }

  redirect();
});
