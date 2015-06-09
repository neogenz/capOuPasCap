module.exports = function (provider, models, jwt) {
    var tokenUtils = require('../utils/token')(jwt);

    var findAll = function (req, res) {
        models.User.findAll().then(function (users) {
            if (!users) {
                res.status(404).send("Users not found");
            } else {
                res.send(users);
            }
        }, function (err) {
            console.log(err);
            res.status(500).send(err);
        });
    };

    var findChallenge = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found");
            } else {
                user.getChallenges({
                    include: [
                        {model: models.User, as: 'Likes'},
                        models.Comment,
                        models.State]
                }).then(function (challenges) {
                    res.send(challenges);
                }, function (err) {
                    console.log(err);
                    res.sendStatus(500);
                });
            }
        });
    };

    var findChallengeByUserId = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found");
            } else {
                models.User.findById(req.params.id).then(function (userFinded) {
                    if (!userFinded) {
                        res.status(404).send('User not found.');
                    } else {
                        userFinded.getChallenges({
                            include: [
                                {model: models.User, as: 'Likes'},
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
                }, function (err) {
                    console.log(err);
                    res.status(500).send(err);
                });
            }
        });
    };

    var findChallengeWithoutDependenciesByUserId = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found");
            } else {
                models.User.findById(req.params.id).then(function (userFinded) {
                    if (!userFinded) {
                        res.status(404).send('User not found.');
                    } else {
                        userFinded.getChallenges().then(function (challenges) {
                            res.send(challenges);
                        }, function (err) {
                            console.log(err);
                            res.sendStatus(500);
                        });
                    }
                }, function (err) {
                    console.log(err);
                    res.status(500).send(err);
                });
            }
        });
    };

    var findChallengeDoneByUserId = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found.");
            } else {
                models.User.findById(req.params.id).then(function (userFinded) {
                    if (!userFinded) {
                        res.status(404).send('User not found.');
                    } else {
                        models.Challenge.findAll({
                            include: [
                                {
                                    model: models.State,
                                    where: {UserId: userFinded.id}
                                },
                                {
                                    model: models.User,
                                    as: 'Likes'
                                },
                                models.Comment,
                                models.User,
                                {model: models.User, as: 'Bookmarks'}
                            ]
                        }).then(function (challenges) {
                            res.send(challenges);
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

    var findChallengeCommented = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found.");
            } else {
                models.Challenge.findAll({
                    include: [
                        {
                            model: models.Comment,
                            where: {UserId: user.id}
                        },
                        {model: models.User, as: 'Likes'},
                        models.User,
                        models.State,
                        {model: models.User, as: 'Bookmarks'}
                    ]
                }).then(function (challenges) {
                    res.send(challenges);
                }, function (err) {
                    console.log(err);
                    res.status(500).send(err);
                });
            }
        });
    };

    var findChallengeLiked = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found.");
            } else {
                models.Challenge.findAll({
                    include: [
                        {
                            model: models.User,
                            as: 'Likes',
                            where: {id: user.id}
                        },
                        models.User,
                        models.Comment,
                        models.State,
                        {model: models.User, as: 'Bookmarks'}
                    ]
                }).then(function (challenges) {
                    res.send(challenges);
                }, function (err) {
                    console.log(err);
                    res.status(500).send(err);
                });
            }
        });
    };

    var likedChallengeById = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found.");
            } else {
                user.getChallenges({
                    where: {id: req.params.id}, include: [
                        {model: models.User, as: 'Likes', where: {id: user.id}}
                    ]
                }).then(function (challenge) {
                    if (challenge.length === 0) {
                        res.send(false);
                    } else {
                        res.send(true);
                    }
                }, function (err) {
                    console.log(err);
                    res.status(500).send(err);
                });
            }
        }, function (err) {
            console.log(err);
            res.status(500).send(err);
        });
    };

    var update = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found.");
            } else {
                if ((req.body.hideDoneChallenge != undefined) && (req.body.hideDoneChallenge != null)) {
                    user.hideDoneChallenge = req.body.hideDoneChallenge;
                }
                if (req.body.email) {
                    user.email = req.body.email;
                }
                if (req.body.lastName) {
                    user.lastName = req.body.lastName;
                }
                if (req.body.firstName) {
                    user.firstName = req.body.firstName;
                }
                user.save().then(function (userSaved) {
                    try {
                        var token = jwt.sign(userSaved, process.env.JWT_SECRET, {
                            expiresInMinutes: 1440 // expires in 24 hours
                        });
                        res.send({token: token});
                    } catch (e) {
                        console.log(err);
                        res.status = 500;
                        res.send({
                            message: e
                        });
                    }
                }, function (err) {
                    console.log(err);
                    res.status(500).send(err);
                });
            }
        }, function (err) {
            console.log(err);
            res.status(500).send('User not found.');
        });
    };

    var findAllBookmarks = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found.");
            } else {
                models.Challenge.findAll({
                    include: [
                        {
                            model: models.User,
                            as: 'Likes'
                        },
                        models.Comment,
                        models.User,
                        models.State,
                        {
                            model: models.User,
                            as: 'Bookmarks',
                            where: {id: user.id}
                        }
                    ]
                }).then(function (bookmarks) {
                    //user.getBookmarks().then(function (bookmarks) {
                    res.send(bookmarks);
                }, function (err) {
                    console.log(err);
                    res.status(500).send(err);
                });
            }
        });
    };

    var addBookmarks = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found.");
            } else {
                var challengeId = req.params.id;
                models.Challenge.findById(challengeId).then(function (challenge) {
                    if (!challenge) {
                        res.status(404).send('Challenge not found.');
                    } else {
                        user.addBookmarks(challenge).then(function () {
                            res.sendStatus(200);
                        }, function (err) {
                            console.log(err);
                            res.status(500).send('Bookmark can\'t be add to challenge.');
                        });
                    }
                }, function (err) {
                    console.log(err);
                    res.status(500).send(err);
                });
            }
        });
    };

    var removeBookmark = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found.");
            } else {
                var challengeId = req.params.id;
                user.getBookmarks({where: {id: challengeId}}).then(function (bookmarks) {
                    if (!bookmarks[0]) {
                        res.status(404).send('Bookmark not found.');
                    } else {
                        var bookmark = bookmarks[0];
                        user.removeBookmark(bookmark).then(function () {
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
        }, function (err) {
            console.log(err);
            res.status(500).send(err);
        });
    };

    var updateMyPassword = function (req, res) {
        var userId = req.user.id;
        models.User.findById(userId).then(function (user) {
            if (!user) {
                res.status(404).send("User not found.");
            } else {
                var holdPassword = req.body.holdPassword;
                if (!user.validPassword(holdPassword)) {
                    res.status(500).send('Password is not valid.');
                } else {
                    user.password = user.generateHash(req.body.newPassword);
                    user.save().then(function (userSaved) {
                        try {
                            var token = jwt.sign(userSaved, process.env.JWT_SECRET, {
                                expiresInMinutes: 1440 // expires in 24 hours
                            });
                            res.send({token: token});
                        } catch (err) {
                            console.log(err);
                            res.status(500).send(err);
                        }
                    }, function (err) {
                        console.log(err);
                        res.status(500).send(err);
                    });
                }
            }
        }, function (err) {
            console.log(err);
            res.status(500).send(err);
        });
    };

    provider.get("/user", tokenUtils.ensureAuthorized, findAll);
    /* Get all challenges with relations (comment, done, liked, created ...) */
    provider.get("/me/challenges", tokenUtils.ensureAuthorized, findChallenge);
    /* Get all challenges with relations (comment, done, liked, created ...) */
    provider.get("/user/:id/challenges", tokenUtils.ensureAuthorized, findChallengeByUserId);
    /* Get all challenges with relations (comment, done, liked, created ...) */
    provider.get("/user/:id/challenges/light", tokenUtils.ensureAuthorized, findChallengeWithoutDependenciesByUserId);
    /* Get all challenges with relations (comment, done, liked, created ...) */
    provider.get("/user/:id/challenges/done", tokenUtils.ensureAuthorized, findChallengeDoneByUserId);
    provider.get("/me/challenges/commented", tokenUtils.ensureAuthorized, findChallengeCommented);
    provider.get("/me/challenges/liked", tokenUtils.ensureAuthorized, findChallengeLiked);
    provider.get("/me/liked/challenges/:id", tokenUtils.ensureAuthorized, likedChallengeById);
    provider.put("/updateMyPassword", tokenUtils.ensureAuthorized, updateMyPassword);

    provider.put("/user", tokenUtils.ensureAuthorized, update);
    provider.get("/bookmark", tokenUtils.ensureAuthorized, findAllBookmarks);
    provider.post("/bookmark/challenges/:id", tokenUtils.ensureAuthorized, addBookmarks);
    provider.delete("/bookmark/challenges/:id", tokenUtils.ensureAuthorized, removeBookmark);
};

