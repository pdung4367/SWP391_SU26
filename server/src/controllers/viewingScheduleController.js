const { Op } = require('sequelize');
const { ViewingSchedule, Room, User, Notification } = require('../models');

// =========================================================
// POST /api/landlord/viewing-schedules
// Create viewing schedule
// =========================================================
const createViewingSchedule = async (req, res, next) => {
  try {
    const { roomId, tenantId, scheduledDate, notes } = req.body;
    const landlordId = req.user.userId;

    if (!roomId || !tenantId || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Room ID, tenant ID, and scheduled date are required.',
      });
    }

    // Verify room ownership
    const room = await Room.findOne({
      where: { room_id: roomId, landlord_id: landlordId, is_deleted: false },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
    }

    // Verify tenant exists
    const tenant = await User.findOne({
      where: { user_id: tenantId, is_deleted: false },
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found.',
      });
    }

    const schedule = await ViewingSchedule.create({
      room_id: roomId,
      tenant_id: tenantId,
      landlord_id: landlordId,
      scheduled_date: new Date(scheduledDate),
      status: 'scheduled',
      notes: notes || null,
    });

    // Create notification for tenant
    await Notification.create({
      user_id: tenantId,
      title: 'Viewing Schedule Created',
      message: `A viewing has been scheduled for ${room.title}`,
      notification_type: 'viewing_schedule',
      related_id: schedule.schedule_id,
    });

    return res.status(201).json({
      success: true,
      message: 'Viewing schedule created successfully!',
      data: {
        scheduleId: schedule.schedule_id,
        roomId: schedule.room_id,
        scheduledDate: schedule.scheduled_date,
        status: schedule.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// GET /api/landlord/viewing-schedules
// Get all viewing schedules for landlord
// =========================================================
const getLandlordViewingSchedules = async (req, res, next) => {
  try {
    const landlordId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const where = { landlord_id: landlordId };
    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await ViewingSchedule.findAndCountAll({
      where,
      include: [
        { model: Room, as: 'room', attributes: ['room_id', 'title', 'address'] },
        { model: User, as: 'tenant', attributes: ['user_id', 'full_name', 'email', 'phone'] },
      ],
      offset,
      limit: parseInt(limit),
      order: [['scheduled_date', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      data: rows.map(schedule => ({
        scheduleId: schedule.schedule_id,
        roomId: schedule.room_id,
        tenantId: schedule.tenant_id,
        scheduledDate: schedule.scheduled_date,
        status: schedule.status,
        notes: schedule.notes,
        room: schedule.room,
        tenant: schedule.tenant,
        createdAt: schedule.created_at,
      })),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// GET /api/landlord/viewing-schedules/:scheduleId
// Get viewing schedule details
// =========================================================
const getViewingScheduleDetails = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const landlordId = req.user.userId;

    const schedule = await ViewingSchedule.findOne({
      where: { schedule_id: scheduleId, landlord_id: landlordId },
      include: [
        { model: Room, as: 'room', attributes: ['room_id', 'title', 'address', 'price_per_month'] },
        { model: User, as: 'tenant', attributes: ['user_id', 'full_name', 'email', 'phone', 'avatar_url'] },
      ],
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Viewing schedule not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        scheduleId: schedule.schedule_id,
        roomId: schedule.room_id,
        tenantId: schedule.tenant_id,
        scheduledDate: schedule.scheduled_date,
        status: schedule.status,
        notes: schedule.notes,
        room: schedule.room,
        tenant: schedule.tenant,
        createdAt: schedule.created_at,
        updatedAt: schedule.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// PUT /api/landlord/viewing-schedules/:scheduleId
// Update viewing schedule
// =========================================================
const updateViewingSchedule = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const { scheduledDate, status, notes } = req.body;
    const landlordId = req.user.userId;

    const schedule = await ViewingSchedule.findOne({
      where: { schedule_id: scheduleId, landlord_id: landlordId },
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Viewing schedule not found.',
      });
    }

    if (scheduledDate) schedule.scheduled_date = new Date(scheduledDate);
    if (status) schedule.status = status;
    if (notes !== undefined) schedule.notes = notes;

    schedule.updated_at = new Date();
    await schedule.save();

    return res.status(200).json({
      success: true,
      message: 'Viewing schedule updated successfully!',
      data: {
        scheduleId: schedule.schedule_id,
        status: schedule.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// DELETE /api/landlord/viewing-schedules/:scheduleId
// Delete viewing schedule
// =========================================================
const deleteViewingSchedule = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const landlordId = req.user.userId;

    const schedule = await ViewingSchedule.findOne({
      where: { schedule_id: scheduleId, landlord_id: landlordId },
      include: [{ model: User, as: 'tenant' }],
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Viewing schedule not found.',
      });
    }

    await schedule.destroy();

    // Create notification for tenant
    await Notification.create({
      user_id: schedule.tenant_id,
      title: 'Viewing Schedule Cancelled',
      message: 'A viewing schedule has been cancelled',
      notification_type: 'viewing_schedule',
      related_id: schedule.schedule_id,
    });

    return res.status(200).json({
      success: true,
      message: 'Viewing schedule deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createViewingSchedule,
  getLandlordViewingSchedules,
  getViewingScheduleDetails,
  updateViewingSchedule,
  deleteViewingSchedule,
};
