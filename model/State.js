module.exports = function (sequelize, DataTypes) {
    var State = sequelize.define("State", {
        validByChallengeAuthor: {
            type: DataTypes.BOOLEAN,
            allowNul: false,
            defaultValue: false
        },
        picturePublicPath: {
            type: DataTypes.STRING,
            allowNul: false
        },
        pictureName: {
            type: DataTypes.STRING,
            allowNul: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                State.belongsTo(models.Challenge);
            }
        }
    });

    return State;
};