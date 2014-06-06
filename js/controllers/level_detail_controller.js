

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
    
    $scope.removeActivity = function(activity,event) {
       event.target.style.display="none";
       event.target.parentElement.children[1].style.display="block";
       event.target.parentElement.children[2].style.display="none";
       event.target.parentElement.children[3].style.display="none";
       event.target.parentElement.children[4].style.display="none";
    };
    $scope.noRemove = function(activity,event) {
       event.target.parentElement.style.display="none";
       event.target.parentElement.parentElement.children[0].style.display="block";
       event.target.parentElement.parentElement.children[2].style.display="block";
       event.target.parentElement.parentElement.children[3].style.display="block";
       event.target.parentElement.parentElement.children[4].style.display="block";
    };
    $scope.removeSure = function(activity,event) {
       console.log(event);
       event.target.parentElement.parentElement.parentElement.style.display="none";
       event.target.parentElement.parentElement.parentElement.parentElement.children[1].style.display="block";
       event.target.parentElement.parentElement.parentElement.style.display="none";

       var baseActivity = Restangular.one('editor/activity', activity.id);
       baseActivity.remove().then(function(){
            event.target.parentElement.parentElement.parentElement.parentElement.style.display="none";
       });   
    };
    $scope.upActivity = function(activity) {
       $scope.activities=[];
       var baseActivity = Restangular.one('editor/activity', activity.id);

       baseActivity.get().then(function(activity1){
            act = Restangular.copy(activity1);
            delete act.career;
            act.level_order--;
            act.put().then(function(){
               activity.level_order--; 
               $route.reload();
            });
       });
    };
    $scope.downActivity = function(activity) {
       $scope.activities=[];
       var baseActivity = Restangular.one('editor/activity', activity.id);
       baseActivity.get().then(function(activity1){
            act = Restangular.copy(activity1);
            delete act.career;
            act.level_order++;
            act.put().then(function(){
               activity.level_order++; 
               $route.reload();
            });
       });
    };

    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId);   
    };
    
}]);

