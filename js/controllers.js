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
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseCourse = Restangular.one('career', $routeParams.courseId);
    $scope.user = $cookieStore.get("username");
    jsPlumb.ready(function() {
        jsPlumb.Defaults.Container = $("#row");
        //jsPlumb.Defaults.Endpoints = [ [ "Dot", 7 ], [ "Dot", 7 ] ];
        			var stateMachineConnector = {				
				connector:"Straight",
            paintStyle:{ lineWidth:1.5, strokeStyle:"green" },
				endpoint:"Blank",
				anchor:"Continuous",
				overlays:[ ["PlainArrow", {location:1, width:15, length:12} ]]
			};
        jsPlumb.connect({
            source:"title-description", 
            target:"title-input"},stateMachineConnector);
/*            anchors:[ [ 0.52,0.5, 0, 0 ],[ 0.3,0, 0, 0 ] ],
            paintStyle:{ lineWidth:1, strokeStyle:"#858C91" },
            connector: "StateMachine",
            endpoint:"Blank",
            endpointStyles:[{fillStyle:"#858C91"}, {fillStyle:"#858C91"}]
        });*/
        jsPlumb.connect({
            source:"description-description", 
            target:"description-input"},stateMachineConnector);
            /*anchors:[ "RightMiddle",[ 0.3,0, 0, 0 ] ],
            paintStyle:{ lineWidth:1, strokeStyle:"#858C91" },
            connector:"StateMachine",
            endpoint:"Blank",
            endpointStyles:[{fillStyle:"#858C91"}, {fillStyle:"#858C91"}]
        });*/
    });
    baseCourse.get().then(function(course1){
        $scope.course = Restangular.copy(course1);
    });
    $scope.save = function() {
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
