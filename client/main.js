(function () {
	'use strict'; 
	angular.module('app',[])
	.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])
	.service('tinderServices', function($q, $http, $location) {
		return {
			authUser : function(auth){
				return $http({
					method:"GET",
					url:'http://localhost:8000/auth/' + auth.fb_id + '/' + auth.fb_auth_token,
					data: auth
				})
			},
			getNearby : function(){
				return $http({
					method:"GET",
					url:'http://localhost:8000/nearby'
				})
			},
		}
	})
	.controller('mainController', function($scope, tinderServices) {
		$scope.test = 'hello';
		$scope.getData = function () {
			/*
			var data =
			{
				fb_id: $scope.fbID,
				fb_auth_token: $scope.fbAuth
			}; */
			var data =
			{
				fb_id: 'burak.aslan.7773631',
				fb_auth_token: 'CAAGm0PX4ZCpsBADOkseCV6Eox9xXhHuJZAp5kox8uaY9mJ6DViPTZCD7ZAvmw8ZBMMBVJ1LkuTHEVG8e7adfZBSYMuCNgQOtjQLitGw4iOS4bcWkwr4Leu92PKxAFrWDhvRztWZCAwFmlwDadGyBgxDKhH0vggHhLupLFsFRpMYzZAaznZA7ytZAoePBYt4ELV6xB5rwfA4lDuCAZDZD'
			}; 
			tinderServices.authUser(data)
			.then(function (payload) {
				console.log(payload);
			})
			.catch(function (payload) {
				console.log(payload);
			});
		}
	});
})()