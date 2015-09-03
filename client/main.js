(function () {
	'use strict'; 
	angular.module('app',['facebook', 'ngRoute'])
	.config(['$httpProvider','FacebookProvider', '$locationProvider', function($httpProvider, FacebookProvider, $locationProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        FacebookProvider.init('1690654501163960');
        $locationProvider.html5Mode(true)
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
	.controller('mainController', function($scope, $location, tinderServices, Facebook) {
		$scope.test = 'hello';

		$scope.showContent = [true, false, false, false, false];

		Facebook.getLoginStatus(function (response) {
			if(response.status==='connected') {
				window.location.assign("/swipe")
			};
		});

		
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

		$scope.getData = function () {
			
			var data =
			{
				fb_id: $scope.fbID,
				fb_auth_token: $scope.fbAuth
			}; /*
			var data =
			{
				fb_id: 'burak.aslan.7773631',
				fb_auth_token: 'CAAGm0PX4ZCpsBADOkseCV6Eox9xXhHuJZAp5kox8uaY9mJ6DViPTZCD7ZAvmw8ZBMMBVJ1LkuTHEVG8e7adfZBSYMuCNgQOtjQLitGw4iOS4bcWkwr4Leu92PKxAFrWDhvRztWZCAwFmlwDadGyBgxDKhH0vggHhLupLFsFRpMYzZAaznZA7ytZAoePBYt4ELV6xB5rwfA4lDuCAZDZD'
			}; */
			tinderServices.authUser(data)
			.then(function (payload) {
				console.log(payload);
			})
			.catch(function (payload) {
				console.log(payload);
			});
		}
		$scope.login = function() {
				Facebook.login(function(response) {
			});
		};
	})
	.controller('swipeController', function($scope) {
		
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