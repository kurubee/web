var kurubeeControllers  = angular.module('kurubeeControllers', []);
 
kurubeeApp.controller('CourseListCtrl', ['$scope', 'loginService', 'Course', function($scope, loginService, Course) {
  $scope.username = loginService.getUsername();
  $scope.password = loginService.getPassword();
  $scope.courses = Course.query();
  $scope.orderProp = 'timestamp';
}]);

kurubeeApp.controller('CourseDetailCtrl', ['$scope', '$routeParams', 'Course', function($scope, $routeParams, Course) {
  $scope.course = Course.get({courseId: $routeParams.courseId}, function(phone) {
});
}]);

kurubeeApp.controller('LoginCtrl', ['$scope', 'loginService' ,'$location', '$routeParams', 'Course', function($scope,loginService, $location, $routeParams, Course) {
   $scope.login = function(username, password)
        {
            loginService.login(username,password);
            $location.path( "/courses" );
        }
}]);
