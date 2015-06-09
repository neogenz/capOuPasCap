module.exports = function (sequelize, DataTypes) {
    var Comment = sequelize.define("Comment", {
        text: {
            type: DataTypes.STRING(140),
            allowNul: false
        }
    }, {
        classMethods: {
            associate: function (model) {
                Comment.belongsTo(model.User);

            }
        }
    });

    return Comment;
};