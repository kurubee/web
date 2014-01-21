var kurubeeControllers  = angular.module('kurubeeControllers', []);
 
kurubeeApp.controller('CourseListCtrl', ['$scope', 'Course', function($scope, Course) {
  $scope.courses = Course.query();
  $scope.orderProp = 'timestamp';
}]);

kurubeeApp.controller('CourseDetailCtrl', ['$scope', '$routeParams', 'Course', function($scope, $routeParams, Course) {
  $scope.course = Course.get({courseId: $routeParams.courseId}, function(phone) {
});
}]);
