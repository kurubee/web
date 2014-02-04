var kurubeeControllers  = angular.module('kurubeeControllers', []);
 
kurubeeApp.controller('CourseListCtrl', function($scope, Restangular,$cookieStore) {
    Restangular.setDefaultHeaders({'Authorization': 'Basic ' + $cookieStore.get("encoded") });
    Restangular.setDefaultRequestParams({ apiKey: $cookieStore.get("token") }) ;
    var baseCourses = Restangular.all('editor/career/');
    // This will query /courses and return a promise.
    baseCourses.getList().then(function(courses) {
        $scope.courses = courses;
    });
    $scope.orderProp = 'timestamp';
});

kurubeeApp.controller('LoginCtrl', function($scope, $location, $routeParams,$cookieStore, Restangular) {
    $scope.login = function(username, password)
    {
	    var encoded = Base64.encode(username+':'+password);
        $cookieStore.put("encoded",encoded);
        Restangular.setDefaultHeaders({'Authorization': 'Basic ' + encoded });
        $location.path( "/auth" );
    }
});

kurubeeApp.controller('AuthCtrl',function($scope, $location, $routeParams, $cookieStore, Restangular) {
  var baseToken = Restangular.all('editor/token/');
  // This will query /courses and return a promise.
  baseToken.getList().then(function(token) {
    $cookieStore.put("token",token);
    Restangular.setDefaultRequestParams({ apiKey: token }) ;
    $location.path( "/courses" );
  });
});
