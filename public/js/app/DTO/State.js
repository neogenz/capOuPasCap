'use strict';

__.namespace(app, 'model');
__.namespace(app.model, 'State');

app.model.State = (function () {
    var _State = function (param) {
        this.id = __.verifparam(param, 'id');
        this.validByChallengeAuthor = __.verifparam(param, 'validByChallengeAuthor');
        this.picturePublicPath = __.verifparam(param, 'picturePublicPath');
        this.pictureName = __.verifparam(param, 'pictureName');
        this.userId = __.verifparam(param, 'UserId');
        this.challengeId = __.verifparam(param, 'ChallengeId');
        this.createdAt = __.verifparam(param, 'createdAt');
    };

    return _State;
})();