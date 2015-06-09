appCapOuPasCap.controller('challenge.details.ctrl',
    function ($scope, $modal, challengeFactory, bookmarkFactory, challenge, challengeWebApi) {

        (function init() {
            if(!challenge){
                $state.go('challenges');
            }
            $scope.challenges = [];
            $scope.challenges[0] = challenge;

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

            $scope.refreshBookmarkClickListener = function (challenge) {
                bookmarkFactory.inverseBookmarkState(challenge, function(){
                    challengeWebApi.findById($scope.challenges[0].id).then(function(data){
                        $scope.challenges[0] = data;
                    }, function(err){
                        console.log(err);
                        throw new Error(err);
                    })
                });
            };
        })();


        function refresh(challenge) {
            challengeFactory.refresh($scope.challenges, challenge).then(function (data) {
                $scope.challenges = data;
            }, function (err) {
                throw new Error(err);
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
    });