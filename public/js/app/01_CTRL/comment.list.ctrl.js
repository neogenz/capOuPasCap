'use strict';

appCapOuPasCap.controller('comment.list.ctrl',
    function ($scope, $modalInstance, challengeWebApi, comments, challenge, $q) {

        (function init(){
            $scope.comments = comments;
            $scope.challenge = challenge;
            $scope.commentToAdd = {
                text: null
            };
        })();

        $scope.comment = function (formIsValid) {
            if(formIsValid){
                challengeWebApi.comment(challenge, $scope.commentToAdd).then(function(){
                    findCommentsByChallenge(challenge).then(function(comments){
                        $scope.comments = comments;
                        $scope.commentToAdd.text = null;
                        $scope.commentForm.comment.$invalid = false;
                        //$scope.$apply($scope.comments);
                    }, function(err){
                        throw new Error(err);
                    })
                }, function(err){
                    throw new Error(err);
                })
            }
        };

        $scope.close = function () {
            $modalInstance.dismiss($scope.challenge);
        };

        //@todo Factorise this part of code because it's redundant with challenge.ctrl
        function findCommentsByChallenge(challenge) {
            var def = $q.defer();
            challengeWebApi.findCommentsByChallenge(challenge).then(
                function (comments) {
                    def.resolve(comments);
                }, function (err) {
                    throw new Error(err);
                });
            return def.promise;
        }
    }
);




