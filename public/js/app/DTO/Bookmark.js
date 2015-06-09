'use strict';

__.namespace(app, 'model');
__.namespace(app.model, 'Bookmark');

app.model.Bookmark = (function () {
    var _Bookmark = function (param) {
        this.id = __.verifparam(param, 'id');
        this.userId = __.verifparam(param, 'UserId');
        this.challengeId = __.verifparam(param, 'ChallengeId');
    };

    return _Bookmark;
})();