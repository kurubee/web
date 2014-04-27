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
    $scope.back = function() { 
       window.history.back();
    };
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
            Aux.setCourseName($scope.course.name);
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
           console.log(index);
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + (index + 1));   
        };
    });   
}]);


kurubeeApp.controller('LevelDetailCtrl', ['Aux', '$route', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux, $route, $scope, $location, Restangular,$cookieStore, $routeParams) {
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/activity/?level_type=' + $routeParams.levelId + '&career=' + $routeParams.courseId);
    $scope.level = $routeParams.levelId;
    baseActivities.getList().then(function(activities){
        $scope.loaded = true;
        $scope.courseName = Aux.getCourseName();
        $scope.activities = [];
        for (var j=0;j<activities.length;j++)
        {
            console.log(j);
            $scope.activities[j] = activities[j];
        }    
    });
    $scope.accessActivity = function(activity) {
       console.log(activity);
       if(activity.activity_type=="quiz")
       {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/QuizActivity/" + activity.id);
       }
       if(activity.activity_type=="temporal")
       {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/TemporalActivity/" + activity.id);
       }
       if(activity.activity_type=="visual")
       {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/VisualActivity/" + activity.id);
       }
       if(activity.activity_type=="linguistic")
       {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/LinguisticActivity/" + activity.id);
       }
       if(activity.activity_type=="geospatial")
       {
        $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/GeospatialActivity/" + activity.id);
       }

    };
    
    $scope.createActivity = function() {
       console.log($scope.activityType);
       if($scope.activityType == "temporal")
       {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/TemporalActivity" );       
       }
       if($scope.activityType == "quiz")
       {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/QuizActivity" );
       }
       if($scope.activityType == "visual")
       {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/VisualActivity" );
       }
       if($scope.activityType == "linguistic")
       {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/LinguisticActivity" );
       }
       if($scope.activityType == "geospatial")
       {
           $location.path( "/courses/"+$routeParams.courseId+"/levels/" + $routeParams.levelId + "/GeospatialActivity" );
       }
    };
    
    $scope.removeActivity = function(activity) {
       console.log(activity);
        $scope.loaded = false;
       var baseActivity = Restangular.one('editor/activity', activity.id);
       baseActivity.remove().then(function(){
           $scope.loaded = true;
           $route.reload();
       });    
    };
}]);

kurubeeApp.controller('QuizActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.disable_save_button = false;
    $scope.courseName = Aux.getCourseName();
    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/quiz');
    if(!$routeParams.activityId)
    {
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
                   console.log($scope.activity.answers[i]);
                   $scope.correct_answer =  $scope.activity.real_answers[i];               
               }
           }

           console.log($scope);
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
        console.log($scope.activity);
        
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
                    console.log('salvado!');
               });
           }else
           {
               $scope.activity.put().then(function ()
               {
                    $scope.disable_save_button = false;
                    $scope.saved = true;
                    setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                    console.log('salvado!');
               });
           }
       }
    };
    $scope.getCond = function() {   
        console.log($scope.disable_save_button);
        console.log($scope.activity.real_answers);
        console.log($scope.correct_answer);
        return !$scope.disable_save_button && $scope.activity.real_answers && $scope.correct_answer;
    };
}]);


kurubeeApp.controller('TemporalActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.courseName = Aux.getCourseName();
    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/temporal');
    if(!$routeParams.activityId)
    {
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
           image: "",
           image_datetime: "",
           query_datetime: ""
        };
    }else
    {
        var baseActivity = Restangular.one('editor/temporal', $routeParams.activityId);
        baseActivity.get().then(function(activity1){
           $scope.activity = Restangular.copy(activity1);
           $scope.activity.career = "/api/v1/editor/career/" + $routeParams.courseId;
           var img = document.getElementById("image");
           img.src = $scope.activity.image_base64;
           console.log($scope);
        });
    }
    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";

    $scope.saveActivity = function() {
       console.log($scope.correct_answer);
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
                console.log('salvado!');
           });
       }else
       {
           $scope.activity.put().then(function ()
           {
                $scope.disable_save_button = false;
                $scope.saved = true;
                setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                console.log('salvado!');
           });
       }
    };
    
    $scope.addImage = function() {
        console.log("re");
        var f = document.getElementById('file').files[0],
        r = new FileReader();
        r.onloadend = function(e){
           $scope.activity.image = e.target.result;
           console.log($scope.activity);
           var img = document.getElementById("image");
           img.src = e.target.result;
        }
        r.readAsDataURL(f);
    };
    
    $scope.getCond = function() {   
        return !$scope.disable_save_button && $scope.activity.image && $scope.correct_answer;
    };
}]);

kurubeeApp.controller('VisualActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.courseName = Aux.getCourseName();
    $scope.inAnswers = false;
    $scope.showButton = true;
    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/visual');
    if(!$routeParams.activityId)
    {
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
           image: "",
           answers : [],
           real_answers : [],
           correct_answer : ""
        };
    }else
    {
        var baseActivity = Restangular.one('editor/visual', $routeParams.activityId);
        baseActivity.get().then(function(activity1){
           $scope.activity = Restangular.copy(activity1);
           $scope.activity.career = "/api/v1/editor/career/" + $routeParams.courseId;
           var img = document.getElementById("image");
           img.src = $scope.activity.image_base64;
           console.log($scope);
        });
    }
    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";

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
                    console.log('salvado!');
               });
           }else
           {
               $scope.activity.put().then(function ()
               {
                    $scope.disable_save_button = false;
                    $scope.saved = true;
                    setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                    console.log('salvado!');
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
        console.log($scope.activity);
        
    };
    
    $scope.removeAnswer = function(index) {   
        $scope.activity.real_answers.splice(index, 1);
    };
    
    
    $scope.addImage = function() {
        console.log("asdasd");
        $scope.showButton=false;
        var f = document.getElementById('file').files[0],
        r = new FileReader();
        r.onloadend = function(e){
           $scope.activity.image = e.target.result;
           console.log($scope.activity);
           var img = document.getElementById("image");
           img.src = e.target.result;
        }
        r.readAsDataURL(f);
    };
    
    $scope.getCond = function() {   
        console.log($scope.disable_save_button);
        console.log($scope.correct_answer);
        return !$scope.disable_save_button && $scope.activity.image && $scope.correct_answer && $scope.activity.real_answers;
    };
}]);


kurubeeApp.controller('LinguisticActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.courseName = Aux.getCourseName();
    $scope.showButton = true;
    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/linguistic');
    if(!$routeParams.activityId)
    {
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
           image: '',
           answer : '',
        };
    }else
    {
        var baseActivity = Restangular.one('editor/linguistic', $routeParams.activityId);
        baseActivity.get().then(function(activity1){
           $scope.activity = Restangular.copy(activity1);
           $scope.activity.career = "/api/v1/editor/career/" + $routeParams.courseId;
           var img = document.getElementById("image");
           img.src = $scope.activity.image_base64;
           console.log($scope);
        });
    }
    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";

    $scope.saveActivity = function() {
      if($scope.activity.answer && $scope.activity.image)
       {
           $scope.activity.image ="";
           $scope.disable_save_button = true;
           $scope.saved = false;
           if(!$routeParams.activityId)
           {
               baseActivities.post($scope.activity).then(function ()
               {
                    $scope.disable_save_button = false;
                    $scope.saved = true;
                    setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                    console.log('salvado!');
               });
           }else
           {
               $scope.activity.put().then(function ()
               {
                    $scope.disable_save_button = false;
                    $scope.saved = true;
                    setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                    console.log('salvado!');
               });
           }
       }
    };
        
    $scope.addImage = function() {
        console.log("asdasd");
        $scope.showButton=false;
        var f = document.getElementById('file').files[0],
        r = new FileReader();
        r.onloadend = function(e){
           $scope.activity.image = e.target.result;
           console.log($scope.activity);
           var img = document.getElementById("image");
           img.src = e.target.result;
        }
        r.readAsDataURL(f);
    };
    
    $scope.getCond = function() {   
        console.log($scope.disable_save_button);
        console.log($scope.correct_answer);
        return !$scope.disable_save_button && $scope.activity.image && $scope.correct_answer && $scope.activity.real_answers;
    };
}]);


kurubeeApp.controller('GeospatialActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {
    $scope.courseName = Aux.getCourseName();
    $scope.showButton = true;
    $scope.level = $routeParams.levelId;
    Restangular.setDefaultHeaders({"Authorization": "ApiKey "+$cookieStore.get("username")+":"+$cookieStore.get("token")});
    var baseActivities = Restangular.all('editor/geospatial');
    if(!$routeParams.activityId)
    {
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
           points : [],
           radious: 100,
           area : [],
        };
        
    }else
    {
        var baseActivity = Restangular.one('editor/geospatial', $routeParams.activityId);
        baseActivity.get().then(function(activity1){
           $scope.activity = Restangular.copy(activity1);
           $scope.activity.career = "/api/v1/editor/career/" + $routeParams.courseId;
           console.log($scope);
        });
    }
    var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          panControl: false,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          overviewMapControl: false

    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

    $scope.name = "Type here Activity Name";
    $scope.query = "Type here Quiz Activity Query";

    $scope.saveActivity = function() {
      if($scope.activity.point)
       {
           $scope.activity.image ="";
           $scope.disable_save_button = true;
           $scope.saved = false;
           if(!$routeParams.activityId)
           {
               baseActivities.post($scope.activity).then(function ()
               {
                    $scope.disable_save_button = false;
                    $scope.saved = true;
                    setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                    console.log('salvado!');
               });
           }else
           {
               $scope.activity.put().then(function ()
               {
                    $scope.disable_save_button = false;
                    $scope.saved = true;
                    setTimeout(function(){angular.element(document.getElementById('saved-text')).addClass("vanish");},1000);
                    console.log('salvado!');
               });
           }
       }
    };
        
    $scope.getCond = function() {   
        console.log($scope.disable_save_button);
        console.log($scope.correct_answer);
        return !$scope.disable_save_button && $scope.activity.image && $scope.correct_answer && $scope.activity.real_answers;
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
