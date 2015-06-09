'use strict';

appCapOuPasCap.controller('me.details.ctrl',
    function ($scope, $rootScope, $q, userWebApi, $modal, bookmarkFactory, challengeFactory) {

        //@todo la poubelle et l'oeuil apparaissent tout le temps

        (function scopeInit() {
            $scope.me = {
                challenges: [],
                bookmarks: [],
                challengesFilterOptions: app.constants.me.details.challenges.filter.options.value,
                challengesFilterSelected: app.constants.me.details.challenges.filter.options.mapping.posted,
                challengesFilterMapping: app.constants.me.details.challenges.filter.options.mapping

            };

            $scope.removeClickListener = function (challenge) {
                removeChallenge(challenge);
            };

            $scope.inverseHideChallengeStateClickListener = function (challenge) {
                challengeFactory.inverseHideChallengeState(challenge, function () {
                    refresh();
                });
            };

            $scope.editPersonalInformationClickListener = function () {

            };

            $scope.challengeIsDeletable = function (challenge) {
                return challengeFactory.challengeIsDeletable(challenge);
            };

            $scope.challengeCanBeHide = function (challenge) {
                return challengeFactory.challengeCanBeHide(challenge);
            };

            $scope.refreshBookmarkClickListener = function (challenge) {
                bookmarkFactory.inverseBookmarkState(challenge, function () {
                    refresh();
                });
            };

            $scope.iHaveBookmarkOnThisChallenge = function (challenge) {
                return bookmarkFactory.iHaveBookmarkOnThisChallenge(challenge);
            };

            $scope.likeListener = function (challenge) {
                challengeFactory.like(challenge, function () {
                    refresh();
                });
            };

            $scope.iLikeThisChallenge = function (challenge) {
                return challengeFactory.iLikeThisChallenge(challenge);
            };

            $scope.iHaveDoneThisChallenge = function (challenge) {
                return challengeFactory.iHaveDoneThisChallenge(challenge);
            };

            $scope.$watch("me.challengesFilterSelected", function (newValue, oldValue) {
                refresh();
            });

            $scope.getCommentsByChallengeListener = function (challenge) {
                challengeFactory.findCommentsByChallenge(challenge).then(function (comment) {
                    openModalToListCommentsByChallenge(comment, challenge);
                }, function (err) {
                    throw new Error(err);
                });
            };

            $scope.editMyProfileClickListener = function () {
                openModalToEditMyProfile();
            };

            $scope.editMyPasswordClickListener = function () {
                openModalToEditMyPassword();
            };

            $scope.inverseHideDoneChallengeStateListener = function(){
                userWebApi.updateMe($rootScope.user).then(function(){
                    refresh();
                }, function(){
                });
            };
        })();

        function refresh(challenge) {
            challengeFactory.refresh($scope.me.challenges, challenge, $scope.me.challengesFilterSelected, $rootScope.user)
                .then(function (data) {
                    $scope.me.challenges = data;
                }, function (err) {
                    throw new Error(err);
                });
        }

        function removeChallenge(challenge) {
            var confirmActionModalOpts = {
                templateUrl: 'views/modal/action.confirm', // Url du template HTML
                controller: 'action.confirm.ctrl',
                resolve: {
                    confirmationMessage: function () {
                        return $scope.confirmationMessage;
                    }
                }
            };

            $scope.confirmationMessage = app.constants.ui.messages.action.confirm.deleteChallenge;
            var modalInstance = $modal.open(confirmActionModalOpts);
            modalInstance.result.then(function () {
                challengeFactory.removeMyChallenge(challenge, refresh);
            }, function () {
                console.log("Suppression annulé.");
            });
        }

        function openModalToListCommentsByChallenge(comment, challenge) {
            function buildCommentsListModalOpts(comments, challenge) {
                return {
                    templateUrl: 'views/modal/comments.list', // Url du template HTML
                    controller: 'comment.list.ctrl',
                    resolve: {
                        comments: function () {
                            return comments;
                        },
                        challenge: function () {
                            return challenge;
                        }
                    }
                }
            }

            var modalInstance = $modal.open(buildCommentsListModalOpts(comment, challenge));
            modalInstance.result.then(function () {
            }, function (challenge) {
                refresh(challenge);
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        function openModalToEditMyPassword() {
            var editPasswordModalOpts = {
                templateUrl: 'views/modal/me.details.edit.password', // Url du template HTML
                controller: 'me.details.edit.password.ctrl'
            };

            var modalInstance = $modal.open(editPasswordModalOpts);
            modalInstance.result.then(function () {
            }, function () {
                console.log("Edition annulé.");
            });
        }

        function openModalToEditMyProfile() {
            var editProfileModalOpts = {
                templateUrl: 'views/modal/me.details.edit', // Url du template HTML
                controller: 'me.details.edit.ctrl'
            };

            var modalInstance = $modal.open(editProfileModalOpts);
            modalInstance.result.then(function () {
            }, function () {
                console.log("Edition annulé.");
            });
        }
    }
);




