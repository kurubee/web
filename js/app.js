var kurubeeApp = angular.module('kurubeeApp', [
  'ngRoute',
  'kurubeeControllers',
  'kurubeeFilters',
  'kurubeeServices'
]);

kurubeeApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/courses', {
        templateUrl: 'partials/course-list.html',
        controller: 'CourseListCtrl'
      }).
      when('/courses/:courseId', {
        templateUrl: 'partials/course-detail.html',
        controller: 'CourseDetailCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      otherwise({
        redirectTo: '/courses'
      });

  }]);


'use strict';

kurubeeApp.config(['$httpProvider', function($httpProvider) {

	/*
	 Response interceptors are stored inside the 
	 $httpProvider.responseInterceptors array.
	 To register a new response interceptor is enough to add 
	 a new function to that array.
	*/

	$httpProvider.responseInterceptors.push(['$q','$location', function($q,$location) {

		// More info on $q: docs.angularjs.org/api/ng.$q
		// Of course it's possible to define more dependencies.

		return function(promise) {

			/*
			 The promise is not resolved until the code defined
			 in the interceptor has not finished its execution.
			*/

			return promise.then(function(response) {

				// response.status >= 200 && response.status <= 299
				// The http request was completed successfully.

				/*
				 Before to resolve the promise 
				 I can do whatever I want!
				 For example: add a new property 
				 to the promise returned from the server.
				*/

				response.data.extra = 'Interceptor strikes back';

				// ... or even something smarter.

				/*
				 Return the execution control to the 
				 code that initiated the request.
				*/

				return response; 

			}, function(response) {

				// The HTTP request was not successful.

				/*
				 It's possible to use interceptors to handle 
				 specific errors. For example:
				*/
				if (response.status === 401) {
                    console.log('asd');
					// HTTP 401 Error: 
					// The request requires user authentication
                    $location.path( "/login" );
					response.data = { 
				 		status: false, 
				 		description: 'Authentication required!'
				 	};

					return response;

				}

				/*
				 $q.reject creates a promise that is resolved as
				 rejectedwith the specified reason. 
				 In this case the error callback will be executed.
				*/

				return $q.reject(response);

			});

		}

	}]);

}]);

