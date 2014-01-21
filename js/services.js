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
    return $resource('http://beta.drglearning.com/api/v1/career/:courseId', {}, {
	  query: {method:'GET', params:{courseId:''}, isArray:true, transformResponse: tastypieDataTransformer($http)} 
    });
  }]);
