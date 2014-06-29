kurubeeApp.controller('GeospatialActivityCtrl', ['Aux', '$scope', '$location', 'Restangular','$cookieStore', '$routeParams', function(Aux,$scope, $location, Restangular,$cookieStore, $routeParams) {

    $scope.boundsChanged = false;
    $scope.changed = false;
    $scope.changes = 0;
    $scope.boundsChanges = 0;
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
        $scope.boundsChanged = true;
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
               activity_type : 'geospatial',
               points : { type: "MultiPoint", coordinates: [ [0,0 ] ] },
               radius: 100,
               area : "{ \"type\": \"Polygon\", \"coordinates\": [ [ [ -36.8697625630798, -33.67212899453614 ], [ -36.8697625630798, -33.672128994436136 ], [ 40.8255499369202, 33.77651858923237 ], [ -36.8697625630798, -33.67212899453614 ] ] ] }"
               
            };  
            $scope.changed = true;
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
                    $scope.marker = new google.maps.Marker({
                        map: $scope.map,
                        position: target,
                        flat: true,
                        clickable: false,
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
                            $scope.activity.points.coordinates[0][0] = e.latLng.A;
                            $scope.activity.points.coordinates[0][1] = e.latLng.k;
                            $scope.position=e.latLng;
                            $scope.marker = new google.maps.Marker({
                                map: $scope.map,
                                position: e.latLng,
                                flat: true,
                                clickable: false,
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



    }else
    {
        var baseActivity = Restangular.one('editor/geospatial', $routeParams.activityId);
        baseActivity.get().then(function(activity1){
            $scope.activity = Restangular.copy(activity1);
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
                $scope.marker = new google.maps.Marker({
                    map: $scope.map,
                   
                    position: target,
                    flat: true,
                    clickable: false,
                });
                $scope.mouseFlag = false;
                google.maps.event.addListener($scope.map, 'bounds_changed', function() {
                    if ($scope.boundsChanges>0)
                    {
                        $scope.$apply(function() {
                            $scope.changed=true;
                            $scope.boundsChanged = true;
                        });
                       
                    }
                    $scope.boundsChanges ++;
                });
                //Creating eventlisteners to set mark when click
                google.maps.event.addListener($scope.map, "mouseup", function (e)
                {
                    //ESTO SOLO DEBE EJECUTARSE SI NO SE HA MOVIDO, BANDERA nos indica si se ha movido el cursor mientras movíamos o no.
                    if ($scope.mouseFlag === true) 
                    {
                        if ($scope.marker) {
                            $scope.marker.setMap(null);
                        }
                        $scope.position=e.latLng;
                        $scope.activity.points= {coordinates:[""]};
                        $scope.activity.points.coordinates[0]=[];
                        $scope.activity.points.coordinates[0][0] = e.latLng.A;
                        $scope.activity.points.coordinates[0][1] = e.latLng.k;
                        $scope.marker = new google.maps.Marker({
                            map: $scope.map,
                            position: e.latLng,
                            flat: true,
                            clickable: false,
                        });
                        $scope.updateCircle();
                        $scope.$apply(function() {
                          $scope.changed=true;
                        });
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
            $scope.$watch("radius", $scope.detectChange);
            $scope.$watch("magnitude", $scope.detectChange);
            $scope.$watch("activity.name", $scope.detectChange);
            $scope.$watch("activity.query", $scope.detectChange);
            
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
        var radio =$scope.radius;
        if($scope.magnitude=="km")
        {
            radio *=1000;
        }
        var populationOptions = {
          strokeColor: 'blue',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'blue',
          fillOpacity: 0.35,
          map: $scope.map,
          center: $scope.position,
          radius: parseInt(radio),
          clickable:false
        };
        // Add the circle for this city to the map.
        $scope.circle = new google.maps.Circle(populationOptions);
    };
    $scope.detectChange = function () {
        if ($scope.changes>4)
        {
            $scope.changed = true;
        }
        $scope.changes ++;
    }    
    $scope.saveActivity = function() {
      if($scope.getCond())
      {
          if($scope.magnitude=="km")
          {
              $scope.activity.radius =$scope.radius*1000;
          }
          else
          {
              $scope.activity.radius =$scope.radius;
          }
           $scope.activity.points = "{ \"type\": \"MultiPoint\", \"coordinates\": [ [ " + $scope.activity.points.coordinates[0][0] + "," + $scope.activity.points.coordinates[0][1] + " ] ] }";
           if($scope.boundsChanged)
           {
               var bounds = $scope.map.getBounds();
               var southWest = bounds.getSouthWest();
               var northEast = bounds.getNorthEast();
               $scope.activity.area = "{ \"type\": \"Polygon\", \"coordinates\": [ [ [ " + southWest.A + ", " + southWest.k + " ], [ " + southWest.A + ", " + (southWest.k + 0.0000000001) + " ], [ " + northEast.A + ", " + northEast.k + " ], [ " + southWest.A + ", " + southWest.k + " ] ] ] }";
           }else
           {
            $scope.activity.area = eval("(" + $scope.activity.area + ")");
            $scope.activity.area = "{ \"type\": \"Polygon\", \"coordinates\": [ [ [ " + $scope.activity.area.coordinates[0][0][0] + ", " + $scope.activity.area.coordinates[0][0][1] + " ], [ " + $scope.activity.area.coordinates[0][1][0] + ", " + $scope.activity.area.coordinates[0][1][1] + " ], [ " + $scope.activity.area.coordinates[0][2][0] + ", " + $scope.activity.area.coordinates[0][2][1] + " ], [ " + $scope.activity.area.coordinates[0][3][0] + ", " + $scope.activity.area.coordinates[0][3][1] + " ] ] ] }";
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
                }
                else
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
    
    
        
    $scope.getCond = function() {   
        if($scope.activity)
        {
            return !$scope.disable_save_button && $scope.activity.points && $scope.activity.radius && $scope.changed && $scope.activity.name && $scope.activity.query;
        }
        else
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
