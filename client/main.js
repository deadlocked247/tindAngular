(function () {
	'use strict'; 
	angular.module('app',['ngRoute', 'facebook', 'gajus.swing', 'ngCookies'])
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
			},
			login : function() {
				return $http({
					method:"GET",
					url:'/login'
				})
			},
			profile : function(token) {
				return $http({
					method:"GET",
					url:'/profile/' + token
				})
			}
		}
	})
	.controller('mainController', function($scope, $rootScope, tinderServices, Facebook, $http, $cookies) {

		
		$scope.showContent = [true, false, false, false, false];
		$scope.loginError = "";

		
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
			var url = $scope.fbUrl;
			$scope.loginError = "" ;
			if($scope.fbUrl) {
				var arr = url.split("=");

				if(arr[1]) {
					var subArr = arr[1].split("&");
					if(subArr) {

						var accessToken = subArr[0];
						var expiration = arr[2];
						if(accessToken && expiration) {
							Facebook.login(function (response) {
								$cookies.put('tindAngularToken', accessToken, {'expires': expiration});
								$cookies.put('tindAngularID', response.authResponse.userID, {'expires': expiration});

								$scope.loginError = "";
								window.location.assign("/swipe");

							})
							
						}
						else {
							$scope.loginError = "We couldn't parse that text, try again please" ;
						}
					}
					else {
						$scope.loginError = "We couldn't parse the expiration token, try again please" ;
					}
				}
				else {
					$scope.loginError = "We couldn't parse the token, try again please" ;
				}
				
			}
			else {
				$scope.loginError = "Please enter the URL" ;
			}

		};
		
		
	})
	.controller('swipeController', function($scope, $cookies, tinderServices, Facebook) {
		
		$scope.refresh = function() {
			var token = $cookies.get('tindAngularToken');
			var id = $cookies.get('tindAngularID');
			if(token && id) {
				tinderServices.auth(id, token)
				.then(function (payload) {
					$scope.token = payload.data.token;
					tinderServices.getNearby(payload.data.token)
					.then(function (payload) {
						$scope.nearby = payload.data.results;
					});
					tinderServices.profile(payload.data.token)
					.then(function (payload) {
						console.log(payload.data);
						$scope.user = payload.data;
					})
				})
			}
			else {
				window.location.assign("/");
			}
		}

		$scope.refresh();
	

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