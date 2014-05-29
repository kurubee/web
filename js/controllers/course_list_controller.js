 
kurubeeApp.controller('CourseListCtrl', function($location, $scope, Restangular,$cookieStore) {
    $scope.loaded=false;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseCourses = Restangular.all('editor/career');
    // This will query /courses and return a promise.
    baseCourses.getList().then(function(courses) {
        $scope.loaded=true;
        $scope.courses = courses
    });
    $scope.orderProp = 'timestamp';
    $scope.newCourse = function() {
       $location.path( "/courses/new");   
    };    
    $scope.removeCourse = function(index) {
       $location.path( "/remove/"+index);   
    }
});

