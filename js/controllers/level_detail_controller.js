kurubeeApp.controller('LevelDetailCtrl', ['Aux', '$route', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux, $route, $scope, $location, Restangular,$cookieStore, $routeParams) {

    Array.prototype.swapItems = function(a, b){
        this[a] = this.splice(b, 1, this[a])[0];
        return this;
    }
    
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
    //Next functions deploy the remove activity menu using event and display css property
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
            for(var i=0;i<$scope.activities.length;i++)
            {
                if($scope.activities[i].id==activity.id)
                {
                    $scope.activities.splice(i,1);
                }
            }
       });   
    };
    $scope.upActivity = function(activity,event) {
       var indexAct;
       for(var i=0;i<$scope.activities.length;i++)
       {
            if($scope.activities[i].id==activity.id)
            {
                indexAct=i;
            }
       }
       if(indexAct>0)
       {
           var idPrevious = $scope.activities[indexAct-1].id;
           var temp = $scope.activities[indexAct-1].level_order;
           var current_order = $scope.activities[indexAct].level_order;
           $scope.activities[indexAct-1].level_order = $scope.activities[indexAct].level_order;
           $scope.activities[indexAct].level_order=temp;
           $scope.activities.swapItems(indexAct,indexAct-1);

           var baseActivity = Restangular.one('editor/activity', activity.id);
           $scope.loadingActivities=true; 
           baseActivity.get().then(function(activity1){
                act = Restangular.copy(activity1);
                //Server doesn't expect career attr in acitivty
                delete act.career;
                act.level_order=temp;
                act.put().then(function(){
                    var baseActivity1 = Restangular.one('editor/activity', idPrevious);
                    baseActivity1.get().then(function(activity2){
                        act1 = Restangular.copy(activity2);
                        delete act1.career;
                        act1.level_order=current_order;
                        act1.put().then(function(){
                           $scope.loadingActivities=false;                                     
                        });
                    });
                });
            });               
                        
       }
    };
    $scope.downActivity = function(activity,event) {
       var indexAct;
       for(var i=0;i<$scope.activities.length;i++)
       {
            if($scope.activities[i].id==activity.id)
            {
                indexAct=i;
            }
       }
       if(indexAct<$scope.activities.length)
       {
           var idNext = $scope.activities[indexAct+1].id;
           var temp = $scope.activities[indexAct+1].level_order;
           var current_order = $scope.activities[indexAct].level_order;
           $scope.activities[indexAct+1].level_order = $scope.activities[indexAct].level_order;
           $scope.activities[indexAct].level_order=temp;
           $scope.activities.swapItems(indexAct,indexAct+1);

           var baseActivity = Restangular.one('editor/activity', activity.id);
           $scope.loadingActivities=true; 
           baseActivity.get().then(function(activity1){
                act = Restangular.copy(activity1);
                //Server doesn't expect career attr in acitivty
                delete act.career;
                act.level_order=temp;
                act.put().then(function(){
                    var baseActivity1 = Restangular.one('editor/activity', idNext);
                    baseActivity1.get().then(function(activity2){
                        act1 = Restangular.copy(activity2);
                        delete act1.career;
                        act1.level_order=current_order;
                        act1.put().then(function(){
                           $scope.loadingActivities=false;                                     
                        });
                    });
                });
            });               
                        
       }
    };

    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId);   
    };
    
}]);

