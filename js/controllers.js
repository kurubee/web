var kurubeeControllers  = angular.module('kurubeeControllers', []);

kurubeeApp.controller('AppController', function($scope, $cookieStore) {
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
    $scope.languages = {
        en : "English",
        es : "Spanish",
        fr : "French",
        ar : "Arabic"
    };
    $scope.career_types = {
        explore : "Explore",
        exam : "Exam"
    };
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseKnowledges = Restangular.one('editor/knowledge');
    baseKnowledges.getList().then(function(knowledges){
        $scope.knowledges = {};
        $scope.knowledges[knowledges[0].resource_uri] = knowledges[0].name;
        console.log($scope.knowledges);
        var baseCourse = Restangular.one('editor/career', $routeParams.courseId);
        $scope.user = $cookieStore.get("username");
        baseCourse.get().then(function(course1){
            $scope.course = Restangular.copy(course1);
            $scope.course.levels.push("new");
            $scope.language = $scope.course.language_code;
            $scope.career_type = $scope.course.career_type;
            $scope.knowledge = $scope.course.knowledges[0];
        });

        $scope.save = function() {
            $scope.disable_save_button = true;
            $scope.saved = false;
            $scope.course.language_code = $scope.language;
            $scope.course.career_type = $scope.career_type;
            $scope.course.knowledges = [$scope.knowledge];
            $scope.course.put().then(function() 
            {
                $scope.disable_save_button = false;
                $scope.saved = true;
                setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
            }, function() {
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

kurubeeApp.controller('NewQuizActivityCtrl', function($scope, $location, Restangular,$cookieStore, $routeParams) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/activity');
    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";
    console.log($routeParams.levelId);    
    $scope.saveActivity = function() {
       var baseActivity = {
            name : $scope.name,
            query : $scope.query,
            career : "/api/v1/editor/career/" + $routeParams.courseId ,
            language_code : "en",
            level_type : $routeParams.levelId,
            level_order : 0,
            level_required : true,
            reward : "wena!",
            penalty : "mala!",
            activity_type : 'quiz'
       };
       baseActivities.post(baseActivity).then(function ()
       {
            console.log('salvado!');
       });
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
