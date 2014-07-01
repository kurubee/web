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
            var baseCourse = Restangular.one('editor/career', $routeParams.courseId);
            baseCourse.get().then(function(course1){
                 $scope.course = Restangular.copy(course1);
                 $scope.courseName = $scope.course.name;
            });
            
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
       if(activity.level_order>0)
       {
           var tempId=activity.id;
           var baseActivity = Restangular.one('editor/activity', activity.id);
           $scope.loadingActivities=true; 
           baseActivity.get().then(function(activity1){
                act = Restangular.copy(activity1);
                //Server doesn't expect career attr in acitivty
                delete act.career;
                current_order = act.level_order
                act.level_order--;
                act.put().then(function(){
                   activity.level_order--; 
                   var newItems = [];
                   angular.forEach($scope.activities, function(obj){
                        //Is needed to reload the whole array manually in order to make angular to notice the change
                        if(obj.id!=tempId)
                        {
                            //If obj is the previous one we need to exchange the level_order and send this exchange to the server
                            if(obj.level_order==current_order-1)
                            {
                                this.push({name:obj.name,query:obj.query,id:obj.id,level_order:current_order});
                                var baseActivity1 = Restangular.one('editor/activity', obj.id);
                                baseActivity1.get().then(function(activity2){
                                    act1 = Restangular.copy(activity2);
                                    delete act1.career;
                                    act1.level_order=current_order;
                                    act1.put().then(function(){
                                       $scope.loadingActivities=false;                                     
                                    });
                                });
                                   
                            }else
                            {
                                this.push({name:obj.name,query:obj.query,id:obj.id,level_order:obj.level_order});
                            }
                        }else
                        {
                           this.push({name:obj.name,query:obj.query,id:obj.id,level_order:obj.level_order-1});
                        }
                   },newItems)
                   $scope.activities = newItems;               

                });
           });
       }
    };
    $scope.downActivity = function(activity) {
       if(activity.level_order<$scope.activities.length-1)
       {
           var tempId=activity.id;
           $scope.loadingActivities=true; 
           var baseActivity = Restangular.one('editor/activity', activity.id);
           baseActivity.get().then(function(activity1){
                act = Restangular.copy(activity1);
                //Server doesn't expect career attr in acitivty
                delete act.career;
                current_order = act.level_order;
                act.level_order++;
                act.put().then(function(){
                   activity.level_order++; 
                   var newItems = [];
                   angular.forEach($scope.activities, function(obj){
                        //Is needed to realad the whole array manually in order to make angular to notice the change
                        if(obj.id!=tempId)
                        {
                           //If obj is the next one we need to exchange the level_order and send this exchange to the server
                            if(obj.level_order==current_order+1)
                            {
                                this.push({name:obj.name,query:obj.query,id:obj.id,level_order:current_order});
                                var baseActivity1 = Restangular.one('editor/activity', obj.id);
                                baseActivity1.get().then(function(activity2){
                                    act1 = Restangular.copy(activity2);
                                    delete act1.career;
                                    act1.level_order=current_order;
                                    act1.put().then(function(){
                                       $scope.loadingActivities=false;                                     
                                    });
                                });
                            }else
                            {
                                this.push({name:obj.name,query:obj.query,id:obj.id,level_order:obj.level_order});
                            }
                        }else
                        {
                           this.push({name:obj.name,query:obj.query,id:obj.id,level_order:obj.level_order+1});
                        }
                   },newItems)
                   $scope.activities = newItems;
                   $scope.loadingActivities=false; 
                });
           });
       }
    };

    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId);   
    };
    
}]);

