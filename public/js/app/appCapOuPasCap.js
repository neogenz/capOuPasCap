'use strict';

/**
 * Déclaration de l'application appBudgetManager
 */
var appCapOuPasCap = angular.module('appCapOuPasCap', [
    //Dépendances du module
    'ui.router', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate', 'ngStorage', 'snap', 'toastr'
]);

appCapOuPasCap.run(function ($localStorage, $location, $rootScope) {

    (function initMenu() {
        /* Options of the slide menu initialize in run for have a good information by screen who navigate on the site */
        if (window.matchMedia('(max-width: 768px)').matches) {
            $rootScope.snapOpts = {
                //element: null,
                dragger: null,
                disable: 'right',
                addBodyClasses: true,
                hyperextensible: false,
                resistance: 0.5,
                flickThreshold: 50,
                transitionSpeed: 0.01,
                easing: 'ease',
                maxPosition: 265,
                minPosition: -266,
                tapToClose: true,
                touchToDrag: true,
                slideIntent: 40,
                minDragDistance: 5
            };
        } else {
            $rootScope.snapOpts = {
                element: null
            };
        }

    })();

    (function initStyleDynamic() {
        //if ($localStorage.token && $localStorage.token !== "") {
        //    $location.path('challenges');
        //}
        if (window.matchMedia('(max-width: 768px)').matches){
            $rootScope.style = {
                maxHeightModal: {
                    'max-height': screen.height - 350
                }
            };
        }else{
            $rootScope.style = {
                maxHeightModal: {}
            };
        }
    })();

    //@todo regarder si un toekn est présent dans le local storage, appelé le WS de refresh de token, puis authentifier l'user
});

appCapOuPasCap.config(function ($httpProvider) {
    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/signin');
                }
                return $q.reject(response);
            }
        };
    }]);
});