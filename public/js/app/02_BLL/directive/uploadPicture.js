'user strict';

/******************************************
 * DEPENDENCIES :
 *      app/03_DAL/webApi/challenge.js
 *******************************************/

appCapOuPasCap.directive('uploadPicture', ['$parse', 'challengeWebApi', function ($parse, challengeWebApi) {
    return {
        restrict: 'A',
        scope: false, //Use the scope parent
        link: function (scope, element, attrs) {
            element.bind('change', function () {
                //console.debug(scope.$eval(attrs['uploadPicture']));
                //console.debug(scope.$eval(attrs['upload-picture']));
                scope.$apply(function () {
                    challengeWebApi.doneThisChallenge(scope.challengeToDone, element[0].files[0]).then(function () {
                        scope.$emit('doneSuccess', scope.challengeToDone);
                    }, function (err) {
                        console.log(err);
                        scope.$emit('doneFail', scope.challengeToDone);
                    });
                });
            });
        }
    };
}]);