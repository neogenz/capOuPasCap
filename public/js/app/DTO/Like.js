'use strict';

__.namespace(app, 'model');
__.namespace(app.model, 'Like');

app.model.Like = (function () {
    var _Like = function (param) {
        this.userId = __.verifparam(param, 'UserId');
        this.challengeId = __.verifparam(param, 'ChallengeId');
    };

    return _Like;
})();