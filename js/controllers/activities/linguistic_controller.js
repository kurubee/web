kurubeeApp.controller('LinguisticActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.changed = false;
    $scope.changes = 0;
    $scope.baseURL = 'http://0.0.0.0:8000';
    $scope.showButton = true;
    $scope.hideGrid = true;
    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/linguistic');
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
               activity_type : 'linguistic',
               locked_text : 'your answer here',
               image: false,
               answer : '',
            };
            $scope.refreshLockedText();
            $scope.changed = true;
        });
    }else
    {
        var baseActivity = Restangular.one('editor/linguistic', $routeParams.activityId);
        baseActivity.get().then(function(activity1){
           $scope.activity = Restangular.copy(activity1);
           $scope.courseName = $scope.activity.career;
           $scope.activity.career = "/api/v1/editor/career/" + $routeParams.courseId;
           var img = document.getElementById("image");
           img.src = $scope.activity.image_base64;

           img.onload = function () {
               document.getElementById('squares').style.display = "block";
               document.getElementById("squares").style.height = img.clientHeight+"px";
           };
           $scope.refreshLockedText();
           $scope.$watch("activity", $scope.detectChange ,true);
        });
    }
    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";

    $scope.refreshLockedText = function() {
        var textHide = " ";
        for (cont in $scope.activity.locked_text) {
            if($scope.activity.locked_text[cont]!=" ")
            {
                textHide += "_  ";
            }
            else
            {
                textHide += "&nbsp; ";
            }
        }
        document.getElementById('hideText').innerHTML=textHide;
    };
    $scope.detectChange = function () {
        console.log($scope.changes);
        if ($scope.changes>0)
        {
            console.log("cambio");
            $scope.changed = true;
        }
        $scope.changes ++;
    }    
    $scope.saveActivity = function() {
      if($scope.getCond())
       {
           $scope.activity.answer = $scope.activity.locked_text;
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
        $scope.activity.image = 1;
        document.getElementById('squares').style.display = "block";
        $scope.showButton=false;
        var f = document.getElementById('file').files[0],
        r = new FileReader();
        r.onloadend = function(e){
           $scope.activity.image = e.target.result;
           var img = document.getElementById("image");
           $scope.baseURL ="";
           img.src = e.target.result;
           document.getElementById("squares").style.height = img.clientHeight+"px";
           $scope.$apply(function() {
              $scope.changed=true;
           });
        }
        r.readAsDataURL(f);
    };
    
    $scope.getCond = function() { 
        if( $scope.activity )
        {  
            console.log(!$scope.disable_save_button && $scope.activity.image && $scope.activity.locked_text && $scope.changed);
            return !$scope.disable_save_button && $scope.activity.image && $scope.activity.locked_text && $scope.changed && $scope.activity.name && $scope.activity.query;
        }else
        {
            return false;
        }
    };
    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId + "/levels/" + $routeParams.levelId);   
    };
}]);
