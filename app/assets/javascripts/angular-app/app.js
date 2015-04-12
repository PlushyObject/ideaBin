var ideaBin = angular.module('ideaBin', 
	[ 'ngRoute', 
		'templates', 
		'ideaBin.ideaServices', 
		'ideaBin.directoryServices', 
		'ideaBin.ideaControllers',
		'ideaBin.ideaDirectives', 
		'ideaBin.directoryControllers',
		'ideaBin.resourceServices', 
		'ideaBin.resourceControllers',
		'ideaBin.userControllers',
		'ideaBin.userServices',
		'ideaBin.navigationControllers',
		'ideaBin.pullRequestControllers',
		'ideaBin.pullRequestServices',
		'ideaBin.repositoryServices',
		'ideaBin.repositoryControllers',
		'ideaBin.commentServices',
		'ideaBin.commentControllers',
		'ideaBin.repositoryCommentServices',
		'ideaBin.repositoryCommentControllers',
		'ideaBin.contactServices',
		'ideaBin.contactController',
		'ideaBin.resourceCommentServices',
		'ideaBin.resourceCommentControllers',
		'angularFileUpload',
		'ui.ace',
		'ngStorage',
		'ngCookies',
		'ng-token-auth']);

// for compatibility with Rails CSRF protection

ideaBin.config([
  '$httpProvider', function($httpProvider){
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
	}
]);

ideaBin.config(function($authProvider){
	$authProvider.configure({
	      apiUrl: 'localhost:3000',

	      // provide the header template
	      tokenFormat: {
		"Authorization": "token={{ token }} expiry={{ expiry }} uid={{ uid }}"
	      },

	      // parse the expiry from the 'Authorization' param
	      /*parseExpiry: function(headers) {
		return (parseInt(headers['Authorization'].match(/expiry=([^ ]+) /)[1], 10)) || null

	      }
		*/
        })
});

ideaBin.config(function ($routeProvider, $locationProvider) {


        $routeProvider.when('/ideas', {
					templateUrl: 'idea/index.html', 
				})
				.when('/ideas/new', {
					templateUrl: 'idea/new.html', 
				})
				.when('/ideas/:id', {
					templateUrl: 'idea/edit.html', 
				})
				.when('/directories', {
					templateUrl: 'directory/index.html', 
				})
				.when('/directories/new', {
					templateUrl: 'directory/new.html', 
				})
				.when('/directories/:id', {
					templateUrl: 'directory/edit.html', 
				})
				.when('/users/edit', {
					templateUrl: 'user/edit.html', 
					controller: 'UserSessionCtrl'
				})
				.when('/users/signout', {
					templateUrl: 'idea/index.html', 
					controller: 'UserSessionCtrl'
				})
				.when('/sign_in', {
					templateUrl: 'user_session/new.html',
					controller:	'UserSessionCtrl'
				})
				.when('/register', {
					templateUrl: 'user/register.html',
					controller:	'UserSessionCtrl'
				})
				.when('/contact_us', {
					templateUrl:  'contact_us.html',
				})
				.otherwise({redirectTo : '/ideas'});
				
        $locationProvider.html5Mode({
					enabled: true,
					requireBase: false
				});
    });
		
ideaBin.run(['$rootScope', '$injector', function($rootScope,$injector) { 
	$injector.get("$http").defaults.transformRequest = function(data, headersGetter) { 
		if ($rootScope.oauth) headersGetter()['Authorization'] = "Bearer "+$rootScope.oauth.access_token; 
    	if (data) {
		return angular.toJson(data); 
    	} 
  }
 }]);
