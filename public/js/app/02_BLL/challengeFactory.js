appCapOuPasCap.factory('challengeFactory', function ($rootScope, challengeWebApi, $q, userWebApi) {

    return {
        like: like,
        iLikeThisChallenge: iLikeThisChallenge,
        iHaveDoneThisChallenge: iHaveDoneThisChallenge,
        refresh: refresh,
        countNbChallengesNotHide: countNbChallengesNotHide,
        findCommentsByChallenge: findCommentsByChallenge,
        challengeIsDeletable: challengeIsDeletable,
        challengeCanBeHide: challengeCanBeHide,
        inverseHideChallengeState: inverseHideChallengeState,
        removeMyChallenge: removeMyChallenge
    };

    function like(challenge, success_callback) {
        challengeWebApi.like(challenge).then(function () {
            success_callback(challenge);
        }, function (err) {
            throw new Error(err);
        });
    }

    function iLikeThisChallenge(challenge) {
        var likesLength = challenge.likes.length;
        for (var i = 0; i < likesLength; i++) {
            if (challenge.likes[i].id === $rootScope.user.id)
                return true;
        }
        return false
    }

    function iHaveDoneThisChallenge(challenge) {
        var statesLength = challenge.states.length;
        for (var i = 0; i < statesLength; i++) {
            if (challenge.states[i].userId === $rootScope.user.id)
                return true;
        }
        return false;
    }

    function refresh(challengesArrayToRefresh, challenge, challengesFinderFilter, user) {
        if (!challengesArrayToRefresh) {
            throw new Error('Challenges array to refresh is null or undefined.');
        }
        if (!challenge) {
            if (challengesFinderFilter != undefined && challengesFinderFilter != null) {
                return _refreshAllWithFindingOpts(challengesFinderFilter, user);
            }
            return _refreshAll(challengesArrayToRefresh);
        } else {
            return _refreshOne(challengesArrayToRefresh, challenge);
        }
    }

    function _refreshOne(challengesArrayToRefresh, challenge) {
        var def = $q.defer();
        challengeWebApi.findById(challenge.id).then(function (challenge) {
            var challengesLength = challengesArrayToRefresh.length;
            for (var i = 0; i < challengesLength; i++) {
                var currentElement = challengesArrayToRefresh[i];
                if (currentElement.id === challenge.id) {
                    app.array.removeElement(challengesArrayToRefresh, i);
                    app.array.addElement(challengesArrayToRefresh, challenge, i);
                }
            }
            def.resolve(challengesArrayToRefresh);
        }, function (err) {
            def.reject(err);
        });
        return def.promise;
    }

    function _refreshAll(challengesArrayToRefresh) {
        var def = $q.defer();
        challengeWebApi.findAll().then(function (challenges) {
            challengesArrayToRefresh = challenges;
            def.resolve(challengesArrayToRefresh);
        }, function (err) {
            def.reject(err);
        });
        return def.promise;
    }

    function _refreshAllWithFindingOpts(challengesFinderFilter, user) {
        if (!user) {
            throw new Error('User is not defined or null');
        }
        var def = $q.defer();
        switch (challengesFinderFilter) {
            case app.constants.me.details.challenges.filter.options.mapping.commented :
                var def = $q.defer();
                userWebApi.findMyChallengeCommented(user).then(
                    function (challenge) {
                        def.resolve(challenge);
                    }, function (err) {
                        throw new Error(err);
                    });
                return def.promise;
            case app.constants.me.details.challenges.filter.options.mapping.posted :
                userWebApi.findChallengePostedByUser(user).then(
                    function (challenge) {
                        def.resolve(challenge);
                    }, function (err) {
                        throw new Error(err);
                    });
                return def.promise;
            case app.constants.me.details.challenges.filter.options.mapping.liked :
                userWebApi.findMyChallengeLiked(user).then(
                    function (challenge) {
                        def.resolve(challenge);
                    }, function (err) {
                        throw new Error(err);
                    });
                return def.promise;
            case app.constants.me.details.challenges.filter.options.mapping.done :
                userWebApi.findChallengeDoneByUser(user).then(
                    function (challenge) {
                        def.resolve(challenge);
                    }, function (err) {
                        throw new Error(err);
                    });
                return def.promise;
            case app.constants.me.details.challenges.filter.options.mapping.bookmarked :
                userWebApi.findAllBookmarks(user).then(
                    function (bookmarks) {
                        def.resolve(bookmarks);
                    }, function (err) {
                        throw new Error(err);
                    });
                return def.promise;
            default :
                def.reject("Finding filter challenges is not found.");
                return def.promise;
        }
    }

    function countNbChallengesNotHide(challenges) {
        var nbChallengeNotHide = 0;
        for (var i = 0; i < challenges.length; i++) {
            if (!challenges[i].isHidden
                && !($rootScope.user.hideDoneChallenge && iHaveDoneThisChallenge(challenges[i]))
            ) {
                nbChallengeNotHide++
            }
        }
        return nbChallengeNotHide;
    }

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

    function challengeIsDeletable(challenge) {
        if (!challenge) {
            throw new Error('Challenge is null or undefined.');
        }
        if (challenge.likes)
            if (challenge.likes.length > 0)
                return false;
        if (challenge.states)
            if (challenge.states.length > 0)
                return false;
        return true;
    }

    function challengeCanBeHide(challenge) {
        if (!challenge) {
            throw new Error('Challenge is null or undefined.');
        }
        if (challenge.comments)
            if (challenge.comments.length > 0)
                return false;
        if (challenge.states)
            if (challenge.states.length > 0)
                return false;
        return true;
    }

    function inverseHideChallengeState(challenge, success_callback) {
        challenge.isHidden = !challenge.isHidden;
        userWebApi.inverseMyHideChallengeState(challenge).then(function () {
            success_callback(challenge);
        }, function (err) {
            challenge.isHidden = !challenge.isHidden;
            console.log(err);
            throw new Error(err);
        });
    }

    function removeMyChallenge(challenge, sucess_callback) {
        userWebApi.removeMyChallenge(challenge).then(function () {
            sucess_callback();
        }, function (err) {
            console.log(err);
            throw new Error(err);
        });
    }
});