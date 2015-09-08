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
			},
			swipeLeft : function(token, id) {
				return $http({
					method:"GET",
					url:'/swipeLeft/'+ token + '/' + id
				})
			},
			swipeRight : function(token, id) {
				return $http({
					method:"GET",
					url:'/swipeRight/'+ token + '/' + id
				})
			},
			getLocation : function(lon, lat) {
				return $http({
					method:"GET",
					url:'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&sensor=true'
				})
			}
		}
	})
	.controller('mainController', function($scope, tinderServices, Facebook, $http, $cookies) {

		
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

		$scope.loginCheck = function() {
			if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
				window.location.replace("https://itunes.apple.com/us/app/tinder/id547702041");
			}
			else {
				var token = $cookies.get('tindAngularToken');
				var id = $cookies.get('tindAngularID');
				if(token && id) {
					window.location.assign("/swipe");
				}
				else {
					$scope.fbOverlay = true;
				}
			}
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

								var exp = new Date(Date.now() + (expiration*1000));
								$cookies.put('tindAngularToken', accessToken, {'expires': exp});
								$cookies.put('tindAngularID', response.authResponse.userID, {'expires': exp});
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
	.controller('swipeController', function($scope, $cookies, $timeout, tinderServices, Facebook) {
		$('.profile-circle').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('.profile-circle').removeClass('animated bounceIn').addClass('circle-animate');
		});
		$scope.lastUser = false;
		$scope.leftClick = false;
		$scope.rightClick = false;
		$scope.locationCity = "";
		$scope.locationPop = false;
		$scope.match = false;
		
		
		$scope.getLastUser = function () {
			if($scope.lastUser) {
				$scope.lastUser.leftSwipe = false;
				$scope.lastUser.rightSwipe = false;
				$scope.nearby.push($scope.lastUser);
			}
		}

		$scope.swipeLeftClick = function () {
			$scope.leftClick = true;
			if(!$scope.rightClick) {
				var id = $scope.nearby[$scope.nearby.length - 1]._id;
				console.log($scope.nearby[$scope.nearby.length - 1])
				$scope.nearby[$scope.nearby.length - 1].leftSwipe = true;
				$('.nope').css({'opacity': 1});
				$scope.swipeLeft(id, ($scope.nearby.length-1));	
			}
		}


		$scope.swipeRightClick = function () {
			$scope.rightClick = true;
			if(!$scope.leftClick) {
				var id = $scope.nearby[$scope.nearby.length - 1]._id;
				console.log($scope.nearby[$scope.nearby.length - 1])
				$scope.nearby[$scope.nearby.length - 1].rightSwipe = true;
				$('.like').css({'opacity': 1});
				$scope.swipeRight(id, ($scope.nearby.length-1));
			}	
		}


		$scope.dragmove = function (eventName, eventObject) {
            if(eventObject.throwDirection > 0) {
            	$('.like').css({'opacity': eventObject.throwOutConfidence});
            	var min = Math.max(3, (eventObject.throwOutConfidence * 3));
            	$('.swipe-left-img').css({'border-width': ""});
            	$('.swipe-right-img').css({'border-width': min});
            }
            else {
            	var min = Math.max(3, (eventObject.throwOutConfidence * 3));
            	$('.nope').css({'opacity': eventObject.throwOutConfidence});
            	$('.swipe-right-img').css({'border-width': ""});
            	$('.swipe-left-img').css({'border-width': min});
            }
        };

        $scope.resetCard = function (eventName, eventObject) {
        	$('.nope').css({'opacity': 0});
        	$('.swipe-right-img').css({'border-width': ""});
        	$('.swipe-left-img').css({'border-width': ""});
			$scope.leftClick = false;
			$scope.rightClick = false;
        	$('.like').css({'opacity': 0});
        }

		$scope.swipeLeft = function(id, index) {

			$timeout(function() {
				$scope.lastUser = $scope.nearby[index];
				$scope.nearby.splice(index, 1);
				$scope.resetCard();
			}, 500);
			

			tinderServices.swipeLeft($scope.token, id)
			.then(function (payload) {
				if($scope.nearby.length === 1 ) {
					tinderServices.getNearby(payload.data.token)
					.then(function (payload) {
						$scope.nearby.push(payload.data.results);
					});
				}
			})
			.catch(function (payload) {
				console.log(payload)
			});
		}

		$scope.swipeRight = function(id, index) {
			var match = {
				name: $scope.nearby[index].name,
				picture: $scope.nearby[index].photos[0].url
			}
			$timeout(function() {
				$scope.lastUser = $scope.nearby[index];
				$scope.nearby.splice(index, 1);
				$scope.resetCard();
			}, 500);
			
			tinderServices.swipeRight($scope.token, id)
			.then(function (payload) {
				console.log(payload.data);
				if(payload.data.match) {
					$scope.match = match;
				}

				if($scope.nearby.length === 1 ) {
					tinderServices.getNearby(payload.data.token)
					.then(function (payload) {
						$scope.nearby.push(payload.data.results);
					});
				}
			})
			.catch(function (payload) {
				console.log(payload)
			});
		}

		$scope.refresh = function() {
			var token = $cookies.get('tindAngularToken');
			var id = $cookies.get('tindAngularID');
			if(token && id) {
				tinderServices.auth(id, token)
				.then(function (payload) {
					$scope.token = payload.data.token;
					tinderServices.getNearby(payload.data.token)
					.then(function (payload) {
						console.log(payload.data);
						$scope.nearby = payload.data.results;
					});
					tinderServices.profile(payload.data.token)
					.then(function (payload) {
						console.log(payload.data);
						$scope.user = payload.data;
						tinderServices.getLocation(payload.data.pos.lon, payload.data.pos.lat)
						.then(function (payload) {
							var location = payload.data.results[2].formatted_address;
							var arr = location.split(",");
							$scope.locationCity = arr[0] + ',' + arr[1];

						})
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