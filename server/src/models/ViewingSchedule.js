const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ViewingSchedule = sequelize.define('ViewingSchedule', {
  schedule_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tenant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  landlord_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  scheduled_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show'),
    defaultValue: 'scheduled',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'viewing_schedules',
  timestamps: false,
  indexes: [
    {
      fields: ['room_id'],
    },
    {
      fields: ['tenant_id'],
    },
    {
      fields: ['landlord_id'],
    },
    {
      fields: ['status'],
    },
  ],
});

module.exports = ViewingSchedule;
