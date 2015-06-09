module.exports = function (sequelize, DataTypes) {
    var Challenge = sequelize.define("Challenge", {
        text: {
            type: DataTypes.STRING(140),
            allowNul: false
        },
        isHidden: {
            type: DataTypes.BOOLEAN,
            allowNul: false,
            defaultValue: false
        }
    }, {
        classMethods: {
            associate: function (model) {
                Challenge.hasMany(model.Comment, {onDelete: 'cascade'});
                Challenge.belongsToMany(model.User, {as: 'Likes', through: 'Likes'});
                Challenge.hasMany(model.State);
                Challenge.belongsTo(model.User);
                Challenge.belongsToMany(model.User, {as:'Bookmarks', through: 'Bookmarks'});
            }
        }
    });

    return Challenge;
};