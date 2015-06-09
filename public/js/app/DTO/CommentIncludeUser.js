'use strict';

__.namespace(app, 'model');
__.namespace(app.model, 'CommentIncludeUser');

app.model.CommentIncludeUser = (function () {
    var _CommentIncludeUser = function (param) {
        this.id = __.verifparam(param, 'id');
        this.text = __.verifparam(param, 'text');
        this.userId = __.verifparam(param, 'UserId');
        this.challengeId = __.verifparam(param, 'ChallengeId');
        this.createdAt = __.verifparam(param, 'createdAt');
        this.user = __.verifparam(param, 'User');
    };

    return _CommentIncludeUser;
})();