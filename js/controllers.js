var kurubeeControllers  = angular.module('kurubeeControllers', []);

kurubeeApp.controller('AppController', function($scope, $cookieStore) {
    console.log($cookieStore.get("username"));
    if ($cookieStore.get("username"))
    {        
        $scope.menuUrl = function() {
            return "partials/navIn.html";
         };
    }
    else
    {
        $scope.menuUrl = function() {
            return "partials/navOut.html";
         };
    }
    $scope.$on("userLoggedChange",function(event,args) {
         if(args=="in")
         {
             $scope.menuUrl=function() {
                return "partials/navIn.html";
             };
         }else
         {
             $scope.menuUrl=function() {
                return "partials/navOut.html";
             };         
         }
     });
    $scope.back = function() { 
       window.history.back();
    };
});
  
kurubeeApp.controller('topbar-controller', function($scope,$cookieStore) {
    $scope.user = $cookieStore.get("username");
});
 
kurubeeApp.controller('CourseListCtrl', function($scope, Restangular,$cookieStore) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseCourses = Restangular.all('career');
    // This will query /courses and return a promise.
    baseCourses.getList().then(function(courses) {
        $scope.courses = courses
    });
    $scope.orderProp = 'timestamp';
});

kurubeeApp.controller('CourseDetailCtrl', function($scope, $location,Restangular,$cookieStore, $routeParams) {
    $scope.disable_save_button = false;
    $scope.saved = false;
    $scope.languages = [
        {name:'English', code:'en'},
        {name:'Spanish', code:'es'},
        {name:'French', code:'fr'},
        {name:'Arabic', code:'ar'}
    ];
    $scope.career_types = ["Explore","Exam"];
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    
    var baseKnowledges = Restangular.one('knowledge');
    baseKnowledges.getList().then(function(knowledges){
        $scope.knowledges = [];
        for (var j=0;j<knowledges.length;j++)
        {
            console.log(j);
            $scope.knowledges[j] = knowledges[j].name;
        }
        var baseCourse = Restangular.one('editor/career', $routeParams.courseId);
        $scope.user = $cookieStore.get("username");
        baseCourse.get().then(function(course1){
            $scope.course = Restangular.copy(course1);
            $scope.course.levels.push("new");
            console.log($scope.course);
            for (var i in $scope.languages)
            {
                if($scope.languages[i].code == $scope.course.language_code)
                {
                    $scope.language = $scope.languages[i];
                    console.log($scope.language);
                }
            }
            for (var j in $scope.career_types)
            {
                if($scope.career_types[j].toLowerCase() == $scope.course.career_type)
                {
                    $scope.career_type = $scope.career_types[j];
                    console.log($scope.career_type);
                }
            }
            for (var j=0;j<$scope.knowledges.length;j++)
            {
                console.log($scope.knowledges[j]);
                if($scope.course.knowledges[0])
                {
                    if($scope.knowledges[j] == $scope.course.knowledges[0].name)
                    {
                        
                        $scope.knowledge = $scope.knowledges[j];
                        console.log($scope.knowledge);
                    }
                 }
            }
            console.log($scope.knowledges);
        });

        $scope.save = function() {
            $scope.disable_save_button = true;
            $scope.saved = false;
            for (var i in $scope.languages)
            {
                console.log($scope.language);
                if($scope.languages[i].name == $scope.language.name)
                {
                    $scope.course.language_code = $scope.languages[i].code;
                    console.log($scope.course.language_code);
                }
            }
            for (var i in $scope.course.activities)
            {
                //$scope.course.activities[i][ "activity_url" ] = $scope.course.activities[i][ "full_activity_url" ];
                console.log($scope.course.activities[i].resource_uri);
                $scope.course.activities[i].resource_uri.replace("activityupdate","editor/activity");
                console.log($scope.course.activities[i].resource_uri);
                $scope.course.activities = [];
                $scope.course.knowledges = [];
                
            }
            console.log($scope.career_type);
            $scope.course.career_type = $scope.career_type.toLowerCase();
            console.log($scope);
            $scope.course.put().then(function() {
                $scope.disable_save_button = false;
                $scope.saved = true;

                console.log("Object saved OK");
                setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
            }, function() {
                console.log("There was an error while saving");
                setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
            });
        };
        
        $scope.toLevel = function(index) {
           console.log(index);
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + (index + 1));   
        };
    });
    
});


kurubeeApp.controller('LevelDetailCtrl', function($scope, $location, Restangular,$cookieStore, $routeParams) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/activity/?level_type=' + $routeParams.levelId + '&career=' + $routeParams.courseId);
    $scope.level = $routeParams.levelId;
    baseActivities.getList().then(function(activities){
        $scope.loaded = true;
        $scope.activities = [];
        for (var j=0;j<activities.length;j++)
        {
            console.log(j);
            $scope.activities[j] = activities[j];
        }    
    });
    
    $scope.createActivity = function() {
       $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/newQuizActivity" );
    };
});

kurubeeApp.controller('ActivityDetailCtrl', function($scope, $location, Restangular,$cookieStore, $routeParams) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/activity/?level_type=' + $routeParams.levelId + '&career=' + $routeParams.courseId);
    console.log($routeParams.levelId);
    baseActivities.getList().then(function(activities){
        $scope.activities = [];
        for (var j=0;j<activities.length;j++)
        {
            console.log(j);
            $scope.activities[j] = activities[j];
        }    
    });
    
    $scope.createActivity = function() {
       $location.path( "/courses/"+$routeParams.courseId+"/activities/1" );
    };
});



kurubeeApp.controller('LoginCtrl', function($scope, $location, $routeParams,$cookieStore, Restangular) {
    $scope.login = function(username, password)
    {
	    var encoded = Base64.encode(username+':'+password);
        $cookieStore.put("username",username);
        Restangular.setDefaultHeaders({'Authorization': 'Basic ' + encoded });
        $location.path( "/auth" );
    }
});

kurubeeApp.controller('LogoutCtrl', function($scope,$rootScope, $location, $routeParams,$cookieStore, Restangular) {
   $cookieStore.remove("username");
   $rootScope.$broadcast('userLoggedChange',"out");
   $location.path( "/login" );
});

kurubeeApp.controller('AuthCtrl',function($scope,$rootScope, $location, $routeParams, $cookieStore, Restangular) {
  var baseToken = Restangular.all('editor/token');
  // This will query /token and return a promise.
  baseToken.getList().then(function(token) {
    $cookieStore.put("token",token[0].key);
    Restangular.setDefaultHeaders({}) ;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    $rootScope.$broadcast('userLoggedChange',"in");
    $location.path( "/courses" );
  });
});
