'use strict';

__.namespace(app, 'model');
__.namespace(app.model, 'Comment');

app.model.Comment = (function () {
    var _Comment = function (param) {
        this.id = __.verifparam(param, 'id');
        this.text = __.verifparam(param, 'text');
        this.userId = __.verifparam(param, 'UserId');
        this.challengeId = __.verifparam(param, 'ChallengeId');
        this.createdAt = __.verifparam(param, 'createdAt');
    };

    return _Comment;
})();