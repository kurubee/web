kurubeeApp.controller('PlayerStatsCtrl',function($scope,$rootScope, $location, $routeParams, $cookieStore, Restangular) {
    $scope.courseName =  $cookieStore.courseName;        
    $scope.courseId =  $routeParams.courseId;    
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseStats = Restangular.one('topscores',$routeParams.courseId);
    $scope.items=[];
    baseStats.get().then(function(scores){
        var baseCourse = Restangular.one('editor/career', $routeParams.courseId);
        baseCourse.get().then(function(course1){
             $scope.course = Restangular.copy(course1);
             $scope.courseName = $scope.course.name;
             $scope.items = Restangular.copy(scores).scores;
        });
    });
    
    $scope.toCareer = function() { 
        $location.path( "/courses/" + $routeParams.courseId);   
    };
});
kurubeeApp.controller('HourStatsCtrl',function($scope,$rootScope, $location, $routeParams, $cookieStore, Restangular) {
    $scope.courseName =  $cookieStore.courseName;        
    $scope.courseId =  $routeParams.courseId;        
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseStats = Restangular.one('hours',$routeParams.courseId);
    $scope.items=[];
    baseStats.get().then(function(hours){
        var baseCourse = Restangular.one('editor/career', $routeParams.courseId);
        baseCourse.get().then(function(course1){
             $scope.course = Restangular.copy(course1);
             $scope.courseName = $scope.course.name;
             $scope.items = Restangular.copy(hours).hours;
        });
    });
    
    $scope.toCareer = function() { 
        $location.path( "/courses/" + $routeParams.courseId);   
    };
});
kurubeeApp.controller('DayStatsCtrl',function($scope,$rootScope, $location, $routeParams, $cookieStore, Restangular) {
    $scope.courseName =  $cookieStore.courseName;
    $scope.courseId =  $routeParams.courseId;                
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseStats = Restangular.one('days',$routeParams.courseId);
    baseStats.get().then(function(days){
        var baseCourse = Restangular.one('editor/career', $routeParams.courseId);
        baseCourse.get().then(function(course1){
            $scope.course = Restangular.copy(course1);
            $scope.courseName = $scope.course.name;
            for(var i=0;i<days.days.length;i++)
            {
                switch(days.days[i].day)
                {
                    case 0:
                        days.days[i].day="Monday";
                        break;
                    case 1:
                        days.days[i].day="Tuesday";
                        break;
                    case 2:
                        days.days[i].day="Wednsday";
                         break;
                    case 3:
                        days.days[i].day="Thursday";
                        break;
                    case 4:
                        days.days[i].day="Friday";
                         break;
                    case 5:
                        days.days[i].day="Saturday";
                         break;
                    case 6:
                        days.days[i].day="Sunday";                                        
                        break;
                }
                
            }
           //days are not assigned to $scope.items because they don't need pagination
           $scope.days=days.days;
       });
    });
    
    $scope.toCareer = function() { 
        $location.path( "/courses/" + $routeParams.courseId);   
    };
});


kurubeeApp.controller("PaginationCtrl", function($scope) {
    
  $scope.itemsPerPage = 10;
  $scope.currentPage = 0;



  $scope.prevPage = function() {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };

  $scope.prevPageDisabled = function() {
    return $scope.currentPage === 0 ? "disabled" : "";
  };

  $scope.pageCount = function() {
    return Math.ceil($scope.items.length/$scope.itemsPerPage)-1;
  };

  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pageCount()) {
      $scope.currentPage++;
    }
  };

  $scope.nextPageDisabled = function() {
    return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
  };

});
