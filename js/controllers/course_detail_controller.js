kurubeeApp.controller('CourseDetailCtrl',['Aux', '$scope', '$location','Restangular','$cookieStore', '$routeParams', function(Aux, $scope, $location,Restangular,$cookieStore, $routeParams) {
    $scope.cambios = 0;
    $scope.changed = false;
    $scope.fromSaved = false;
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
    if($routeParams.courseId=="new")
    {
        var baseKnowledges = Restangular.one('editor/knowledge');
        baseKnowledges.getList().then(function(knowledges){
            $scope.knowledges = {};
            //$scope.knowledges["prog"] = "programacion";
            $scope.knowledges[knowledges[0].resource_uri] = knowledges[0].name;
            $scope.course = {
                activities: [],
                career_type: "",
                code: "",
                description: "Type here the course description",
                knowledges: [],
                language_code: "",
                levels: [],
                name: "Course Name",
                published: false,
            };
            $scope.changed = true;
        });      
    }
    else
    {
        $scope.fromSaved = true;
        var baseKnowledges = Restangular.one('editor/knowledge');
        baseKnowledges.getList().then(function(knowledges){
            $scope.knowledges = {};
            //$scope.knowledges["prog"] = "programacion";
            $scope.knowledges[knowledges[0].resource_uri] = knowledges[0].name;
            var baseCourse = Restangular.one('editor/career', $routeParams.courseId);
            $scope.user = $cookieStore.get("username");
            baseCourse.get().then(function(course1){
                $scope.course = Restangular.copy(course1);
                $scope.language = $scope.course.language_code;
                $scope.career_type = $scope.course.career_type;
                $scope.knowledge = $scope.course.knowledges[0];
                $cookieStore.courseName = $scope.course.name;
                $scope.$watch("course", $scope.detectChange ,true);
                $scope.$watch("language", $scope.detectChange ,true);
                $scope.$watch("career_type", $scope.detectChange ,true);
                $scope.$watch("knowledge", $scope.detectChange ,true);                
            });
        });  
    }

    $scope.save = function() {
        if($scope.getCond())
        {
            $scope.disable_save_button = true;
            $scope.saved = false;
            $scope.course.language_code = $scope.language;
            $scope.course.career_type = $scope.career_type;
            $scope.course.activities=[];
            $scope.course.user={pk:0};
            console.log($routeParams.courseId);
            if($routeParams.courseId=="new")
            {
               $scope.course.knowledges=[$scope.knowledge];
               var baseCourses = Restangular.all('editor/career');
               baseCourses.post($scope.course).then(function (response)
               {
                    $scope.course.id=response.id;
                    $scope.fromSaved = true;
                    $scope.disable_save_button = false;
                    $scope.saved = true;
                    setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
               });
            }
            else
            {
                $scope.course.put().then(function() 
                {
                    $scope.disable_save_button = false;
                    $scope.saved = true;
                    setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                }, function() {
                    setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                });
            }
         }
    };
    
    $scope.detectChange = function () {
        console.log($scope.cambios);
        if ($scope.cambios>3)
        {
            console.log("cambio");
            $scope.changed = true;
        }
        $scope.cambios ++;
    }
    $scope.toLevel = function(index) {
       if($routeParams.courseId=="new")
       {
          $routeParams.courseId=$scope.course.id;
       }
       if(index=="new")
       {
            if($scope.fromSaved)
            {
                $location.path( "/courses/"+$routeParams.courseId+"/levels/" +  ($scope.course.levels.length+1));   
            }
       }
       else
       {
          $location.path( "/courses/"+$routeParams.courseId+"/levels/" + (index + 1));   
       }
    };
    $scope.back = function() { 
        $location.path( "/courses/");   
    };
    
    $scope.getCond = function() {
        if($scope.course)
        {
            //console.log($scope.changed);
            return !$scope.disable_save_button && $scope.language && $scope.career_type && $scope.knowledge && $scope.changed;
        }
        else
        {
          return false;
        }
    };
}]);
