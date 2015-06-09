'use strict';

__.namespace(app, 'model');
__.namespace(app.model, 'User');

app.model.User = (function () {
    var _User = function (param) {
        this.id = __.verifparam(param, 'id');
        this.email = __.verifparam(param, 'email');
        this.firstName = __.verifparam(param, 'firstName');
        this.lastName = __.verifparam(param, 'lastName');
        this.createdAt = __.verifparam(param, 'createdAt');
        this.hideDoneChallenge = __.verifparam(param, 'hideDoneChallenge');
    };

    return _User;
})();