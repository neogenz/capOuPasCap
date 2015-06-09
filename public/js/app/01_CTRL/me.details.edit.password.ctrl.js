'use strict';

appCapOuPasCap.controller('me.details.edit.password.ctrl',
    function ($scope, $rootScope, $modalInstance, userWebApi) {

        (function init(){
            $scope.newPassword = null;
            $scope.holdPassword = null;
            $scope.passwordConfirm = null;
            $scope.errorMessage = null;
        })();

        $scope.save = function (formIsValid) {
            if ($scope.newPassword != $scope.passwordConfirm) {
                $scope.passwordForm.passwordConfirm.$invalid = true;
                return;
            }
            if(formIsValid){
                userWebApi.updateMyPassword($scope.holdPassword, $scope.newPassword, $rootScope.user).then(function(){
                    $modalInstance.close();
                }, function(){
                    $scope.passwordForm.holdPassword.$invalid = true;
                });
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
);




