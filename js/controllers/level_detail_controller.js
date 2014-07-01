kurubeeApp.controller('LevelDetailCtrl', ['Aux', '$route', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux, $route, $scope, $location, Restangular,$cookieStore, $routeParams) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/activity/?level_type=' + $routeParams.levelId + '&career=' + $routeParams.courseId);
    $scope.level = $routeParams.levelId;
    baseActivities.getList().then(function(activities){
        //If there is activities in the course, take the course name from the first activity
        if(activities.length != 0)
        {
            $scope.courseName = activities[0].career;
        }//If not, take course name from cookiestore
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
    //Next functions deploy the remove activity menu using evet and display css property
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
       event.target.parentElement.parentElement.parentElement.style.display="none";
       event.target.parentElement.parentElement.parentElement.parentElement.children[1].style.display="block";
       event.target.parentElement.parentElement.parentElement.style.display="none";

       var baseActivity = Restangular.one('editor/activity', activity.id);
       baseActivity.remove().then(function(){
            event.target.parentElement.parentElement.parentElement.parentElement.style.display="none";
       });   
    };
    $scope.upActivity = function(activity,event) {
       var tempId=activity.id;
       var baseActivity = Restangular.one('editor/activity', activity.id);
       $scope.loadingActivities=true; 
       baseActivity.get().then(function(activity1){
            act = Restangular.copy(activity1);
            delete act.career;
            act.level_order--;
            act.put().then(function(){
               activity.level_order--; 
               var newItems = [];
               angular.forEach($scope.activities, function(obj){
                    //I need to realad the whole array manually in order to make angular to notice the change
                    if(obj.id!=tempId)
                    {
                        this.push({name:obj.name,query:obj.query,id:obj.id,level_order:obj.level_order});
                    }else
                    {
                       this.push({name:obj.name,query:obj.query,id:obj.id,level_order:obj.level_order-1});
                    }
               },newItems)
               $scope.activities = newItems;               
               $scope.loadingActivities=false; 
            });
       });
    };
    $scope.downActivity = function(activity) {
       var tempId=activity.id;
       $scope.loadingActivities=true; 
       var baseActivity = Restangular.one('editor/activity', activity.id);
       baseActivity.get().then(function(activity1){
            act = Restangular.copy(activity1);
            delete act.career;
            act.level_order++;
            act.put().then(function(){
               activity.level_order++; 
               var newItems = [];
               angular.forEach($scope.activities, function(obj){
                    //I need to realad the whole array manually in order to make angular to notice the change
                    if(obj.id!=tempId)
                    {
                        this.push({name:obj.name,query:obj.query,id:obj.id,level_order:obj.level_order});
                    }else
                    {
                       this.push({name:obj.name,query:obj.query,id:obj.id,level_order:obj.level_order+1});
                    }
               },newItems)
               $scope.activities = newItems;
               $scope.loadingActivities=false; 
            });
       });
    };

    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId);   
    };
    
}]);

