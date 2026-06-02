const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Facility = sequelize.define('Facility', {
  facility_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  facility_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  facility_type: {
    type: DataTypes.ENUM(
      'furniture',
      'appliance',
      'utility',
      'security',
      'entertainment',
      'other'
    ),
    defaultValue: 'other',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'facilities',
  timestamps: false,
  indexes: [
    {
      fields: ['room_id'],
    },
  ],
});

module.exports = Facility;
