'use strict';

appCapOuPasCap.controller('me.bookmark.ctrl',
    function ($scope, $rootScope, $q, userWebApi, $modal, bookmarkFactory, challengeFactory, bookmarks) {

        //@todo afficher l'image sur les challenges réalisé

        (function scopeInit() {
            $scope.me = {
                bookmarks: bookmarks || []
            };
            $scope.challengeDone = null;

            $scope.removeClickListener = function (challenge) {
                removeChallenge(challenge);
            };

            $scope.inverseHideChallengeStateClickListener = function (challenge) {
                inverseHideChallengeState(challenge);
            };

            $scope.challengeIsDeletable = function (challenge) {
                return challengeFactory.challengeIsDeletable(challenge);
            };

            $scope.challengeCanBeHide = function (challenge) {
                return challengeFactory.challengeCanBeHide(challenge);
            };

            $scope.refreshBookmarkClickListener = function (challenge) {
                bookmarkFactory.inverseBookmarkState(challenge, refresh);
            };

            $scope.iHaveBookmarkOnThisChallenge = function (challenge) {
                //@todo recuprer un object bookmarks et non un array
                return bookmarkFactory.iHaveBookmarkOnThisChallenge(challenge);
            };

            $scope.likeListener = function (challenge) {
                challengeFactory.like(challenge, refresh);
            };

            $scope.iLikeThisChallenge = function (challenge) {
                return challengeFactory.iLikeThisChallenge(challenge);
            };

            $scope.getCommentsByChallengeListener = function (challenge) {
                challengeFactory.findCommentsByChallenge(challenge).then(function (comment) {
                    openModalToListCommentsByChallenge(comment, challenge);
                }, function (err) {
                    throw new Error(err);
                });
            };

            /* Upload & done listener */
            $scope.iHaveDoneThisChallenge = function (challenge) {
                return challengeFactory.iHaveDoneThisChallenge(challenge);
            };

            $scope.doneListener = function (challenge) {
                $scope.challengeToDone = challenge;
            };

            $scope.$on('doneSuccess', function (event, challengeDone) {
                refresh(challengeDone);
            });

            $scope.$on('doneError', function (event, challengeUndone) {
                throw new Error('Fail during the upload of picture');
            });
        })();

        function refresh(challenge) {
            var bookmarkFilter = app.constants.me.details.challenges.filter.options.mapping.bookmarked;
            challengeFactory.refresh($scope.me.bookmarks, challenge, bookmarkFilter, $rootScope.user).then(function (data) {
                $scope.me.bookmarks = data;
            }, function (err) {
                throw new Error(err);
            });
        }

        function inverseHideChallengeState(challenge) {
            challenge.isHidden = !challenge.isHidden;
            userWebApi.inverseMyHideChallengeState(challenge).then(function () {
                refresh(challenge);
            }, function (err) {
                challenge.isHidden = !challenge.isHidden;
                console.log(err);
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
                userWebApi.removeMyChallenge(challenge).then(function () {
                    //getChallenges();
                    refresh(challenge);
                }, function (err) {
                    console.log(err);
                    throw new Error(err);
                });
            }, function () {
                console.log("Suppression annulé.");
            });
        }

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

        function openModalToListCommentsByChallenge(comment, challenge) {
            var modalInstance = $modal.open(buildCommentsListModalOpts(comment, challenge));
            modalInstance.result.then(function () {
            }, function (challenge) {
                refresh(challenge);
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }
);




