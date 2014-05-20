kurubeeApp.controller('VisualActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.baseURL = 'http://0.0.0.0:8000';
    $scope.inAnswers = false;
    $scope.showButton = true;
    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/visual');
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
               activity_type : 'visual',
               image: false,
               answers : [],
               real_answers : [{"value":"respuestano1"},{"value":"respuestano2"}],
               correct_answer : "",
               time:5
            };
        })
    }else
    {
        var baseActivity = Restangular.one('editor/visual', $routeParams.activityId);
        baseActivity.get().then(function(activity1){
           
           $scope.activity = Restangular.copy(activity1);
           $scope.courseName = $scope.activity.career;
           $scope.activity.career = "/api/v1/editor/career/" + $routeParams.courseId;
           if(!$scope.activity.answers)
           {
               $scope.activity.answers = [];
           }
           $scope.activity.real_answers = [];
           for(var i=0;i<$scope.activity.answers.length;i++)
           {


               $scope.activity.real_answers[i] = {"value": $scope.activity.answers[i]};
               if($scope.activity.answers[i] == $scope.activity.correct_answer)
               {
                   $scope.correct_answer =  $scope.activity.real_answers[i];               
               }
           }
           var img = document.getElementById("image");
           img.src = $scope.activity.image;
        });
    }
    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Visual Activity Query";

    $scope.saveActivity = function() {
      if($scope.activity.answers && $scope.correct_answer)
       {
           $scope.disable_save_button = true;
           $scope.saved = false;
           if(!$scope.activity.answers)
           {
               $scope.activity.answers = [];
           }
           for(var i=0;i<$scope.activity.real_answers.length;i++)
           {
               $scope.activity.answers[i] = $scope.activity.real_answers[i].value;
           }
           $scope.activity.correct_answer = $scope.correct_answer.value;
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
    
    $scope.addAnswer = function() {   
        if(!$scope.activity.answers)
        {
            $scope.activity.answers = [];
        }
        if(!$scope.activity.real_answers)
        {
            $scope.activity.real_answers = [];
        }
        $scope.activity.real_answers.push({"value":"respuestano"+($scope.activity.real_answers.length+1)});
    };
    
    $scope.removeAnswer = function(index) {   
        $scope.activity.real_answers.splice(index, 1);
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
        }
        r.readAsDataURL(f);
    };
    
    $scope.getCond = function() {  
        if( $scope.activity )
        {
            var img = document.getElementById("image");
            img.src = $scope.baseURL+$scope.activity.image;
            return !$scope.disable_save_button && $scope.activity.time && $scope.correct_answer && $scope.activity.real_answers && $scope.activity.real_answers;
        }
        else
        {
            return false;
        }
    };
    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId + "/levels/" + $routeParams.levelId);   
    };
}]);
