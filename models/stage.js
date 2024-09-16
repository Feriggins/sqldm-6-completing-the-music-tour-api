'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Stage extends Model {
    static associate({ Event, stage_event, SetTime }) {
      Stage.belongsToMany(Event, {
        foreignKey: 'stage_id',
        as: 'events',
        through: stage_event,
      });

      Stage.hasMany(SetTime, {
        foreignKey: 'stage_id',
        as: 'set_times',
      });
    }
  }

  Stage.init({
    stage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    stage_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Ensure event_id is provided when creating a Stage
    },
  }, {
    sequelize,
    modelName: 'Stage',
    tableName: 'stages',
    timestamps: false,
  });

  return Stage;
};
