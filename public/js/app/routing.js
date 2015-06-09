'use strict';

var isAuthenticated = function ($rootScope, $q, $http, $state) {
    var defer = $q.defer();
    var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/isAuthenticated');
    var promise = $http(requestOptions);
    promise.success(function (data) {
        $rootScope.user = data;
        defer.resolve(true);
    }).error(function () {
        $state.go('signin');
        defer.reject();
    });
    return defer.promise;
};

appCapOuPasCap.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    // Système de routage
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/home',
            controller: 'home.ctrl'
        })
        .state('signin', {
            url: '/signin',
            controller: 'signin.ctrl',
            templateUrl: 'views/signin'
        })
        .state('signup', {
            url: '/signup',
            controller: 'signup.ctrl',
            templateUrl: 'views/signup'
        }).state('challenges', {
            url: '/challenges',
            templateUrl: 'views/challenge.list',
            controller: 'challenge.ctrl',
            resolve: {
                user: isAuthenticated,
                challenges: function (challengeWebApi) {
                    return challengeWebApi.findAll();
                }
            }
        }).state('challengeDetails', {
            url: '/challenge/:id',
            templateUrl: 'views/challenge.details',
            controller: 'challenge.details.ctrl',
            resolve: {
                user: isAuthenticated,
                challenge: function (challengeWebApi, $stateParams) {
                    return challengeWebApi.findById($stateParams.id);
                }
            }
        }).state('bookmarks', {
            url: '/me/bookmarks',
            templateUrl: 'views/me.bookmark.list',
            controller: 'me.bookmark.ctrl',
            resolve: {
                user: isAuthenticated,
                bookmarks: function (userWebApi, $rootScope) {
                    return userWebApi.findAllBookmarks($rootScope.user);
                }
            }
        }).state('me', {
            url: '/me',
            templateUrl: 'views/me.details',
            controller: 'me.details.ctrl',
            resolve: {
                user: isAuthenticated
            }
        });

    $urlRouterProvider.otherwise('/');

    //$httpProvider.interceptors.push(function ($q, $location, $localStorage) {
    //    return {
    //        'request': function (config) {
    //            config.headers = config.headers || {};
    //            if ($localStorage.token) {
    //                config.headers["Authorization"] = 'Bearer ' + $localStorage.token;
    //            }
    //            return config;
    //        },
    //        'responseError': function (response) {
    //            console.log('Http request intercepted in error');
    //            if (response.status === 401 || response.status === 403) {
    //                //@todo redirect to login page
    //            }
    //            return $q.reject(response);
    //        }
    //    };
    //});

    //$httpProvider.defaults.withCredentials = true;
    //$httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
});