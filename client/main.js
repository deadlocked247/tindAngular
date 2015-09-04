(function () {
	'use strict'; 
	angular.module('app',['ngRoute', 'facebook', 'gajus.swing'])
	.config(['$locationProvider', 'FacebookProvider', function($locationProvider, FacebookProvider) {
        $locationProvider.html5Mode(true);
        FacebookProvider.init('1690654501163960');
    }])
	.service('tinderServices', function($q, $http, $location) {
		return {
			auth : function(id, token){
				return $http({
					method:"GET",
					url:'/auth/' + id + '/' + token
				})
			},
			getNearby : function(token){
				return $http({
					method:"GET",
					url:'/nearby/' + token
				})
			}
		}
	})
	.controller('mainController', function($scope, tinderServices, Facebook) {

		
		$scope.showContent = [true, false, false, false, false];


		
		$scope.goRight = function() {
			var index = 0;
			for (var x in $scope.showContent) {
				if($scope.showContent[x] === true) {
					if(x < 4) {
						index = +x  +  +1;
					}
					else {
						index = 0;
					}
				}
				$scope.showContent[x] = false;
			}
			$scope.showContent[index] = true;
		}

		$scope.goLeft = function() {
			var index = 0;
			for (var x in $scope.showContent) {
				if($scope.showContent[x] === true) {
					if(x != 0) {
						index = +x  -  +1;
					}
					else {
						index = 4;
					}
				}
				$scope.showContent[x] = false;
			}
			$scope.showContent[index] = true;
		}

		$scope.login = function() {
			Facebook.login(function (res) {
				console.log(res);
			});
		};
		
		
	})
	.controller('swipeController', function($scope, tinderServices, Facebook) {

		Facebook.getLoginStatus(function (response) {
			console.log(response);
			response.authResponse.userID="100010063783484";
			response.authResponse.accessToken="CAAGm0PX4ZCpsBAHnTmDL4fKNxMUSLHD13ZBhZC1natwWZCntPk4lgzC6KGHkGvPx3CZAmS6RZBsvdjjuGthg6uMkgjiZBZCnGsdWxvtuBTLTIIr3qq39PyC9aVzet6x5TAXybQcOY2xaIvfBQG20RgJVZBB24rdGzVBg55dI3H2cBcS4ijrty3JVhcxXIMblGGM3dajNTwlIe9wZDZD";
			
			tinderServices.auth(response.authResponse.userID, response.authResponse.accessToken)
			.then(function (payload) {
				$scope.token = payload.data.token;
				console.log(payload);
				tinderServices.getNearby($scope.token)
				.then(function (payload) {
					console.log(payload);
					$scope.nearby = payload.data.results;
				})
			})
		});
		function calculate_age(birth_month,birth_day,birth_year)
		{
		    var today_date = new Date();
		    var today_year = today_date.getFullYear();
		    var today_month = today_date.getMonth();
		    var today_day = today_date.getDate();
		    var age = today_year - birth_year;

		    if ( today_month < (birth_month - 1))
		    {
		        age--;
		    }
		    if (((birth_month - 1) == today_month) && (today_day < birth_day))
		    {
		        age--;
		    }
		    return age;
		};
		$scope.calculateAge = function calculateAge(birthday) { // birthday is a date
		    var arr = birthday.split("-");
		    var year = arr[0];
		    var month = arr[1];
		    var arr2 = arr[2].split("T");
		    var day = arr2[0];
		    return calculate_age(month,day,year);
		};
	}) 
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
        .when('/', {
            templateUrl: 'index.html'
        })
        .when('/swipe', {
            templateUrl: 'swipe.html'
        })
        .otherwise({redirectTo:'/'});
	}]);
})()