'use strict';

appCapOuPasCap.controller('challenge.add.ctrl',
    function ($scope, $modalInstance) {

        (function init(){
            $scope.challenge = null;
        })();

        $scope.ok = function (formIsValid) {
            if(formIsValid){
                $modalInstance.close($scope.challenge);
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss("Ajout du défis annulé.");
        };
    }
);




