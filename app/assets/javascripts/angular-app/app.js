var ideaBin = angular.module('ideaBin', ['ngRoute', 'templates', 'ideaBin.services', 'ideaBin.controllers']);

// for compatibility with Rails CSRF protection

ideaBin.config([
  '$httpProvider', function($httpProvider){
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')
	}
]);

ideaBin.config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
					templateUrl: '/ideas/index.html', 
					controller: 'IdeaListCtrl'
				});
        $locationProvider.html5Mode(true);
				//$routeProvider.when('/idea-detail/:id', {templateUrl: 'partials/idea-detail.html', controller: 'IdeaDetailCtrl'});
        //$routeProvider.when('/idea-creation', {templateUrl: 'partials/idea-creation.html', controller: 'IdeaCreationCtrl'});
        //$routeProvider.otherwise({redirectTo: '/idea-list'});
    });
		
ideaBin.run(function(){
  console.log('angular ideaBin running');
});