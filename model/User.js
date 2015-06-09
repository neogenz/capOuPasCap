var bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNul: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNul: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNul: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNul: true
        },
        hideDoneChallenge: {
            type: DataTypes.BOOLEAN,
            allowNul: false,
            defaultValue: true
        }
    }, {
        classMethods: {
            associate: function (model) {
                User.belongsToMany(model.Challenge, {as: 'Bookmarks', through: 'Bookmarks'});
                User.belongsToMany(model.Challenge, {as: 'Likes', through: 'Likes'});
                User.hasMany(model.Challenge, {onDelete: 'cascade'});
                User.hasMany(model.Comment, {onDelete: 'cascade'});
                //User.hasMany(model.Like, {onDelete: 'cascade'});
                User.hasMany(model.State);
            }
        },
        instanceMethods: {
            // methods ======================
            // generating a hash
            generateHash: function (password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            },
            // checking if password is valid
            validPassword: function (password) {
                return bcrypt.compareSync(password, this.password);
            }
        }
    });

    return User;
};