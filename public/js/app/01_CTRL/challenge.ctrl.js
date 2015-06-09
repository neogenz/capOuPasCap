appCapOuPasCap.controller('challenge.ctrl',
    function ($scope, $rootScope, challengeWebApi, userWebApi, $modal, $q, bookmarkFactory, challengeFactory) {
        (function init() {
            $scope.challenges = [];
            $scope.challengeToListComments = null;
            $scope.nbChallengesNotHide = 0;
            $scope.refreshBookmarkClickListener = function (challenge) {
                bookmarkFactory.inverseBookmarkState(challenge, refresh);
            };
            $scope.challengesFilter = {
                selected: app.constants.challenges.filter.options.mapping.createdAt,
                createdAt: app.constants.challenges.filter.options.mapping.createdAt,
                like: app.constants.challenges.filter.options.mapping.like
            };

            refresh();

            $scope.iHaveBookmarkOnThisChallenge = function (challenge) {
                return bookmarkFactory.iHaveBookmarkOnThisChallenge(challenge);
            };

            $scope.likeListener = function (challenge) {
                challengeFactory.like(challenge, refresh);
            };

            $scope.iLikeThisChallenge = function (challenge) {
                return challengeFactory.iLikeThisChallenge(challenge);
            };

            $scope.iHaveDoneThisChallenge = function (challenge) {
                return challengeFactory.iHaveDoneThisChallenge(challenge);
            };

            $scope.addClickListener = function () {
                openModalToAdd();
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

            $scope.getCommentsByChallengeListener = function (challenge) {
                challengeFactory.findCommentsByChallenge(challenge).then(function (comment) {
                    openModalToListCommentsByChallenge(comment, challenge);
                }, function (err) {
                    throw new Error(err);
                });
            };

            $scope.actualizeFilter = function(){
                console.log($scope.challengesFilter.selected);
            }
        })();

        function refresh(challenge) {
            challengeFactory.refresh($scope.challenges, challenge).then(function (data) {
                $scope.challenges = data;
                $scope.nbChallengesNotHide = challengeFactory.countNbChallengesNotHide($scope.challenges);
            }, function (err) {
                throw new Error(err);
            });
        }

        var addModalOpts = {
            templateUrl: 'views/modal/challenge.form', // Url du template HTML
            controller: 'challenge.add.ctrl'
        };

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

        function openModalToAdd() {
            var modalInstance = $modal.open(addModalOpts);
            modalInstance.result.then(function (challenge) {
                challengeWebApi.add(challenge).then(function () {
                    refresh();
                }, function (err) {
                    throw new Error(err);
                });
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        function openModalToListCommentsByChallenge(comment, challenge) {
            var modalInstance = $modal.open(buildCommentsListModalOpts(comment, challenge));
            modalInstance.result.then(function () {
            }, function (challenge) {
                refresh(challenge);
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    });