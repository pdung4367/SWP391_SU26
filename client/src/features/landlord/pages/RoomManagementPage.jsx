import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  MapPin,
  Pencil,
  Trash2,
  ChevronDown,
  X,
  DollarSign,
  Users,
  Wifi,
  AlertCircle,
} from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import Button from '../../../components/common/Button';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import './RoomManagementPage.css';

const RoomManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formError, setFormError] = useState('');

  const { rooms, loading, error, createRoom, updateRoom, deleteRoom } = useRooms();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    status: 'AVAILABLE',
    amenities: [],
  });

  const filteredRooms = rooms.map(room => {
    let coverImg = '';
    if (room.images && room.images.length > 0) {
      coverImg = room.images[0].url;
    } else if (room.thumbnailUrl) {
      coverImg = room.thumbnailUrl;
    }

    return {
      id: room.roomId || room.room_id || room.id,
      title: room.title || '',
      description: room.description || '',
      address: room.address || '',
      city: room.city || '',
      district: room.district || '',
      price: Number(room.pricePerMonth || room.price_per_month || room.price || 0),
      bedrooms: room.maxOccupants || room.max_occupants || room.bedrooms || 1,
      bathrooms: room.bathrooms || 1,
      area: Number(room.areaSqm || room.area_sqm || room.area || 0),
      status: (room.status || 'AVAILABLE').toUpperCase(),
      images: room.images && room.images.length > 0 ? room.images : (coverImg ? [{ url: coverImg }] : []),
    };
  }).filter(room => {
    const matchesSearch =
      room.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      address: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      status: 'AVAILABLE',
      amenities: [],
    });
    setFormError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setFormError('Room title is required');
      return false;
    }
    if (!formData.address.trim()) {
      setFormError('Address is required');
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setFormError('Valid price is required');
      return false;
    }
    return true;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const roomPayload = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        city: 'Da Nang',
        district: 'Ngu Hanh Son',
        pricePerMonth: Number(formData.price),
        areaSqm: Number(formData.area) || 0,
        roomType: 'single',
        maxOccupants: Number(formData.bedrooms) || 1,
        status: formData.status.toLowerCase(),
      };
      await createRoom(roomPayload);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setFormError(err.message || 'Failed to create room');
    }
  };

  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setFormData({
      title: room.title || '',
      description: room.description || '',
      address: room.address || '',
      price: room.price || '',
      bedrooms: room.bedrooms || '',
      bathrooms: room.bathrooms || '',
      area: room.area || '',
      status: room.status || 'AVAILABLE',
      amenities: room.amenities || [],
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const roomId = selectedRoom.id;
      const roomPayload = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        city: selectedRoom.city || 'Da Nang',
        district: selectedRoom.district || 'Ngu Hanh Son',
        pricePerMonth: Number(formData.price),
        areaSqm: Number(formData.area) || 0,
        roomType: selectedRoom.roomType || 'single',
        maxOccupants: Number(formData.bedrooms) || 1,
        status: formData.status.toLowerCase(),
      };
      await updateRoom(roomId, roomPayload);
      setShowEditModal(false);
      setSelectedRoom(null);
      resetForm();
    } catch (err) {
      setFormError(err.message || 'Failed to update room');
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(id);
      } catch (err) {
        alert(err.message || 'Failed to delete room');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <Loading />;

  return (
    <div className="room-management">
      {/* Header */}
      <div className="room-management__header">
        <div>
          <h1 className="room-management__title">Room Management</h1>
          <p className="room-management__subtitle">Create, edit, and manage your rental rooms</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <Plus size={18} />
          Add New Room
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert--error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="room-management__filter-bar">
        <div className="filter-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdown-container">
          <button
            className="filter-dropdown-btn"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <span>{statusFilter}</span>
            <ChevronDown size={16} />
          </button>
          {showStatusDropdown && (
            <div className="filter-dropdown-menu">
              {['All', 'AVAILABLE', 'OCCUPIED', 'MAINTENANCE'].map(status => (
                <button
                  key={status}
                  className={`filter-dropdown-item ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowStatusDropdown(false);
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length > 0 ? (
        <div className="room-management__grid">
          {filteredRooms.map(room => (
            <div className="room-card" key={room.id}>
              {/* Image */}
              <div className="room-card__image-container">
                {room.images && room.images.length > 0 ? (
                  <img src={room.images[0].url} alt={room.title} className="room-card__img" />
                ) : (
                  <div className="room-card__img-placeholder">No Image</div>
                )}
                <div className={`room-card__status-badge status-${room.status?.toLowerCase()}`}>
                  {room.status}
                </div>
              </div>

              {/* Content */}
              <div className="room-card__content">
                <h3 className="room-card__title">{room.title}</h3>

                <div className="room-card__address">
                  <MapPin size={14} />
                  <span>{room.address}</span>
                </div>

                <div className="room-card__specs">
                  {room.bedrooms && (
                    <span className="spec-item">
                      <Users size={14} /> {room.bedrooms} Bed
                    </span>
                  )}
                  {room.bathrooms && (
                    <span className="spec-item">
                      <Wifi size={14} /> {room.bathrooms} Bath
                    </span>
                  )}
                  {room.area && (
                    <span className="spec-item">{room.area} m²</span>
                  )}
                </div>

                <div className="room-card__price">
                  <DollarSign size={16} />
                  <span className="price-amount">${room.price?.toLocaleString()}</span>
                  <span className="price-unit">/month</span>
                </div>

                <div className="room-card__description">
                  {room.description}
                </div>
              </div>

              {/* Actions */}
              <div className="room-card__actions">
                <button
                  className="action-btn action-btn--edit"
                  title="Edit Room"
                  onClick={() => handleEditClick(room)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="action-btn action-btn--delete"
                  title="Delete Room"
                  onClick={() => handleDeleteClick(room.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🏠"
          title="No rooms found"
          description="Create your first room to get started"
        />
      )}

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Room</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="form-error">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label>Room Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Sunny Studio Apartment"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="e.g. 123 Main St, Floor 4"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Price (USD) *</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="1200"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="OCCUPIED">Occupied</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      placeholder="1"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      placeholder="1"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Area (m²)</label>
                    <input
                      type="number"
                      name="area"
                      placeholder="50"
                      value={formData.area}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe your room..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Create Room
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && selectedRoom && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Room</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="form-error">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label>Room Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Price (USD) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="OCCUPIED">Occupied</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Area (m²)</label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagementPage;
