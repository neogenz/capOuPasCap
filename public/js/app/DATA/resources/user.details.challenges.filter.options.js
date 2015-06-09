'use strict';

__.namespace(app.constants, 'me');
__.namespace(app.constants.me, 'details');
__.namespace(app.constants.me.details, 'challenges');
__.namespace(app.constants.me.details.challenges, 'filter');
__.namespace(app.constants.me.details.challenges.filter, 'options');
__.namespace(app.constants, 'user');
__.namespace(app.constants.user, 'details');
__.namespace(app.constants.user.details, 'challenges');
__.namespace(app.constants.user.details.challenges, 'filter');
__.namespace(app.constants, 'challenges');
__.namespace(app.constants.challenges, 'filter');
__.namespace(app.constants.challenges.filter, 'options');
__.namespace(app.constants.challenges.filter.options, 'mapping');

app.constants.user.details.challenges.filter.options = {
    done: {
        text: 'réalisés',
        value: 0
    },
    posted: {
        text: 'publiés',
        value: 1
    },
    all: {
        text: 'tous',
        value: 2
    }
};

app.constants.me.details.challenges.filter.options.value = [
    {
        text: 'réalisés',
        value: 0
    },
    {
        text: 'publiés',
        value: 1
    },
    {
        text: 'commentés',
        value: 2
    },
    {
        text: 'aimés',
        value: 3
    },
    {
        text: 'favoris',
        value: 4
    }
];

app.constants.me.details.challenges.filter.options.mapping = {
    done: 0,
    posted: 1,
    commented: 2,
    liked: 3,
    bookmarked: 4
};

app.constants.challenges.filter.options.mapping = {
    createdAt: 0,
    like: 1
};