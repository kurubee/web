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
 
kurubeeApp.controller('CourseListCtrl', function($scope, Restangular,$cookieStore) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseCourses = Restangular.all('editor/career');
    // This will query /courses and return a promise.
    baseCourses.getList().then(function(courses) {
        $scope.courses = courses
    });
    $scope.orderProp = 'timestamp';
    
});

kurubeeApp.controller('CourseDetailCtrl',['Aux', '$scope', '$location','Restangular','$cookieStore', '$routeParams', function(Aux, $scope, $location,Restangular,$cookieStore, $routeParams) {
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
    var baseKnowledges = Restangular.one('editor/knowledge');
    baseKnowledges.getList().then(function(knowledges){
        $scope.knowledges = {};
        $scope.knowledges["prog"] = "programacion";
        //$scope.knowledges[knowledges[0].resource_uri] = knowledges[0].name;
        var baseCourse = Restangular.one('editor/career', $routeParams.courseId);
        $scope.user = $cookieStore.get("username");
        baseCourse.get().then(function(course1){
            $scope.course = Restangular.copy(course1);
            $scope.course.levels.push("new");
            $scope.language = $scope.course.language_code;
            $scope.career_type = $scope.course.career_type;
            $scope.knowledge = $scope.course.knowledges[0];
            $cookieStore.courseName = $scope.course.name;
        });

        $scope.save = function() {
            $scope.disable_save_button = true;
            $scope.saved = false;
            $scope.course.language_code = $scope.language;
            $scope.course.career_type = $scope.career_type;
            $scope.course.knowledges = [$scope.knowledge];
            $scope.course.put().then(function() 
            {
                $scope.disable_save_button = false;
                $scope.saved = true;
                setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
            }, function() {
                setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
            });
        };
        
        $scope.toLevel = function(index) {
           /*console.log(angular.element(document.querySelector('#carousel')).scope());
           console.log(angular); 
           console.log(index);
           console.log($scope);*/
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + (index + 1));   
        };
        $scope.back = function() { 
            $location.path( "/courses/");   
        };
    });   
}]);


kurubeeApp.controller('LevelDetailCtrl', ['Aux', '$route', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux, $route, $scope, $location, Restangular,$cookieStore, $routeParams) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/activity/?level_type=' + $routeParams.levelId + '&career=' + $routeParams.courseId);
    $scope.level = $routeParams.levelId;
    baseActivities.getList().then(function(activities){
        $scope.loaded = true;
        $scope.courseName =  $cookieStore.courseName;
        $scope.activities = [];
        for (var j=0;j<activities.length;j++)
        {
            $scope.activities[j] = activities[j];
        }    
    });
    $scope.accessActivity = function(activity) {
       if(activity.activity_type=="quiz")
       {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/quiz/" + activity.id);
       }
       if(activity.activity_type=="temporal")
       {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/temporal/" + activity.id);
       }
       if(activity.activity_type=="visual")
       {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/visual/" + activity.id);
       }
       if(activity.activity_type=="linguistic")
       {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/linguistic/" + activity.id);
       }

       if(activity.activity_type=="geospatial")
       {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/geospatial/" + activity.id);
       }
       
       if(activity.activity_type=="relational")
       {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/relational/" + activity.id);
       }

    };
    
    $scope.createActivity = function() {
       if($scope.activityType == "temporal")
       {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/temporal" );       
       }
       if($scope.activityType == "quiz")
       {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/quiz" );
       }
       if($scope.activityType == "visual")
       {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/visual" );
       }
       if($scope.activityType == "linguistic")
       {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/linguistic" );
       }
       if($scope.activityType == "geospatial")
       {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/geospatial" );
       }
       if($scope.activityType == "relational")
       {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/relational" );
       }
    };
    
    $scope.removeActivity = function(activity) {
        $scope.loaded = false;
       var baseActivity = Restangular.one('editor/activity', activity.id);
       baseActivity.remove().then(function(){
           $scope.loaded = true;
           $route.reload();
       });    
    };
    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId);   
    };
    
}]);

kurubeeApp.controller('QuizActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.disable_save_button = false;

    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/quiz');
    if(!$routeParams.activityId)
    {
        console.log($cookieStore.courseName);
        $scope.courseName = $cookieStore.courseName;
        $scope.activity = {
           name : "Activity Name",
           query : "Activity Query",
           answers : [],
           real_answers : [{"value":"respuestano1"},{"value":"respuestano2"}],
           correct_answer : "",
           career : "/api/v1/editor/career/" + $routeParams.courseId ,
           language_code : "en",
           level_type : $routeParams.levelId,
           level_order : 0,
           level_required : true,
           reward : "wena!",
           penalty : "mala!",
           activity_type : 'quiz'
        };
    }else
    {
        var baseActivity = Restangular.one('editor/quiz', $routeParams.activityId);
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
        });
    }
    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";
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
    $scope.getCond = function() {   
        return !$scope.disable_save_button && $scope.correct_answer;
    };
    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId + "/levels/" + $routeParams.levelId);   
    };
    
}]);


kurubeeApp.controller('RelationalActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.disable_save_button = false;

    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/quiz');
    if(!$routeParams.activityId)
    {
        console.log($cookieStore.courseName);
        $scope.courseName = $cookieStore.courseName;
        $scope.activity = {
           name : "Activity Name",
           query : "Activity Query",
           answers : [],
           real_answers : [{"value":"respuestano1"},{"value":"respuestano2"}],
           correct_answer : "",
           career : "/api/v1/editor/career/" + $routeParams.courseId ,
           language_code : "en",
           level_type : $routeParams.levelId,
           level_order : 0,
           level_required : true,
           reward : "wena!",
           penalty : "mala!",
           activity_type : 'quiz'
        };
    }else
    {
        var baseActivity = Restangular.one('editor/quiz', $routeParams.activityId);
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
        });
    }
    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";
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
    $scope.getCond = function() {   
        return !$scope.disable_save_button && $scope.correct_answer;
    };
    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId + "/levels/" + $routeParams.levelId);   
    };
    
}]);

kurubeeApp.controller('TemporalActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.baseURL = 'http://0.0.0.0:8000';
    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/temporal');
    if(!$routeParams.activityId)
    {
        $scope.courseName = $cookieStore.courseName;
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
           activity_type : 'temporal',
           image: false,
           image_datetime: "",
           query_datetime: ""
        };
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
        });
    }
    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";

    $scope.saveActivity = function() {
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
            return !$scope.disable_save_button && $scope.activity.image && $scope.correct_answer;
        }else
        {
            return false;
        }
    };
    $scope.back = function() { 
        $location.path( "/courses/" + $routeParams.courseId + "/levels/" + $routeParams.levelId);   
    };
}]);

kurubeeApp.controller('VisualActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.baseURL = 'http://0.0.0.0:8000';
    $scope.inAnswers = false;
    $scope.showButton = true;
    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/visual');
    if(!$routeParams.activityId)
    {
        $scope.courseName = $cookieStore.courseName;
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


kurubeeApp.controller('LinguisticActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.baseURL = 'http://0.0.0.0:8000';
    $scope.showButton = true;
    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/linguistic');
    if(!$routeParams.activityId)
    {
        $scope.courseName = $cookieStore.courseName;
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
               console.log(img.clientHeight);
               document.getElementById("squares").style.height = img.clientHeight+"px";
           };
           $scope.refreshLockedText();
        });
    }
    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";

    $scope.refreshLockedText = function() {
        console.log("ola");
        var textHide = " ";
        for (cont in $scope.activity.locked_text) {
            textHide += "_  ";
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


kurubeeApp.controller('GeospatialActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.showButton = true;
    $scope.level = $routeParams.levelId;
    $scope.magnitudes = {
        km : "km",
        m : "m"
    };
    $scope.magnitude = "km";
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/geospatial');
    if(!$routeParams.activityId)
    {
        $scope.courseName = $cookieStore.courseName;
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
           activity_type : 'geospatial',
           points : { type: "MultiPoint", coordinates: [ [0,0 ] ] },
           radius: 100,
           area : "{ \"type\": \"Polygon\", \"coordinates\": [ [ [ -36.8697625630798, -33.67212899453614 ], [ -36.8697625630798, -33.672128994436136 ], [ 40.8255499369202, 33.77651858923237 ], [ -36.8697625630798, -33.67212899453614 ] ] ] }"
           
        };  
            $scope.radius = $scope.activity.radius;
            //$scope.activity.area = activity1.area;
            window.setTimeout(function(){
                var mapOptions = {
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  panControl: false,
                  zoomControl: false,
                  mapTypeControl: false,
                  scaleControl: false,
                  streetViewControl: false,
                  overviewMapControl: false,
                  maxZoom: null
                };
                $scope.map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
                //Getting first of target points as the only one valid
                var googleOptions = {
                        strokeColor: "#00FFFF",
                        strokeWeight: 0,
                        strokeOpacity: 0.5,
                        fillOpacity: 0.2,
                        fillColor: "#6699ff",
                        clickable: false
                };
                var geoPoints = new GeoJSON($scope.activity.points, googleOptions);
                var target = new google.maps.LatLng(geoPoints[0].position.lat(), geoPoints[0].position.lng());
                $scope.position=target;
                $scope.updateCircle();
                var jsonfromserver = JSON.parse($scope.activity.area);
                var googleVector = new GeoJSON(jsonfromserver, googleOptions);
                googleVector.color = "#FFOOOO";
                var puntosPoligono = googleVector.getPath();
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < puntosPoligono.j.length; i++) {
                    bounds.extend(puntosPoligono.j[i]);
                }
                $scope.map.fitBounds(bounds);
                var markerIcon = new google.maps.MarkerImage('img/marker.png');
                $scope.marker = new google.maps.Marker({
                    map: $scope.map,
                    position: target,
                    flat: true,
                    clickable: false,
                    icon: markerIcon
                });
                $scope.mouseFlag = false;
                //Creating eventlisteners to set mark when click
                google.maps.event.addListener($scope.map, "mouseup", function (e)
                {
                    //ESTO SOLO DEBE EJECUTARSE SI NO SE HA MOVIDO, BANDERA nos indica si se ha movido el cursor mientras movíamos o no.
                    if ($scope.mouseFlag === true) 
                    {
                        if ($scope.marker) {
                            $scope.marker.setMap(null);
                        }
                        var markerIcon = new google.maps.MarkerImage('img/marker.png');
                        $scope.activity.points.coordinates[0][0] = e.latLng.A;
                        $scope.activity.points.coordinates[0][1] = e.latLng.k;
                        $scope.position=e.latLng;
                        $scope.marker = new google.maps.Marker({
                            map: $scope.map,
                            position: e.latLng,
                            flat: true,
                            clickable: false,
                            icon: markerIcon
                        });
                        $scope.updateCircle();
                       
                    }
                });
                google.maps.event.addListener($scope.map, "mousemove", function (e)
                {
                    $scope.mouseFlag = false;
                });
                google.maps.event.addListener($scope.map, "mousedown", function (e)
                {
                    $scope.mouseFlag = true;
                });
            
            }, 100);
            




    }else
    {
        var baseActivity = Restangular.one('editor/geospatial', $routeParams.activityId);
        baseActivity.get().then(function(activity1){
            $scope.activity = Restangular.copy(activity1);
            console.log($scope.activity.radius);
            $scope.radius = $scope.activity.radius;
            if($scope.radius>1000)
            {
                $scope.radius = $scope.radius / 1000;
                $scope.magnitude = "km";
            }
            else
            {
               $scope.magnitude = "m";
            }

            $scope.courseName = $scope.activity.career;
            $scope.activity.career = "/api/v1/editor/career/" + $routeParams.courseId;
            window.setTimeout(function(){
                var mapOptions = {
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  panControl: false,
                  zoomControl: false,
                  mapTypeControl: false,
                  scaleControl: false,
                  streetViewControl: false,
                  overviewMapControl: false,
                  maxZoom: null
                };
                $scope.map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
                //Getting first of target points as the only one valid
                $scope.activity.points = JSON.parse( $scope.activity.points );
                var googleOptions = {
                        strokeColor: "#00FFFF",
                        strokeWeight: 0,
                        strokeOpacity: 0.5,
                        fillOpacity: 0.2,
                        fillColor: "#6699ff",
                        clickable: false
                };
                var geoPoints = new GeoJSON($scope.activity.points, googleOptions);
                var target = new google.maps.LatLng(geoPoints[0].position.lat(), geoPoints[0].position.lng());
                $scope.position=target;
                $scope.updateCircle();
                var jsonfromserver = JSON.parse($scope.activity.area);
                var googleVector = new GeoJSON(jsonfromserver, googleOptions);
                googleVector.color = "#FFOOOO";
                var puntosPoligono = googleVector.getPath();
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < puntosPoligono.j.length; i++) {
                    bounds.extend(puntosPoligono.j[i]);
                }
                $scope.map.fitBounds(bounds);
                var markerIcon = new google.maps.MarkerImage('img/marker.png');
                $scope.marker = new google.maps.Marker({
                    map: $scope.map,
                    position: target,
                    flat: true,
                    clickable: false,
                    icon: markerIcon
                });
                $scope.mouseFlag = false;
                //Creating eventlisteners to set mark when click
                google.maps.event.addListener($scope.map, "mouseup", function (e)
                {
                    //ESTO SOLO DEBE EJECUTARSE SI NO SE HA MOVIDO, BANDERA nos indica si se ha movido el cursor mientras movíamos o no.
                    if ($scope.mouseFlag === true) 
                    {
                        if ($scope.marker) {
                            $scope.marker.setMap(null);
                        }
                        var markerIcon = new google.maps.MarkerImage('img/marker.png');
                        $scope.position=e.latLng;
                        $scope.activity.points.coordinates[0][0] = e.latLng.A;
                        $scope.activity.points.coordinates[0][1] = e.latLng.k;
                        $scope.marker = new google.maps.Marker({
                            map: $scope.map,
                            position: e.latLng,
                            flat: true,
                            clickable: false,
                            icon: markerIcon
                        });
                        $scope.updateCircle();
                    }
                });
                google.maps.event.addListener($scope.map, "mousemove", function (e)
                {
                    $scope.mouseFlag = false;
                });
                google.maps.event.addListener($scope.map, "mousedown", function (e)
                {
                    $scope.mouseFlag = true;
                });
            
            }, 100);
            
        });
    }


    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";
    $scope.$watch('radius', function(newValue, oldValue) {
           $scope.updateCircle();
    }, true);
    $scope.$watch('magnitude', function(newValue, oldValue) {
           $scope.updateCircle();
    }, true);
    $scope.updateCircle = function() {
        if ($scope.circle) {
            $scope.circle.setMap(null);
        }
        console.log($scope.position);
        var radio =$scope.radius;
        if($scope.magnitude=="km")
        {
            radio *=1000;
        }
        console.log(radio);
        var populationOptions = {
          strokeColor: 'blue',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'blue',
          fillOpacity: 0.35,
          map: $scope.map,
          center: $scope.position,
          radius: parseInt(radio)
        };
        // Add the circle for this city to the map.
        $scope.circle = new google.maps.Circle(populationOptions);
    };
    $scope.saveActivity = function() {
      console.log($scope.magnitude);
      if($scope.magnitude=="km")
      {
          $scope.activity.radius =$scope.radius*1000;
      }
      else
      {
          $scope.activity.radius =$scope.radius;
      }
      if($scope.activity.points && $scope.activity.radius)
       {

           $scope.activity.points = "{ \"type\": \"MultiPoint\", \"coordinates\": [ [ " + $scope.activity.points.coordinates[0][0] + "," + $scope.activity.points.coordinates[0][1] + " ] ] }";
           console.log($scope.map.getBounds());
           var bounds = $scope.map.getBounds();
           var southWest = bounds.getSouthWest();
           console.log(southWest);
           var northEast = bounds.getNorthEast();
           console.log(northEast);
           $scope.activity.area = "{ \"type\": \"Polygon\", \"coordinates\": [ [ [ " + southWest.A + ", " + southWest.k + " ], [ " + southWest.A + ", " + (southWest.k + 0.0000000001) + " ], [ " + northEast.A + ", " + northEast.k + " ], [ " + southWest.A + ", " + southWest.k + " ] ] ] }";
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
    
    
        
    $scope.getCond = function() {   
        if($scope.activity)
        {
            return !$scope.disable_save_button && $scope.activity.points && $scope.activity.radius;
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
