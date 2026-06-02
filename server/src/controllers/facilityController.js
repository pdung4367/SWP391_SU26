const { Room, Facility } = require('../models');

// =========================================================
// POST /api/landlord/rooms/:roomId/facilities
// Add facility to room
// =========================================================
const addFacility = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { facilityName, facilityType } = req.body;
    const landlordId = req.user.userId;

    if (!facilityName) {
      return res.status(400).json({
        success: false,
        message: 'Facility name is required.',
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

    const facility = await Facility.create({
      room_id: roomId,
      facility_name: facilityName,
      facility_type: facilityType || 'other',
    });

    return res.status(201).json({
      success: true,
      message: 'Facility added successfully!',
      data: {
        facilityId: facility.facility_id,
        facilityName: facility.facility_name,
        facilityType: facility.facility_type,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// GET /api/landlord/rooms/:roomId/facilities
// Get all facilities for a room
// =========================================================
const getRoomFacilities = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const landlordId = req.user.userId;

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

    const facilities = await Facility.findAll({
      where: { room_id: roomId },
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: facilities.map(f => ({
        facilityId: f.facility_id,
        facilityName: f.facility_name,
        facilityType: f.facility_type,
        createdAt: f.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// DELETE /api/landlord/rooms/:roomId/facilities/:facilityId
// Remove facility from room
// =========================================================
const removeFacility = async (req, res, next) => {
  try {
    const { roomId, facilityId } = req.params;
    const landlordId = req.user.userId;

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

    const facility = await Facility.findOne({
      where: { facility_id: facilityId, room_id: roomId },
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found.',
      });
    }

    await facility.destroy();

    return res.status(200).json({
      success: true,
      message: 'Facility removed successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// PUT /api/landlord/rooms/:roomId/facilities/:facilityId
// Update facility
// =========================================================
const updateFacility = async (req, res, next) => {
  try {
    const { roomId, facilityId } = req.params;
    const { facilityName, facilityType } = req.body;
    const landlordId = req.user.userId;

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

    const facility = await Facility.findOne({
      where: { facility_id: facilityId, room_id: roomId },
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found.',
      });
    }

    if (facilityName) facility.facility_name = facilityName;
    if (facilityType) facility.facility_type = facilityType;

    await facility.save();

    return res.status(200).json({
      success: true,
      message: 'Facility updated successfully!',
      data: {
        facilityId: facility.facility_id,
        facilityName: facility.facility_name,
        facilityType: facility.facility_type,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFacility,
  getRoomFacilities,
  removeFacility,
  updateFacility,
};
