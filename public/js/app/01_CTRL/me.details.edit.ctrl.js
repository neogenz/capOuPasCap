'use strict';

appCapOuPasCap.controller('me.details.edit.ctrl',
    function ($scope, $rootScope, $modalInstance, userWebApi) {

        (function init(){
        })();

        $scope.save = function () {
            userWebApi.updateMe($rootScope.user).then(function(){
                $modalInstance.close();
            }, function(){

            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
);




