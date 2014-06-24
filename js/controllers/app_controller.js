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

kurubeeApp.controller('ErrorCtrl',function($scope,$rootScope, $location, $routeParams, $cookieStore, Restangular) {
    $scope.back = function() {
        history.back();
    }
});

kurubeeApp.controller('PlayerStatsCtrl',function($scope,$rootScope, $location, $routeParams, $cookieStore, Restangular) {
    $scope.courseName =  $cookieStore.courseName;        
    $scope.courseId =  $routeParams.courseId;    
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseStats = Restangular.one('topscores',$routeParams.courseId);
    baseStats.get().then(function(scores){
        //$scope.scores = Restangular.copy(scores).scores;
        console.log($scope.scores);
    });
});
kurubeeApp.controller('HourStatsCtrl',function($scope,$rootScope, $location, $routeParams, $cookieStore, Restangular) {
    $scope.courseName =  $cookieStore.courseName;        
    $scope.courseId =  $routeParams.courseId;        
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseStats = Restangular.one('topscores',$routeParams.courseId);
    baseStats.get().then(function(scores){
        //$scope.items = Restangular.copy(scores).scores;
        console.log($scope.items);

    });
});
kurubeeApp.controller('DayStatsCtrl',function($scope,$rootScope, $location, $routeParams, $cookieStore, Restangular) {
    $scope.courseName =  $cookieStore.courseName;
    $scope.courseId =  $routeParams.courseId;                
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseStats = Restangular.one('topscores',$routeParams.courseId);
    baseStats.get().then(function(scores){
        //$scope.items = Restangular.copy(scores).scores;
        console.log($scope.items);

    });
});


kurubeeApp.controller("PaginationCtrl", function($scope) {
    
  $scope.itemsPerPage = 5;
  $scope.currentPage = 0;
  $scope.items = [];

  for (var i=0; i<50; i++) {
    $scope.items.push({
      id: i, name: "name "+ i, description: "description " + i
    });
  }

  $scope.prevPage = function() {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };

  $scope.prevPageDisabled = function() {
    return $scope.currentPage === 0 ? "disabled" : "";
  };

  $scope.pageCount = function() {
    return Math.ceil($scope.items.length/$scope.itemsPerPage)-1;
  };

  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pageCount()) {
      $scope.currentPage++;
    }
  };

  $scope.nextPageDisabled = function() {
    return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
  };

});
