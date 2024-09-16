'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Band extends Model {
    static associate({ Meet_greet, SetTime }) {
      Band.hasMany(Meet_greet, {
        foreignKey: 'band_id',
        as: 'meet_greets'
      });

      Band.hasMany(SetTime, {
        foreignKey: 'band_id',
        as: 'set_times'
      });
    }
  }
  Band.init({
    band_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genre: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    available_start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Band',
    tableName: 'band',
    timestamps: false
  });
  return Band;
};
