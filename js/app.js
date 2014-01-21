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
      otherwise({
        redirectTo: '/courses'
      });
  }]);
