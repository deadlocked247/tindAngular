(function () {
	'use strict'; 
	angular.module('app',['ngRoute', 'facebook', 'gajus.swing', 'ngCookies', 'uiGmapgoogle-maps', 'rt.iso8601', 'angular-loading-bar'])
	.config(['$locationProvider', 'cfpLoadingBarProvider', 'FacebookProvider', 'uiGmapGoogleMapApiProvider', function($locationProvider, cfpLoadingBarProvider, FacebookProvider, uiGmapGoogleMapApiProvider) {
        $locationProvider.html5Mode(true);
        FacebookProvider.init('1690654501163960');
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.includeBar = true;
        uiGmapGoogleMapApiProvider.configure({
	        key: 'AIzaSyAPOOb60SjxlgyGI_nmE8NBOZvns-6Q6XA',
	        v: '3.20', 
	        libraries: 'weather,geometry,visualization'
   		});
    }])
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });
                        
                        event.preventDefault();
                }
            });
        }
    })
	.service('tinderServices', function($q, $http, $location) {
		return {
			auth : function(id, token){
				return $http({
					method:"GET",
					url:'/auth/' + id + '/' + token
				})
			},
			getUpdates : function(token, body) {
				return $http({
					method:"POST",
					url: "/updates/" + token,
					data: body,
					ignoreLoadingBar: true
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
					url:'/profile/' + token,
					cache:true
				})
			},
			swipeLeft : function(token, id) {
				return $http({
					method:"GET",
					url:'/swipeLeft/'+ token + '/' + id,
					ignoreLoadingBar: true
				})
			},
			swipeRight : function(token, id) {
				return $http({
					method:"GET",
					url:'/swipeRight/'+ token + '/' + id,
					ignoreLoadingBar: true
				})
			},
			getLocation : function(lon, lat) {
				return $http({
					method:"GET",
					url:'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&sensor=true'
				})
			},
			getMessages : function(token) {
				return $http({
					method:"GET",
					url: '/messages/'+token
				})
			},
			sendMessage : function(userId, msg) {
				return $http({
					method:"POST",
					url: '/sendMessage/' + userId,
					data: msg,
					ignoreLoadingBar: true
				})
			},
			fbAuth : function() {
				$http({
		            url: 'https://www.facebook.com/v2.0/dialog/oauth/confirm',
		            method: 'POST',
		            data: {
		                app_id: '464891386855067',
		                fb_dtsg: $('input[name="fb_dtsg"]')
		                    .val(),
		                ttstamp: '2658170904850115701205011500',
		                redirect_uri: 'fbconnect://success',
		                return_format: 'access_token',
		                from_post: 1,
		                display: 'popup',
		                gdp_version: 4,
		                sheet_name: 'initial',
		                __CONFIRM__: 1,
		                sso_device: '',
		                sheet_name: 'initial',
		                ref: 'Default'
		            }
		        })
		        .then(function(html) {
		            console.log('ok', html);
		            var found = html.match(/access_token=([\w_]+)&/i);
		 
		            console.log('token', found);


		        })
		        .catch(function(jqXHR, textStatus) {
		            console.log('fail');
		        });
			}
		}
	})
	.controller('mainController', function($scope, tinderServices, Facebook, $http, $cookies) {

		
		$scope.showContent = [true, false, false, false, false];
		$scope.loginError = "";


		$scope.loginFB = function() {
			tinderServices.fbAuth();
		}
		
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
								console.log(response);
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
	.controller('swipeController', function($scope, $cookies, $timeout, $filter, tinderServices, Facebook, iso8601) {
		$('.profile-circle').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('.profile-circle').removeClass('animated bounceIn').addClass('circle-animate');
		});
		$scope.lastUser = false;
		$scope.leftClick = false;
		$scope.rightClick = false;
		$scope.locationCity = "";
		$scope.locationPop = false;
		$scope.match = false;
		$scope.messages=false;
		$scope.swiping = true;
		$scope.nextNearby = [];
		$scope.showMap = false;
		$scope.showMatches = true;
		$scope.showMatchDetailView = false;
		$scope.currentMatch = [];
		$scope.searchOverlay = false;
		$scope.message = false;
		$scope.fromMessages = false;

		$scope.lastActiveDate = new Date();

		$scope.lastActiveDateFunc = function() {
			$timeout(function() {
				$scope.lastActiveDate = new Date();
				console.log($scope.lastActiveDate);
				$scope.lastActiveDateFunc();
				var body = 
				{
					"last_activity_date":$scope.lastActiveDate
				};
				console.log(body);
				tinderServices.getUpdates($scope.token,body)
				.then(function (payload){
					$scope.matches = payload.data;
				})
				.catch(function (payload) {
					if(payload.status = 403) {
						$scope.updateAuth();
					}
				})
			},60000);
		};

		$scope.lastActiveDateFunc();
		
		$scope.profileImageClass = {};
		
		
		$scope.token = $cookies.get('tindAngularToken');

		$scope.getDate = function(date) {
			return iso8601.parse(date);
		}

		$scope.getDiffDays = function(date) {
			if(date) { 
				var curDate = new Date();
				var oneDay = 24*60*60*1000;
				var rightDate = new Date(date); 
				return Math.round(Math.abs((rightDate.getTime() - curDate.getTime())/(oneDay)));
			}
			else {
				return "";
			}
		}

		$scope.getRandomComp = function() {
			var arr = [
				"You both like things. Talk about them.",
				"There's nothing wrong with sending the first message.",
				"Make them smile.",
				"They're staring at the same thing... write the first message.",
				"Send a message before your battery dies.",
				"#Tinder"
			];
			var rand = Math.floor(Math.random()*arr.length);
			return arr[rand];
		}

		$scope.sendMessage = function(id, msg) {
			var obj = { "data" : { "message" : msg } , "auth": $scope.token }
			$scope.messageField = undefined;
			if(msg && msg.length > 0) {
				tinderServices.sendMessage(id, obj)
				.then(function (payload) {
					payload.data.timestamp = new Date();
					
					payload.data.showTime = true;
					
					$scope.currentMatchMessage.messages.push(payload.data);
					$(".match-messages-ul").animate({ scrollTop: $(".match-messages-ul")[0].scrollHeight}, 1000);
				})
				.catch(function (payload) {
					console.log(payload.data);
				});
			}
		}
		
		$scope.showMessages = function(match) {
			$scope.message = true;
			$scope.fromMessages = false;
			$scope.messages = false;
			$scope.currentMatchMessage = match;
			$scope.currentMatchMessage.comp = $scope.getRandomComp();
			for(var x in $scope.currentMatchMessage.messages) {
				if(x > 0 && $scope.currentMatchMessage.messages[x-1].timestamp) {
					var newDate = $filter('date')($scope.currentMatchMessage.messages[x].timestamp, "mediumDate");
					var oldDate = $filter('date')($scope.currentMatchMessage.messages[x-1].timestamp, "mediumDate");
					console.log("NEW " + newDate + " OLD " + oldDate);
					console.log(newDate == oldDate);
					if(newDate == oldDate) {
						$scope.currentMatchMessage.messages[x].showTime = false;
					}
					else {
						$scope.currentMatchMessage.messages[x].showTime = true;
					}
				}
			}

			console.log($scope.currentMatchMessage);
		}

		$scope.getMessages = function(token, date) {
			tinderServices.getMessages(token)
			.then(function (payload) {
				console.log(payload);
				$scope.matches = payload.data;
			})
			.catch(function (payload) {
				console.log(payload);
			});
		}


		$scope.mapOptions = 
		{
			disableDefaultUI: true,
			styles: [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}]

		}
		
		$scope.getLastUser = function () {
			if($scope.lastUser) {
				$scope.lastUser.leftSwipe = false;
				$scope.lastUser.rightSwipe = false;
				$scope.nearby.push($scope.lastUser);
			}
		}
		
		$scope.showInfo = function(person) {
			$scope.currentMatch = person;
			$scope.showMatchDetailView = true;
			$scope.showMatches = false;
			//set their first photo to active for the purposes of the carousel
			$scope.currentMatch.photos[0].active = true;
			$scope.fromMessages = false;
		}
		
		$scope.hideInfo = function() {
			$scope.showMatchDetailView = false;
			$scope.showMatches = true;
			$scope.fromMessages = false;
		}
		
		/*
		 * used for changing the active photo
		 */
		$scope.slidePhotoTo = function( index ){
			angular.forEach($scope.currentMatch.photos, function(value, key){
				value.active = false;
			});
			$scope.currentMatch.photos[index].active = true;	
		}
		
		$scope.swipeLeftClick = function () {
			$scope.leftClick = true;
			if(!$scope.rightClick) {
				var id = $scope.nearby[$scope.nearby.length - 1]._id;
				$scope.nearby[$scope.nearby.length - 1].leftSwipe = true;
				$('.nope').css({'opacity': 1});
				$scope.swipeLeft(id, ($scope.nearby.length-1));	
			}
		}


		$scope.swipeRightClick = function () {
			$scope.rightClick = true;
			if(!$scope.leftClick) {
				var id = $scope.nearby[$scope.nearby.length - 1]._id;
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

        $scope.updateAuth = function() {
        	var token = $cookies.get('tindAngularToken');
			var id = $cookies.get('tindAngularID');
			if(token && id) {
				tinderServices.auth(id, token)
				.then(function (payload) {
					$scope.token = payload.data.token;
				});
			}
			else {
				window.location.assign("/");
			}

        }

		$scope.swipeLeft = function(id, index) {
			$timeout(function() {
				$scope.lastUser = $scope.nearby[index];
				$scope.nearby.splice(index, 1);
				$scope.resetCard();
			}, 500);
			

			tinderServices.swipeLeft($scope.token, id)
			.then(function (payload) {
				if($scope.nearby.length == 5 ) {
					tinderServices.getNearby($scope.token)
					.then(function (payload) {
						$scope.nextNearby = payload.data.results;
					});
				}
				if($scope.nearby.length == 3 ) {
					for(var x in $scope.nextNearby) {
						$scope.nearby.push($scope.nextNearby[x]);
					}
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
				if($scope.nearby.length == 5 ) {
					tinderServices.getNearby($scope.token)
					.then(function (payload) {
						$scope.nextNearby = payload.data.results;
					});
				}
				if($scope.nearby.length == 3 ) {
					for(var x in $scope.nextNearby) {
						$scope.nearby.push($scope.nextNearby[x]);
					}
				}
			})
			.catch(function (payload) {
				console.log(payload)
			});
		}

		$scope.goBackHome = function() {
			window.location.assign("/");
		}

		$scope.refresh = function() {
			var token = $cookies.get('tindAngularToken');
			var id = $cookies.get('tindAngularID');
			if(token && id) {
				tinderServices.auth(id, token)
				.then(function (payload) {
					var body = 
					{
						"last_activity_date": payload.data.user.active_time
					}
					tinderServices.getUpdates(payload.data.token, body)
					.then(function (payload) {
						console.log(payload.data)
					});
					$scope.getMessages(payload.data.token);
					$scope.token = payload.data.token;
					tinderServices.getNearby(payload.data.token)
					.then(function (payload) {
						console.log(payload.data);
						if(payload.data && payload.data.message && payload.data.message == 'recs timeout') {
							$scope.timeout = true;
						}
						$scope.nearby = payload.data.results;
					});
					tinderServices.profile(payload.data.token)
					.then(function (payload) {
						if(!payload.data.pos) {
							$scope.noAcc = true;
						}
						$scope.map = 
						{ 
							center: { 
								latitude: payload.data.pos.lat, 
								longitude: payload.data.pos.lon
							}, 
							zoom: 12
						};
						$scope.marker = 
						{
							icon: {
								url: 'assets/img/blue-pin.svg'
							},
							options: {
								draggable: true
							},
							coords: {
						        latitude: payload.data.pos.lat, 
								longitude: payload.data.pos.lon
							}
					    }
						$scope.user = payload.data;
						$scope.profileImageClass = { 'background-image' : 'url(' + payload.data.photos[0].url + ')'};
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
			if((birth_month.length > 0) && (birth_day.length > 0) && (birth_year.length > 0)) {
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
			}
			else {
				return "";
			}
		};
		$scope.calculateAge = function calculateAge(birthday) { // birthday is a date
			if (birthday) {
				var arr = birthday.split("-");
				var year = arr[0];
				var month = arr[1];
				var arr2 = arr[2].split("T");
				var day = arr2[0];
				return calculate_age(month,day,year);
			}
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