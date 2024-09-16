'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Meet_greet extends Model {
    static associate({ Band, Event }) {
      Meet_greet.belongsTo(Band, {
        foreignKey: 'band_id',
        as: 'band',
      });

      Meet_greet.belongsTo(Event, {
        foreignKey: 'event_id',
        as: 'event',
      });
    }
  }

  Meet_greet.init({
    meet_greet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'event', // Ensure this matches the actual table name
        key: 'event_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    band_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'band', // Ensure this matches the actual table name
        key: 'band_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    meet_start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    meet_end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Meet_greet',
    tableName: 'meet_greet',
    timestamps: false,
  });

  return Meet_greet;
};
