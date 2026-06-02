const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  conversation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  participant_1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  participant_2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  last_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  last_message_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
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
  tableName: 'conversations',
  timestamps: false,
  indexes: [
    {
      fields: ['participant_1_id'],
    },
    {
      fields: ['participant_2_id'],
    },
    {
      fields: ['room_id'],
    },
  ],
});

module.exports = Conversation;
