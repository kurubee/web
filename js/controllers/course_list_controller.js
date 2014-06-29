 
kurubeeApp.controller('CourseListCtrl', function($location, $rootScope, $scope, Restangular,$cookieStore) {
    $scope.loaded=false;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("usernameTemp")+":"+$cookieStore.get("token")});
    var baseCourses = Restangular.all('editor/career');
    // This will query /courses and return a promise.
    baseCourses.getList().then(function(courses) {
        temp = $cookieStore.get("usernameTemp");
        $cookieStore.put("username",temp);
        $rootScope.$broadcast('userLoggedChange',"in");
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
    $scope.goToPlayerStats = function(index) {
       $location.path( "/players/"+index);   
    }
});

