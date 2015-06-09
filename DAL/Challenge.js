module.exports = function (provider, models, jwt) {
    var Promise = require('promise');
    var tokenUtils = require('../utils/token')(jwt);
    var multer = require('multer');

    var create = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send('User not found');
            } else {
                if (!req.body.text) {
                    res.status(403).send('The text of challenge can\'t be empty');
                }
                var newChallenge = {
                    text: req.body.text
                    //@todo faire une factory
                };
                if (newChallenge.text.length > 140) {
                    res.status(403);
                    res.send('Challenge can\'t be have more of 140 characters.');
                } else {

                    models.Challenge.create(newChallenge).then(function (challenge) {
                        user.addChallenges(challenge).then(function () {
                            res.sendStatus(200);
                        }, function (err) {
                            console.log(err);
                            res.sendStatus(500);
                        });
                    });
                }
            }
        });
    };

    var findAll = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found");
            } else {
                models.Challenge.findAll({
                    include: [
                        {
                            model: models.User,
                            as: 'Likes'
                        },
                        models.Comment,
                        models.State,
                        models.User,
                        {model: models.User, as: 'Bookmarks'}
                    ]
                }).then(function (challenges) {
                    res.send(challenges);
                }, function (err) {
                    console.log(err);
                    res.sendStatus(500);
                });
            }
        });
    };

    var findAllIncludingJustLikes = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found");
            } else {
                models.Challenge.findAll({include: [{model: models.User, as: 'Likes'}]}).then(function (challenges) {
                    res.send(challenges);
                }, function (err) {
                    console.log(err);
                    res.sendStatus(500);
                });
            }
        });
    };

    var findCommentsIncludingUserByChallengeId = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found");
            } else {
                var challengeId = req.params.id;
                models.Challenge.findById(challengeId).then(function (challenge) {
                    if (!challenge) {
                        res.status(404).send('Challenge is not found.');
                    } else {
                        challenge.getComments({include: [models.User]}).then(function (comments) {
                            if (!comments) {
                                res.status(404).send('Comments not found.');
                            } else {
                                res.send(comments);
                            }
                        }, function (err) {
                            console.log(err);
                            res.status(500).send(err);
                        });
                    }
                }, function (err) {
                    console.log(err);
                    res.sendStatus(500);
                });
            }
        });
    };

    var findById = function (req, res) {
        var userId = req.user.id;
        //@todo faire le find by id de l'user dans le sensureAuthenticated et le stocker dans la request
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found");
            } else {
                models.Challenge.findById(req.params.id, {
                    include: [
                        {
                            model: models.User,
                            as: 'Likes'
                        }, models.Comment,
                        models.State,
                        models.User,
                        {model: models.User, as: 'Bookmarks'}
                    ]
                }).then(function (challenge) {
                    res.send(challenge);
                }, function (err) {
                    console.log(err);
                    res.sendStatus(500);
                });
            }
        });
    };

    var update = function (req, res) {
        var userId = req.user.id;
        var newChallenge = {
            isHidden: req.body.isHidden
            //@todo faire une factory
        };
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send('User not found.');
            } else {
                user.getChallenges({where: {id: req.body.id}}).then(function (challenge) {
                    if (!challenge[0]) {
                        res.status(404).send('Challenge not found.');
                    } else {
                        challenge[0].isHidden = newChallenge.isHidden;
                        challenge[0].save().then(function () {
                            res.sendStatus(200);
                        }, function (err) {
                            console.log(err);
                            res.status(500).send(err);
                        });
                    }
                }, function (err) {
                    console.log(err);
                    res.status(500).send(err);
                });
            }
        });
    };

    var remove = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send('User not found.');
            } else {
                getUsersChallengeCallback(req.params.id, user).then(function (challenge) {
                    verifyIfChallengeHaveLikesCallback(challenge).then(function () {
                        verifyIfChallengeHaveStatesCallback(challenge).then(function () {
                            destroyChallengeCallback(challenge, user).then(function () {
                                res.sendStatus(200);
                            }, function (err) {
                                res.status(500).send(err);
                            })
                        }, function (err) {
                            res.status(500).send(err);
                        })
                    }, function (err) {
                        res.status(500).send(err);
                    });
                }, function (err) {
                    res.status(500).send(err);
                });
            }
        });

        function getUsersChallengeCallback(challengeId, user) {
            var promise = new Promise(function (resolve, reject) {
                user.getChallenges({where: {id: challengeId}}).then(function (challenge) {
                    if (!challenge[0]) {
                        reject('Challenge not found.');
                    } else {
                        resolve(challenge[0]);
                    }
                }, function (err) {
                    console.log(err);
                    reject('Challenge not found.');
                });
            });
            return promise;
        }

        function verifyIfChallengeHaveLikesCallback(challenge) {
            var promise = new Promise(function (resolve, reject) {
                challenge.getLikes().then(function (likes) {
                    if (likes.length > 0) {
                        reject('Challenge have likes.');
                    } else {
                        resolve();
                    }
                }, function (err) {
                    console.log(err);
                    reject('Server can\'t verify if challenge have likes.');
                });
            });
            return promise;
        }

        function verifyIfChallengeHaveStatesCallback(challenge) {
            var promise = new Promise(function (resolve, reject) {
                challenge.getStates().then(function (states) {
                    if (states.length > 0) {
                        reject('Challenge have done state.');
                    } else {
                        resolve();
                    }
                }, function (err) {
                    console.log(err);
                    reject('Server can\'t verify if challenge have done states.');
                });
            });
            return promise;
        }

        function destroyChallengeCallback(challenge, user) {
            var promise = new Promise(function (resolve, reject) {
                user.removeChallenge(challenge).then(function () {
                    challenge.destroy().then(function () {
                        resolve();
                    }, function (err) {
                        console.log(err);
                        reject('Challenge not destroyed.');
                    });
                }, function (err) {
                    console.log(err);
                    reject('Challenge not deleted on user.');
                });
            });
            return promise;
        }
    };

    var findCommentsByChallengeId = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send('User not found.');
            } else {
                var challengeId = req.params.id;
                models.Challenge.findById(challengeId).then(function (challenge) {
                    challenge.getComments().then(function (comments) {
                        res.send(comments);
                    }, function (err) {
                        console.log(err);
                        res.status(404);
                        res.send('Comments not found.');
                    });
                }, function (err) {
                    console.log(err);
                    res.status(404);
                    res.send('Challenge not found.');
                });
            }
        });
    };

    var addCommentByChallengeId = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send('User not found.');
            } else {
                var challengeId = req.params.id;
                models.Challenge.findById(challengeId).then(function (challenge) {
                    if ((challenge !== null)) {
                        addCommentCallback(req, res, user, challenge);
                    } else {
                        res.status(404);
                        res.send('Challenge not found.');
                    }

                }, function (err) {
                    console.log(err);
                    res.status(404);
                    res.send('Challenge not found.');
                });
            }
        });

        function addCommentCallback(req, res, user, challenge) {
            var comment = models.Comment.build({
                text: req.body.text
            });
            if (comment.text.length > 140) {
                res.status(403);
                res.send('Comment can\'t be have more of 140 characters.');
            } else {
                challenge.addComments(comment).then(function () {
                    user.addComments(comment).then(function () {
                        res.sendStatus(200);
                    }, function (err) {
                        console.log(err);
                        res.status(500);
                        res.send('Comment can\'t be add to user.');
                    });
                }, function (err) {
                    console.log(err);
                    res.status(500);
                    res.send('Comment can\'t be add to challenge.');
                });
            }
        }
    };

    var countLikeByChallengeId = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send('User not found.');
            } else {
                var challengeId = req.params.id;
                models.Challenge.findById(challengeId).then(function (challenge) {
                    if (!challenge) {
                        res.status(404);
                        res.send('Challenge not found.');
                    } else {
                        challenge.getLikes().then(function (likes) {
                            res.send(likes.length.toString());
                        }, function (err) {
                            console.log(err);
                            res.status(500).send(err);
                        });
                    }
                }, function (err) {
                    console.log(err);
                    res.status(500).send(err);
                });
            }
        });
    };

    var addLikeByChallengeId = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send('User not found.');
            } else {
                var challengeId = req.params.id;
                models.Challenge.findById(challengeId).then(function (challenge) {
                    if ((challenge !== null)) {
                        addLikeCallback(res, user, challenge);
                    } else {
                        res.status(404);
                        res.send('Challenge not found.');
                    }
                }, function (err) {
                    console.log(err);
                    res.status(404);
                    res.send('Challenge not found.');
                });
            }
        });

        function addLikeCallback(res, user, challenge) {
            challenge.addLike(user).then(function () {
                res.sendStatus(200);
            }, function (err) {
                console.log(err);
                res.status(500).send(err);
            })
        };
    };

    var addStateByChallengeId = function (req, res) {
        if (req.picture === undefined) {
            res.status(403).send('A picture need to be present.');
        } else if (req.picture.badType) {
            res.status(500);
            res.send('Picture is in bad format.');
        } else if (req.picture.uploaded === false) {
            res.status(500);
            res.send('Picture can\'t be uploaded and state can\'t be done.');
        }
        else {
            var userId = req.user.id;
            models.User.findById(userId).then(function (user) {
                if (!user) {
                    res.status(404).send('User not found.');
                } else {
                    var challengeId = req.params.id;
                    models.Challenge.findById(challengeId).then(function (challenge) {
                        if (!challenge) {
                            res.status(404);
                            res.send('Challenge not found.');
                        } else {
                            var newState = {
                                done: req.body.done,
                                picturePublicPath: req.picture.path,
                                pictureName: req.picture.name
                            };
                            challenge.getStates({where: {UserId: req.user.id}}).then(function (state) {
                                if ((state === undefined || state === null) || state.length === 0) {
                                    models.State.create(newState).then(function (state) {
                                        addStateCallback(challenge, user, state).then(function (picturePublicPath) {
                                            res.status(200);
                                            res.send(picturePublicPath);
                                        }, function (err) {
                                            res.status(500).send(err);
                                        });
                                    }, function (err) {
                                        console.log(err);
                                        res.status(500);
                                        res.send('State can\'t be created.');
                                    });
                                } else {
                                    res.status(403).send('You have already done this challenge.');
                                }
                            }, function (err) {
                                console.log(err);
                                res.status(500).send(err);
                            });
                        }
                    });
                }
            });
        }


        function addStateCallback(challenge, user, state) {
            var promise = new Promise(function (resolve, reject) {
                challenge.addState(state).then(function () {
                    user.addState(state).then(function () {
                        resolve(state.picturePublicPath);
                    }, function (err) {
                        console.log(err);
                        reject('User can\'t be add state.');
                    });
                }, function (err) {
                    console.log(err);
                    reject('Challenge can\'t be add state.');
                });
            });
            return promise;
        }
    };

    var uploadMiddlewhareListener = multer({
        dest: './uploads/',
        rename: function (fieldname, filename, req, res) {
            req.picture = {};
            req.picture.uploaded = false;
            req.picture.badType = false;
            req.picture.name = filename;
            return req.user.id + filename + Date.now();
        },
        onFileUploadStart: function (file, req, res) {
            if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
                req.picture.badType = true;
                return false;
            } else {
                console.log(file.originalname + ' is starting ...');
            }
        },
        onFileUploadComplete: function (file, req) {
            console.log(file.fieldname + ' uploaded to  ' + file.path);
            req.picture.uploaded = true;
            req.picture.path = file.path;
        }
    });

    var findStatesByChallengeId = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send('User not found.');
            } else {
                var challengeId = req.params.id;
                models.Challenge.findById(challengeId).then(function (challenge) {
                    if (challenge === null) {
                        res.status(500);
                        res.send('Challenge not found');
                    } else {
                        challenge.getStates().then(function (states) {
                            res.send(states);
                        }, function (err) {
                            console.log(err);
                            res.status(500);
                            res.send('State\'s finding occured an error.');
                        });
                    }
                }, function (err) {
                    console.log(err);
                    res.status(500);
                    res.send('Challenge\'s finding occured an error.');
                });
            }
        });
    };

    provider.post("/challenges", tokenUtils.ensureAuthorized, create); //OK
    provider.get("/challenges", tokenUtils.ensureAuthorized, findAll); //OK
    provider.get("/challenges/like", tokenUtils.ensureAuthorized, findAllIncludingJustLikes); //OK
    provider.get("/challenges/:id/comment", tokenUtils.ensureAuthorized, findCommentsIncludingUserByChallengeId); //OK
    provider.get("/challenges/:id", tokenUtils.ensureAuthorized, findById); //OK
    provider.put("/challenges", tokenUtils.ensureAuthorized, update); //OK
    provider.delete("/challenges/:id", tokenUtils.ensureAuthorized, remove); //OK

    provider.get("/comment/challenges/:id", tokenUtils.ensureAuthorized, findCommentsByChallengeId); //OK
    provider.post("/comment/challenges/:id", tokenUtils.ensureAuthorized, addCommentByChallengeId); //OK

    //provider.get("/like/challenges/:id", tokenUtils.ensureAuthorized, findLikesByChallengeId);
    provider.get("/countLike/challenges/:id", tokenUtils.ensureAuthorized, countLikeByChallengeId); //OK
    provider.post("/like/challenges/:id", tokenUtils.ensureAuthorized, addLikeByChallengeId); //OK

    provider.get("/done/challenges/:id", tokenUtils.ensureAuthorized, findStatesByChallengeId); //OK

    provider.post("/done/challenges/:id", tokenUtils.ensureAuthorized, uploadMiddlewhareListener, addStateByChallengeId); //OK


};

