'use strict';

__.namespace(app, 'model');
__.namespace(app.model, 'ChallengeLight');

app.model.ChallengeLight = (function () {
    var _ChallengeLight = function (param) {
        this.id = __.verifparam(param, 'id');
        this.text = __.verifparam(param, 'text');
        this.isHidden = __.verifparam(param, 'isHidden');
        this.createdAt = __.verifparam(param, 'createdAt');
        this.userId = __.verifparam(param, 'UserId');
    };

    return _ChallengeLight;
})();