'use strict';

/******************************************
 * DEPENDENCIES :
 *      DTO/Comment.js
 *      DTO/State.js
 *      DTO/User.js
 *******************************************/

__.namespace(app, 'model');
__.namespace(app.model, 'Challenge');

app.model.Challenge = (function () {
    var _Challenge = function (param) {
        this.id = __.verifparam(param, 'id');
        this.text = __.verifparam(param, 'text');
        this.isHidden = __.verifparam(param, 'isHidden');
        this.createdAt = __.verifparam(param, 'createdAt');
        this.comments = __.verifparam(param, 'Comments');
        if (this.comments.length > 0) {
            this.comments = app.model.factory.runFactory(this.comments, 'Comment');
        }
        this.states = __.verifparam(param, 'States');
        if (this.states.length > 0) {
            this.states = app.model.factory.runFactory(this.states, 'State');
        }
        this.likes = __.verifparam(param, 'Likes');
        if (this.likes.length > 0) {
            this.likes = app.model.factory.runFactory(this.likes, 'User');
        }
        this.user = __.verifparam(param, 'User');
        this.user = app.model.factory.runFactory(this.user, 'User');
        this.bookmarks = __.verifparam(param, 'Bookmarks');
        if (this.bookmarks.length > 0) {
            this.bookmarks = app.model.factory.runFactory(this.bookmarks, 'User');
        }
    };

    return _Challenge;
})();
