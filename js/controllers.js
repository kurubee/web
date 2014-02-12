var kurubeeControllers  = angular.module('kurubeeControllers', []);
 
kurubeeApp.controller('CourseListCtrl', function($scope, Restangular,$cookieStore) {
    Restangular.setDefaultRequestParams({"api_key":$cookieStore.get("token"),"username":$cookieStore.get("username")});
    var baseCourses = Restangular.all('career');
    // This will query /courses and return a promise.
    baseCourses.getList().then(function(courses) {
        $scope.courses = courses
    });
    $scope.orderProp = 'timestamp';
});

kurubeeApp.controller('CourseDetailCtrl', function($scope, Restangular,$cookieStore, $routeParams) {
    Restangular.setDefaultRequestParams({"api_key":$cookieStore.get("token"),"username":$cookieStore.get("username")});
    var baseCourse = Restangular.one('career', $routeParams.courseId);
    baseCourse.get().then(function(course1){
        $scope.course = Restangular.copy(course1);
    });
    $scope.save = function() {
        $scope.course.put();
    };
});

kurubeeApp.controller('LoginCtrl', function($scope, $location, $routeParams,$cookieStore, Restangular) {
    $scope.login = function(username, password)
    {
	    var encoded = Base64.encode(username+':'+password);
        $cookieStore.put("username",username);
        Restangular.setDefaultHeaders({'Authorization': 'Basic ' + encoded });
        $location.path( "/auth" );
    }
});

kurubeeApp.controller('AuthCtrl',function($scope, $location, $routeParams, $cookieStore, Restangular) {
  var baseToken = Restangular.all('token');
  // This will query /token and return a promise.
  baseToken.getList().then(function(token) {
    $cookieStore.put("token",token[0].key);
    Restangular.setDefaultHeaders({}) ;
    Restangular.setDefaultRequestParams({"api_key":token[0].key,"username":$cookieStore.get("username")});
    $location.path( "/courses" );
  });
});
