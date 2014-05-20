

kurubeeApp.controller('LevelDetailCtrl', ['Aux', '$route', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux, $route, $scope, $location, Restangular,$cookieStore, $routeParams) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/activity/?level_type=' + $routeParams.levelId + '&career=' + $routeParams.courseId);
    $scope.level = $routeParams.levelId;
    baseActivities.getList().then(function(activities){
        $scope.loaded = true;
        $scope.courseName =  $cookieStore.courseName;
        $scope.activities = [];
        for (var j=0;j<activities.length;j++)
        {
            $scope.activities[j] = activities[j];
        }    
    });
    $scope.accessActivity = function(activity) {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/" + activity.activity_type +"/" + activity.id);    
    };
    
    $scope.createActivity = function() {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/"+$scope.activityType+"/" );       
    };
    
    $scope.askRemoveActivity = function(activity) {
      
       console.log(activity);
      
    };
    
    $scope.removeActivity = function(activity) {
       $scope.loaded = false;
       var baseActivity = Restangular.one('editor/activity', activity.id);
       baseActivity.remove().then(function(){
           $scope.loaded = true;
           $route.reload();
       });    
    };
    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId);   
    };
    
}]);

