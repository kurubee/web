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
    $scope.career_types = ["explore","exam"];
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseCourse = Restangular.one('career', $routeParams.courseId);
    $scope.user = $cookieStore.get("username");
    baseCourse.get().then(function(course1){
        $scope.course = Restangular.copy(course1);
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
            if($scope.career_types[j] == $scope.course.career_type)
            {
                $scope.career_type = $scope.career_types[j];
                console.log($scope.career_type);
            }
        }
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
        console.log($scope.career_type);
        $scope.course.career_type = $scope.career_type;
        $scope.course.put().then(function() {
            $scope.disable_save_button = false;
            $scope.saved = true;

            console.log("Object saved OK");
            setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
        }, function() {
            console.log("There was an error while saving");
        });
    };
    
    $scope.createLevel = function() {
       $location.path( "/courses/"+$routeParams.courseId+"/levels/1" );
    };
});


kurubeeApp.controller('LevelDetailCtrl', function($scope, $location, Restangular,$cookieStore, $routeParams) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseCourse = Restangular.one('career', $routeParams.courseId);
    $scope.user = $cookieStore.get("username");
    console.log($routeParams.levelId);

    baseCourse.get().then(function(course1){
        $scope.course = Restangular.copy(course1);
        $scope.course.levelId = $routeParams.levelId;
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
  var baseToken = Restangular.all('token');
  // This will query /token and return a promise.
  baseToken.getList().then(function(token) {
    $cookieStore.put("token",token[0].key);
    Restangular.setDefaultHeaders({}) ;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    $rootScope.$broadcast('userLoggedChange',"in");
    $location.path( "/courses" );
  });
});
