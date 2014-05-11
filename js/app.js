var kurubeeApp = angular.module('kurubeeApp', [
  'ngRoute',
  'ngCookies',
  'ngTouch',
  'kurubeeControllers',
  'kurubeeFilters',
  'kurubeeServices',
  'restangular',
  'angular-carousel'
]);


kurubeeApp.service('Aux', function() {
  var courseName = "Error";

  this.setCourseName = function (name) {
        courseName = name;
  }

  this.getCourseName = function () {
        return courseName;
  }
});


kurubeeApp.config(function($routeProvider,RestangularProvider) {
    $routeProvider.
      when('/courses', {
        templateUrl: 'partials/course-list.html',
        controller: 'CourseListCtrl'
      }).
      when('/courses/:courseId', {
        templateUrl: 'partials/course-detail.html',
        controller: 'CourseDetailCtrl'
      }).
      when('/courses/:courseId/levels/:levelId', {
        templateUrl: 'partials/level-detail.html',
        controller: 'LevelDetailCtrl'
      }).
      when('/courses/:courseId/levels/:levelId/quiz/:activityId', {
        templateUrl: 'partials/quiz-activity-detail.html',
        controller: 'QuizActivityCtrl'
      }).
      when('/courses/:courseId/levels/:levelId/quiz', {
        templateUrl: 'partials/quiz-activity-detail.html',
        controller: 'QuizActivityCtrl'
      }).
      when('/courses/:courseId/levels/:levelId/temporal/:activityId', {
        templateUrl: 'partials/temporal-activity-detail.html',
        controller: 'TemporalActivityCtrl'
      }).
      when('/courses/:courseId/levels/:levelId/temporal', {
        templateUrl: 'partials/temporal-activity-detail.html',
        controller: 'TemporalActivityCtrl'
      }).
      when('/courses/:courseId/levels/:levelId/visual/:activityId', {
        templateUrl: 'partials/visual-activity-detail.html',
        controller: 'VisualActivityCtrl'
      }).
      when('/courses/:courseId/levels/:levelId/visual', {
        templateUrl: 'partials/visual-activity-detail.html',
        controller: 'VisualActivityCtrl'
      }).
      when('/courses/:courseId/levels/:levelId/linguistic/:activityId', {
        templateUrl: 'partials/linguistic-activity-detail.html',
        controller: 'LinguisticActivityCtrl'
      }).
      when('/courses/:courseId/levels/:levelId/linguistic', {
        templateUrl: 'partials/linguistic-activity-detail.html',
        controller: 'LinguisticActivityCtrl'
      }).
      when('/courses/:courseId/levels/:levelId/geospatial/:activityId', {
        templateUrl: 'partials/geospatial-activity-detail.html',
        controller: 'GeospatialActivityCtrl'
      }).
      when('/courses/:courseId/levels/:levelId/geospatial', {
        templateUrl: 'partials/geospatial-activity-detail.html',
        controller: 'GeospatialActivityCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/logout', {
        templateUrl: 'partials/login.html',
        controller: 'LogoutCtrl'
      }).
      when('/auth', {
        templateUrl: 'partials/course-list.html',
        controller: 'AuthCtrl'
      }).
      otherwise({
        redirectTo: '/courses'
      });

     RestangularProvider.setBaseUrl('http://0.0.0.0:8000/api/v1/');
     RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
        var newResponse;
        if (operation === "getList") {
            if(response.objects)
            {
                newResponse = response.objects;
                //newResponse.metadata = response.meta;
            }else {
               newResponse = [response];
            }
        }  else {
            newResponse = response;
        }
        return newResponse;
     });
});



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

