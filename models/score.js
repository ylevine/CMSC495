
"use strict";

module.exports = function(sequelize, DataTypes) {
    /**
     * model for the Score table. This will allow sequelize ot perform operations on the table as well as create it if the schema is
     * already present (and sync is invoked)
     */
    return sequelize.define("Score", {
        id: {
            field: 'id',
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            field: 'name',
            type: DataTypes.STRING,
            allowNull: false
        },
        score: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            field: 'score'
        },
        creationDate : {
            field: 'creationDate',
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    },{
        freezeTableName: false,
        timestamps: false,
        underscored: true

    });
};