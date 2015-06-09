appCapOuPasCap.factory('bookmarkFactory', function($rootScope, userWebApi){

    return{
        inverseBookmarkState: inverseBookmarkState,
        iHaveBookmarkOnThisChallenge: iHaveBookmarkOnThisChallenge
    };

    function inverseBookmarkState(challenge, success_callback){
        if(iHaveBookmarkOnThisChallenge(challenge)){
            removeBookmark($rootScope.user, challenge, success_callback);
        }
        else{
            addBookmark($rootScope.user, challenge, success_callback);
        }
    }

    function addBookmark(user, challenge, success_callback) {
        userWebApi.addBookmark(user, challenge).then(function () {
            success_callback(challenge);
        }, function (err) {
            console.log(err);
            throw new Error(err);
        });
    }

    function removeBookmark(user, challenge, success_callback){
        userWebApi.removeBookmark(user, challenge).then(function () {
            success_callback();
        }, function (err) {
            console.log(err);
            throw new Error(err);
        });
    }

    function iHaveBookmarkOnThisChallenge(challenge){
        var bookmarksLength = challenge.bookmarks.length;
        for (var i = 0; i < bookmarksLength; i++) {
            if (challenge.bookmarks[i].id === $rootScope.user.id)
                return true;
        }
        return false;
    };
});