var tastypieDataTransformer = function ($http) {
    return $http.defaults.transformResponse.concat([
        function (data, headersGetter) {
            var result = data.objects;
            result.meta = data.meta;
            return result;
        }
    ])
};

var kurubeeServices = angular.module('kurubeeServices', ['ngResource']);



kurubeeServices.factory('Course', ['$resource', '$http',
  function($resource, $http){
    return $resource('http://0.0.0.0:9090/api/v1/editorcareer/?format=jsonp:courseId', {}, {
	  query: {method:'GET', params:{courseId:''}, isArray:true}//, transformResponse: tastypieDataTransformer($http)} 
    });
  }]);
