module.exports = function (provider, models, jwt) {
    var publicDir = __dirname + "/public/";
    var css = publicDir + "css/";
    var js = publicDir + "js/";
    var fonts = publicDir;
    var tokenUtils = require('./utils/token')(jwt);

    provider.get(['/', '/views/*'], function (req, res) {
        if (req.originalUrl === '/') {
            req.originalUrl = 'index';
        }
        res.sendFile(publicDir + req.originalUrl + '.html');
    });

    provider.get('*.js', function (req, res) {
        res.sendFile(js + req.originalUrl);
    });

    provider.get('*.css', function (req, res) {
        res.sendFile(css + req.originalUrl);
    });

    provider.get(['*.woff', '*.ttf'], function (req, res) {
        res.sendFile(fonts + req.path);
    });

    provider.get(['/uploads/*'], function (req, res) {
        res.sendFile(__dirname + req.path);
    });

    // Signin ==============================================================
    provider.post('/signin', function (req, res) {
        models.User.findOne({where: {email: req.body.email}}).then(function (user) {
            if (!user) {
                console.error('User not exist.');
                res.status(404);
                res.send({
                    message: 'User not authenticated.'
                });
            }
            if (!user.validPassword(req.body.password)) {
                console.error('Invalid password');
                res.status(403);
                res.send({
                    message: 'User not authenticated.'
                });
            }
            try {
                var token = jwt.sign(user, process.env.JWT_SECRET, {
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
            res.status(403);
            res.send({
                message: 'User not authenticated.'
            });
        });
    });

    // Signup ==============================================================
    provider.post('/signup', function (req, res) {
        models.User.findOne({where: {email: req.body.email}}).then(function (user) {
            if (!user) {
                var newUser = models.User.build({
                    email: req.body.email,
                    password: req.body.password,
                    lastName: req.body.lastName,
                    firstName: req.body.firstName
                });
                newUser.password = newUser.generateHash(req.body.password);
                newUser.save().then(function (userSaved) {
                    var token = jwt.sign(userSaved, process.env.JWT_SECRET, {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });
                    res.send({
                        token: token
                    });
                }).catch(function (error) {
                    res.status = 500;
                    res.send({
                        message: error
                    });
                });
            } else {
                res.status = 500;
                res.send({
                    message: 'User already exists'
                });
            }
        }, function () {
            res.status = 500;
            res.send({message: 'An error has occured, see in first the ORM API.'});
        });
    });

    provider.get('/isAuthenticated', tokenUtils.ensureAuthorized, getUserAuthenticated);

    function getUserAuthenticated(req, res) {
        res.send(req.user);
    }
};