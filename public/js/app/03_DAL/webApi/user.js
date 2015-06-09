appCapOuPasCap.factory('userWebApi',
    function ($http, $q, $rootScope, $localStorage) {

        return {
            findAll: findAll,
            likedThisChallenge: likedThisChallenge,
            findChallengePostedByUser: findChallengePostedByUser,
            findChallengeDoneByUser: findChallengeDoneByUser,
            findMyChallengeCommented: findMyChallengeCommented,
            findMyChallengeLiked: findMyChallengeLiked,
            removeMyChallenge: removeMyChallenge,
            inverseMyHideChallengeState: inverseMyHideChallengeState,
            addBookmark: addBookmark,
            removeBookmark: removeBookmark,
            findAllBookmarks: findAllBookmarks,
            updateMe: updateMe,
            updateMyPassword: updateMyPassword
        };

        //Web API
        function findAll() {
            var def = $q.defer();
            var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/user');
            var promise = $http(requestOptions);
            promise.success(function (data) {
                if (!data) {
                    throw new Error('data is empty.');
                }
                var factory = app.model.factory;
                var user = factory.runFactory(data, 'User');
                def.resolve(user);
            }).error(function (err) {
                console.log(err);
                def.reject('Echec de récupération des données.');
            });
            return def.promise;
        }

        function likedThisChallenge(challenge) {
            var def = $q.defer();
            if (!challenge) {
                def.reject('Challenge is null or undefined.');
                return def.promise;
            } else if (!challenge.id) {
                def.reject('Challenge id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/me/liked/challenges/' + challenge.id);
            var promise = $http(requestOptions);
            promise.success(function (data) {
                if (!data) {
                    throw new Error('data is empty.');
                }
                def.resolve(data);
            }).error(function (err) {
                console.log(err);
                def.reject('La suppression a échouée.');
            });
            return def.promise;
        }

        function findChallengePostedByUser(user) {
            var def = $q.defer();
            if (!user) {
                def.reject('User is null or undefined.');
                return def.promise;
            } else if (!user.id) {
                def.reject('User id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/user/' + user.id + '/challenges');
            var promise = $http(requestOptions);
            promise.success(function (data) {
                if (!data) {
                    throw new Error('data is empty.');
                }
                var factory = app.model.factory;
                var challenges = factory.runFactory(data, 'Challenge');
                def.resolve(challenges);
            }).error(function (err) {
                console.log(err);
                def.reject('Echec de récupération des données.');
            });
            return def.promise;
        }

        function findChallengeDoneByUser(user) {
            var def = $q.defer();
            if (!user) {
                def.reject('User is null or undefined.');
                return def.promise;
            } else if (!user.id) {
                def.reject('User id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/user/' + user.id + '/challenges/done');
            var promise = $http(requestOptions);
            promise.success(function (data) {
                if (!data) {
                    throw new Error('data is empty.');
                }
                var factory = app.model.factory;
                var challenges = factory.runFactory(data, 'Challenge');
                def.resolve(challenges);
            }).error(function (err) {
                console.log(err);
                def.reject('Echec de récupération des données.');
            });
            return def.promise;
        }

        function findMyChallengeCommented(user) {
            var def = $q.defer();
            if (!user) {
                def.reject('User is null or undefined.');
                return def.promise;
            } else if (!user.id) {
                def.reject('User id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/me/challenges/commented');
            var promise = $http(requestOptions);
            promise.success(function (data) {
                if (!data) {
                    throw new Error('data is empty.');
                }
                var factory = app.model.factory;
                var challenges = factory.runFactory(data, 'Challenge');
                def.resolve(challenges);
            }).error(function (err) {
                console.log(err);
                def.reject('Echec de récupération des données.');
            });
            return def.promise;
        }

        function findMyChallengeLiked(user) {
            var def = $q.defer();
            if (!user) {
                def.reject('User is null or undefined.');
                return def.promise;
            } else if (!user.id) {
                def.reject('User id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/me/challenges/liked');
            var promise = $http(requestOptions);
            promise.success(function (data) {
                if (!data) {
                    throw new Error('data is empty.');
                }
                var factory = app.model.factory;
                var challenges = factory.runFactory(data, 'Challenge');
                def.resolve(challenges);
            }).error(function (err) {
                console.log(err);
                def.reject('Echec de récupération des données.');
            });
            return def.promise;
        }

        function removeMyChallenge(challenge) {
            var def = $q.defer();
            if (!challenge) {
                def.reject('Challenge is null or undefined.');
                return def.promise;
            } else if (!challenge.id) {
                def.reject('Challenge id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildDeleteRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/challenges/' + challenge.id);
            var promise = $http(requestOptions);
            promise.success(function () {
                def.resolve();
            }).error(function (err) {
                console.log(err);
                def.reject('Echec de récupération des données.');
            });
            return def.promise;
        }

        function inverseMyHideChallengeState(challenge) {
            var def = $q.defer();
            if (!challenge) {
                def.reject('Challenge is null or undefined.');
                return def.promise;
            } else if (!challenge.id) {
                def.reject('Challenge id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildPutRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/challenges', challenge);
            var promise = $http(requestOptions);
            promise.success(function () {
                def.resolve();
            }).error(function (err) {
                console.log(err);
                def.reject('Echec d\'iversion de de visibilité du challenge.');
            });
            return def.promise;
        }

        function addBookmark(user, challenge) {
            var def = $q.defer();
            if (!user) {
                def.reject('User is null or undefined.');
                return def.promise;
            } else if (!user.id) {
                def.reject('User id is null or undefined.');
                return def.promise;
            }
            if (!challenge) {
                def.reject('Challenge is null or undefined.');
                return def.promise;
            } else if (!challenge.id) {
                def.reject('Challenge id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildPostRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/bookmark/challenges/' + challenge.id);
            var promise = $http(requestOptions);
            promise.success(function () {
                def.resolve();
            }).error(function (err) {
                console.log(err);
                def.reject('L\'ajout du favoris a échoué.');
            });
            return def.promise;
        }

        function removeBookmark(user, challenge) {
            var def = $q.defer();
            if (!user) {
                def.reject('User is null or undefined.');
                return def.promise;
            } else if (!user.id) {
                def.reject('User id is null or undefined.');
                return def.promise;
            }
            if (!challenge) {
                def.reject('Challenge is null or undefined.');
                return def.promise;
            } else if (!challenge.id) {
                def.reject('Challenge id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildDeleteRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/bookmark/challenges/' + challenge.id);
            var promise = $http(requestOptions);
            promise.success(function () {
                def.resolve();
            }).error(function (err) {
                console.log(err);
                def.reject('L\'ajout du favoris a échoué.');
            });
            return def.promise;
        }

        function findAllBookmarks(user) {
            var def = $q.defer();
            if (!user) {
                def.reject('User is null or undefined.');
                return def.promise;
            } else if (!user.id) {
                def.reject('User id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/bookmark');
            var promise = $http(requestOptions);
            promise.success(function (data) {
                if (!data) {
                    throw new Error('data is empty.');
                }
                var factory = app.model.factory;
                var challenges = factory.runFactory(data, 'Challenge');
                def.resolve(challenges);
            }).error(function (err) {
                console.log(err);
                def.reject('L\'ajout du favoris a échoué.');
            });
            return def.promise;
        }

        function updateMe(user) {
            var def = $q.defer();
            if (!user) {
                def.reject('User is null or undefined.');
                return def.promise;
            } else if (!user.id) {
                def.reject('User id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildPutRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/user', user);
            var promise = $http(requestOptions);
            promise.success(function (data) {
                $localStorage.token = data.token;
                var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl('/isAuthenticated');
                var promise = $http(requestOptions);
                promise.success(function (data) {
                    $rootScope.user = data;
                    def.resolve(true);
                }).error(function () {
                    $state.go('signin');
                });
            }).error(function (err) {
                console.log(err);
                def.reject('L\'édition de mes informations ont échouées.');
            });
            return def.promise;
        }

        function updateMyPassword(holdPassword, newPassword, user) {
            var def = $q.defer();
            if (!user) {
                def.reject('User is null or undefined.');
                return def.promise;
            } else if (!user.id) {
                def.reject('User id is null or undefined.');
                return def.promise;
            }
            var bodyReq = {
                newPassword: newPassword,
                holdPassword: holdPassword
            };
            var requestOptions = app.httpRequestOptions.buildPutRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/updateMyPassword', bodyReq);
            var promise = $http(requestOptions);
            promise.success(function (data) {
                $localStorage.token = data.token;
                var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl('/isAuthenticated');
                var promise = $http(requestOptions);
                promise.success(function (data) {
                    $rootScope.user = data;
                    def.resolve(true);
                }).error(function () {
                    $state.go('signin');
                });
            }).error(function (err) {
                console.log(err);
                def.reject(err);
            });


            return def.promise;
        }
    }
);