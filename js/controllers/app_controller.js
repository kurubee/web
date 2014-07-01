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
});

kurubeeApp.controller('topbar-controller', function($scope,$cookieStore) {
    $scope.user = $cookieStore.get("username");
});

kurubeeApp.controller('RemoveCtrl', function($location, $scope, Restangular,$cookieStore,$routeParams) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseCourse = Restangular.one('editor/career',$routeParams.courseId);
    baseCourse.get().then(function(course1){
        $scope.course = Restangular.copy(course1);
    });
    $scope.yes = function(index) {
       baseCourse.remove().then(function(){
           $location.path( "/courses/");
       });
    }
    $scope.no = function(index) {
       $location.path( "/courses/");
    }
});

kurubeeApp.controller('LoginCtrl', function($scope, $location, $routeParams,$cookieStore, Restangular) {
    $scope.login = function(username, password)
    {
	    var encoded = Base64.encode(username+':'+password);
        $cookieStore.put("usernameTemp",username);
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
  baseToken.getList().then(function(token) {
    $cookieStore.put("token",token[0].key);
    Restangular.setDefaultHeaders({}) ;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("usernameTemp")+":"+$cookieStore.get("token")});
    console.log(token[0].key);
    if(token[0].key)
    {
        $location.path( "/courses" );
    }else
    {
        $location.path( "/login" );
    }
  });
});

kurubeeApp.controller('ErrorCtrl',function($scope,$rootScope, $location, $routeParams, $cookieStore, Restangular) {
    $scope.back = function() {
        history.back();
    }
});
