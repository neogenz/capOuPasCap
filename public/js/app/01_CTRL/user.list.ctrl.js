'use strict';

appCapOuPasCap.controller('user.list.ctrl',
    function ($scope, $modal, $modalInstance, userWebApi, $q, users) {

        //@todo afficher l'image sur les challenges réalisé

        (function init() {
            $scope.users = users;
            $scope.seeUserDetails = false;
            $scope.userDetails = {
                user: null,
                challenges: {
                    posted: [],
                    done: [],
                    all: []
                },
                challengesFilterOptions: app.constants.user.details.challenges.filter.options,
                challengesFilterSelected: app.constants.user.details.challenges.filter.options.all
            };

            $scope.seeDetailsListener = function (user) {
                getDetails(user);
                $scope.userDetails.user = user;
                $scope.seeUserDetails = true;
            };

            $scope.seeUsersListListener = function () {
                resetUserDetails();
                $scope.seeUserDetails = false;
            };

            $scope.close = function () {
                $modalInstance.dismiss($scope.challenge);
            };

        })();

        function appendAtAllChallenge(challengeArray){
            var alreadyPresent = false;
            for(var i = 0; i < challengeArray.length; i++){
                var currentElement = challengeArray[i];
                if($scope.userDetails.challenges.all.length === 0){
                    $scope.userDetails.challenges.all.push(currentElement);
                }else{
                    var allChallengesLength = $scope.userDetails.challenges.all.length;
                    alreadyPresent = false;
                    for(var j = 0; j < allChallengesLength; j++){
                        var currentElementJ = $scope.userDetails.challenges.all[j];
                        if(currentElement.id === currentElementJ.id){
                            alreadyPresent = true;
                            break;
                        }
                    }
                    if(!alreadyPresent){
                        $scope.userDetails.challenges.all.push(currentElement);
                    }
                }
            }
        }

        function resetUserDetails(){
            $scope.userDetails.challenges.done = null;
            $scope.userDetails.challenges.posted = null;
            $scope.userDetails.challenges.all = null;
            $scope.userDetails.user = null;
            $scope.userDetails.challengesFilterSelected = app.constants.user.details.challenges.filter.options.all;
        }

        function getDetails(user) {
            findChallengeDoneByUser(user).then(function (challenge) {
                $scope.userDetails.challenges.done = challenge;
                appendAtAllChallenge(challenge);
            }, function (err) {
                throw new Error(err);
            });
            findChallengePostedByUser(user).then(function (challenge) {
                $scope.userDetails.challenges.posted = challenge;
                appendAtAllChallenge(challenge);
            }, function (err) {
                throw new Error(err);
            });
        }

        function findChallengeDoneByUser(user) {
            var def = $q.defer();
            userWebApi.findChallengeDoneByUser(user).then(
                function (challenge) {
                    def.resolve(challenge);
                }, function (err) {
                    throw new Error(err);
                });
            return def.promise;
        }

        function findChallengePostedByUser(user) {
            var def = $q.defer();
            userWebApi.findChallengePostedByUser(user).then(
                function (challenge) {
                    def.resolve(challenge);
                }, function (err) {
                    throw new Error(err);
                });
            return def.promise;
        }
    }
);




