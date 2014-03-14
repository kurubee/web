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

kurubeeApp.controller('CourseDetailCtrl', function($scope, Restangular,$cookieStore, $routeParams) {
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
    jsPlumb.ready(function() {
        jsPlumb.Defaults.Container = $("#row");
			var stateMachineConnector = {				
				connector:"Flowchart",
                paintStyle:{ lineWidth:1.5, strokeStyle:"green" },
				endpoint:"Blank",
				anchor:"Continuous",
				overlays:[ ["PlainArrow", {location:1, width:15, length:12} ]]
			};
        jsPlumb.connect({
            source:"title-description", 
            target:"title-input"},stateMachineConnector);

        jsPlumb.connect({
            source:"description-description", 
            target:"description-input"},stateMachineConnector);
    });
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
        $scope.course.put();
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
