'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate({ Stage, stage_event, Meet_greet, SetTime }) {
      Event.belongsToMany(Stage, {
        foreignKey: 'event_id',
        as: 'stages',
        through: stage_event
      });

      Event.hasMany(Meet_greet, {
        foreignKey: 'event_id',
        as: 'meet_greets'
      });

      Event.hasMany(SetTime, {
        foreignKey: 'event_id',
        as: 'set_times'
      });
    }
  }
  Event.init({
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'event',
    timestamps: false
  });
  return Event;
};
