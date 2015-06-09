appCapOuPasCap.factory('challengeWebApi',
    function ($http, $q) {

        return {
            findAll: findAll,
            findById: findById,
            add: add,
            like: like,
            comment: comment,
            findCommentsByChallenge: findCommentsByChallenge,
            doneThisChallenge: doneThisChallenge
        };

        //Web API
        function findAll() {
            var def = $q.defer();
            var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/challenges');
            var promise = $http(requestOptions);
            promise.success(function (data) {
                if (!data) {
                    throw new Error('data is empty.');
                }
                var factory = app.model.factory;
                var challenges = factory.runFactory(data, 'Challenge');
                def.resolve(challenges);
            }).error(function () {
                def.reject('Echec de récupération des données.');
            });
            return def.promise;
        }

        function findById(challengeId) {
            var def = $q.defer();
            var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/challenges/' + challengeId);
            var promise = $http(requestOptions);
            promise.success(function (data) {
                if (!data) {
                    throw new Error('data is empty.');
                }
                var factory = app.model.factory;
                var challenge = factory.runFactory(data, 'Challenge');
                def.resolve(challenge);
            }).error(function () {
                def.reject('Echec de récupération des données.');
            });
            return def.promise;
        }

        function add(challenge) {
            var def = $q.defer();
            if (!challenge) {
                def.reject('Challenge is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildPostRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/challenges', challenge);
            var promise = $http(requestOptions);
            promise.success(function () {
                def.resolve();
            }).error(function () {
                def.reject('La création du défis à échouée.');
            });
            return def.promise;
        }

        function like(challenge) {
            var def = $q.defer();
            if (!challenge) {
                def.reject('Challenge is null or undefined.');
                return def.promise;
            } else if (!challenge.id) {
                def.reject('Challenge id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildPostRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/like/challenges/' + challenge.id);
            var promise = $http(requestOptions);
            promise.success(function () {
                def.resolve();
            }).error(function () {
                def.reject('Le like a échoué.');
            });
            return def.promise;
        }

        function comment(challenge, text) {
            var def = $q.defer();
            if (!challenge) {
                def.reject('Challenge is null or undefined.');
                return def.promise;
            } else if (!challenge.id) {
                def.reject('Challenge id is null or undefined.');
                return def.promise;
            }else if (!text) {
                def.reject('Text of comment is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildPostRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/comment/challenges/' + challenge.id, text);
            var promise = $http(requestOptions);
            promise.success(function () {
                def.resolve();
            }).error(function (err) {
                throw new Error(err);
            });
            return def.promise;
        }

        function findCommentsByChallenge(challenge) {
            var def = $q.defer();
            if (!challenge) {
                def.reject('Challenge is null or undefined.');
                return def.promise;
            } else if (!challenge.id) {
                def.reject('Challenge id is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildGetRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/challenges/' + challenge.id + '/comment');
            var promise = $http(requestOptions);
            promise.success(function (data) {
                if (!data) {
                    throw new Error('data is empty.');
                }
                var factory = app.model.factory;
                var comments = factory.runFactory(data, 'CommentIncludeUser');
                def.resolve(comments);
            }).error(function () {
                def.reject('Echec de récupération des données.');
            });
            return def.promise;
        }

        function doneThisChallenge(challenge, picture) {
            var def = $q.defer();
            if (!challenge) {
                def.reject('Challenge is null or undefined.');
                return def.promise;
            } else if (!challenge.id) {
                def.reject('Challenge id is null or undefined.');
                return def.promise;
            } else if (!picture) {
                def.reject('Picture to upload is null or undefined.');
                return def.promise;
            }
            var requestOptions = app.httpRequestOptions.buildPostFormDataRequestOptToCallThisUrl(app.httpRequestOptions.urlHeader + '/done/challenges/' + challenge.id, picture);
            var promise = $http(requestOptions);
            promise.success(function (data) {
                if (!data) {
                    throw new Error('data is empty.');
                }
                def.resolve();
            }).error(function () {
                def.reject('The upload of picture have fail.');
            });
            return def.promise;
        }
    }
);