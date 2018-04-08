//Intercept http request, attach token.
//Intercept http response, if token found save token.
app.factory('httpInterceptor', function(API, auth) {
  return {
    request: function(req) {
                  var token = auth.getToken();
                  if(req.url.indexOf('agent') != -1){
                    token = auth.getAgentToken();
                  }
                  if (req.url.indexOf(API) === 0 && token) {
                      req.headers['x-auth'] = token;
                  }
                  return req;
              },
    response: function(res) {
                var headers = res.headers();
                var token = headers['x-auth'];

                if(token != undefined) {
                  if(res.config.url.indexOf('agent') != -1){
                    auth.saveAgentToken(headers['x-auth']);
                  }
                  else{

                    auth.saveToken(headers['x-auth']);
                  }
                }
                return res;
              }
  }
});
