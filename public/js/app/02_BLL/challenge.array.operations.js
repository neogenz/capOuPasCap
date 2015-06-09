__.namespace(app, 'challenge');
__.namespace(app.challenge, 'array');

app.challenge.array.removeChallenge = function(challengeArray, challengeToRemove){
    if(!challengeArray || !challengeToRemove){
        throw new Error('Error : !challengeArray || !challengeToRemove');
    }
    var challengeArrayLength = challengeArray.length;
    for (var i = 0; i < challengeArrayLength; i++) {
        var currentElement = challengeArray[i];
        if (currentElement.id === challengeToRemove.id) {
            app.array.removeElement(challengeArray, i);
            return;
        }
    }
};