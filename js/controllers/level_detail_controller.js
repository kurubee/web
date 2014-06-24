kurubeeApp.controller('LevelDetailCtrl', ['Aux', '$route', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux, $route, $scope, $location, Restangular,$cookieStore, $routeParams) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/activity/?level_type=' + $routeParams.levelId + '&career=' + $routeParams.courseId);
    $scope.level = $routeParams.levelId;
    baseActivities.getList().then(function(activities){
        if(activities.length != 0)
        {
            $scope.courseName = activities[0].career;
        }
        else
        {
            $scope.courseName =  $cookieStore.courseName;        
        }
        $scope.loaded = true;
        $scope.activities = [];
        for (var j=0;j<activities.length;j++)
        {
            $scope.activities[j] = activities[j];
        }    
    });
    $scope.accessActivity = function(activity) {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/" + activity.activity_type +"/" + activity.id);    
    };
    
    $scope.createActivity = function(type) {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/"+type+"/" );       
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
    $scope.upActivity = function(activity,event) {
       console.log(activity);
       console.log($scope.activities);
       console.log(event);

       var baseActivity = Restangular.one('editor/activity', activity.id);
       console.log(activity.level_order);
       $scope.loadingActivities=true; 

       baseActivity.get().then(function(activity1){
            act = Restangular.copy(activity1);
            delete act.career;
            act.level_order--;
            act.put().then(function(){
               activity.level_order--; 
               $route.reload();
               $scope.loadingActivities=false; 
            });
       });
    };
    $scope.downActivity = function(activity) {
       $scope.loadingActivities=true; 
       var baseActivity = Restangular.one('editor/activity', activity.id);
       baseActivity.get().then(function(activity1){
            act = Restangular.copy(activity1);
            delete act.career;
            act.level_order++;
            act.put().then(function(){
               activity.level_order++; 
               $route.reload();
               $scope.loadingActivities=false; 
            });
       });
    };

    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId);   
    };
    
}]);

