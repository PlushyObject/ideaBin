var services = angular.module('ideaBin.authInterceptor', []);

services.factory('AuthInterceptor', ['$q', 'ipCookie', '$location',  function($q, ipCookie, $location) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if (ipCookie('access-token')) {
        config.headers['Access-Token'] = ipCookie('access-token');
        config.headers['Client'] = ipCookie('client');
        config.headers['Expiry'] = ipCookie('expiry');
        config.headers['Uid'] = ipCookie('uid');
      }
      return config;
    },
    responseError: function(response) {
      if (response.status === 401) {
        $location.path('/login');
        ipCookie.remove('access-token');
      }
      return $q.reject(response);
    }
  };
}])
