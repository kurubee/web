kurubeeApp.controller('LinguisticActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
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
               name : "Activity Name",
               query : "Activity Query",
               career : "/api/v1/editor/career/" + $routeParams.courseId ,
               language_code : "en",
               level_type : $routeParams.levelId,
               level_order : 0,
               level_required : true,
               reward : "wena!",
               penalty : "mala!",
               activity_type : 'linguistic',
               locked_text : '',
               image: false,
               answer : '',
            };
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

    $scope.saveActivity = function() {
      if($scope.activity.locked_text && $scope.activity.image)
       {
           $scope.activity.answer = $scope.activity.locked_text;
           $scope.disable_save_button = true;
           $scope.saved = false;
           if(!$routeParams.activityId)
           {
               baseActivities.post($scope.activity).then(function ()
               {
                    $scope.disable_save_button = false;
                    $scope.saved = true;
                    setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
               });
           }else
           {
               $scope.activity.put().then(function ()
               {
                    $scope.disable_save_button = false;
                    $scope.saved = true;
                    setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
               });
           }
       }
    };
        
    $scope.addImage = function() {
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
        }
        r.readAsDataURL(f);
    };
    
    $scope.getCond = function() { 
        if( $scope.activity )
        {  
            return !$scope.disable_save_button && $scope.activity.image && $scope.activity.locked_text;
        }else
        {
            return false;
        }
    };
    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId + "/levels/" + $routeParams.levelId);   
    };
}]);
