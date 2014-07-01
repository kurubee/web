kurubeeApp.controller('TemporalActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    //$scope.changed take in account if a change was made to the model , in order to set the save button enabled
    $scope.changed = false;
    //$scope.changes take in account number of changes made to the model , in order to set the save button enabled
    $scope.changes = 0;
    //$scope.baseURL need to be setted in order to lad images from server (see /partials(temporal-detail.html)
    $scope.baseURL = 'http://0.0.0.0:8000';
    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/temporal');
    if(!$routeParams.activityId)
    {
        var baseCourse = Restangular.one('editor/career', $routeParams.courseId);
        baseCourse.get().then(function(course1){
            $scope.course = Restangular.copy(course1);
            $scope.courseName = $scope.course.name;

            $scope.activity = {
               name : "",
               query : "",
               career : "/api/v1/editor/career/" + $routeParams.courseId ,
               language_code : "en",
               level_type : $routeParams.levelId,
               level_order : 0,
               level_required : true,
               reward : "wena!",
               penalty : "mala!",
               activity_type : 'temporal',
               image: false,
               image_datetime: "",
               query_datetime: ""
            };
            $scope.changed = true;
         });
    }else
    {
        var baseActivity = Restangular.one('editor/temporal', $routeParams.activityId);
        baseActivity.get().then(function(activity1){
           $scope.activity = Restangular.copy(activity1);
           $scope.courseName = $scope.activity.career;
           $scope.activity.career = "/api/v1/editor/career/" + $routeParams.courseId;
           var img = document.getElementById("image");
           img.src = $scope.activity.image_base64;
           if($scope.activity.image_datetime < $scope.activity.query_datetime )
           {
                $scope.correct_answer = "before"
           }
           else
           {
                $scope.correct_answer = "after"
           }
           $scope.$watch("activity", $scope.detectChange ,true);
           $scope.$watch("correct_answer", $scope.detectChange ,true);
        });
    }
    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";
    $scope.detectChange = function () {
        console.log($scope.changes);
        if ($scope.changes>1)
        {
            console.log("cambio");
            $scope.changed = true;
        }
        $scope.changes ++;
    }  
    $scope.saveActivity = function() {
       if($scope.getCond())
       {
           if($scope.correct_answer == "before")
           {
                $scope.activity.image_datetime = "1970-01-01 00:00";
                $scope.activity.query_datetime = "1970-01-01 00:01";
           }
           else
           {
                $scope.activity.image_datetime = "1970-01-01 00:01";
                $scope.activity.query_datetime = "1970-01-01 00:00";       
           }
           $scope.disable_save_button = true;
           $scope.saved = false;
           if(!$routeParams.activityId)
           {
               baseActivities.post($scope.activity).then(function (resp)
               {
                    if(resp)
                    {
                        if(resp.status!=500) 
                        {
                            $scope.disable_save_button = false;
                            $scope.saved = true;
                            setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                        }
                    }else
                    {
                        $scope.disable_save_button = false;
                        $scope.saved = true;
                        setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                    }
               });
           }else
           {
               $scope.activity.put().then(function (resp)
               {
                    if(resp)
                    {
                        if(resp.status!=500) 
                        {
                            $scope.disable_save_button = false;
                            $scope.saved = true;
                            setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                        }
                    }else
                    {
                        $scope.disable_save_button = false;
                        $scope.saved = true;
                        setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                    }
               });
           }
       }
    };
    
    $scope.addImage = function() {
        $scope.showButton=false;
        var f = document.getElementById('file').files[0],
        r = new FileReader();
        r.onloadend = function(e){
           $scope.activity.image = e.target.result;
           var img = document.getElementById("image");
           $scope.baseURL ="";
           img.src = e.target.result;
           $scope.$apply(function() {
              $scope.changed=true;
           });
        }
        r.readAsDataURL(f);
    };
    
    $scope.getCond = function() {   
        if( $scope.activity )
        {
            return !$scope.disable_save_button && $scope.activity.image && $scope.correct_answer && $scope.changed && $scope.activity.name && $scope.activity.query;
        }else
        {
            return false;
        }
    };
    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId + "/levels/" + $routeParams.levelId);   
    };
    $scope.toCareer = function() { 
        $location.path( "/courses/" + $routeParams.courseId);   
    };
    
}]);
