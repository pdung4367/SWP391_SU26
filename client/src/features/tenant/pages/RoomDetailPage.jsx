import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Star, Share2, Heart, Wifi, Snowflake, Key, 
  Coffee, Compass, Dumbbell, Grid, ChevronDown, ChevronLeft, MessageSquare, CheckCircle 
} from 'lucide-react';
import './RoomDetailPage.css';

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMoreAbout, setShowMoreAbout] = useState(false);
  
  // Booking Card States
  const [moveIn, setMoveIn] = useState('');
  const [moveOut, setMoveOut] = useState('');
  const [guests, setGuests] = useState('1 Guest');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/listings/${id}`);
        if (response.data.success) {
          setRoomData(response.data.data);
        }
      } catch (err) {
        setError('Failed to load listing details');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const getToken = () => {
    try {
      const authStorage = JSON.parse(localStorage.getItem('auth-storage'));
      return authStorage?.state?.token || null;
    } catch { return null; }
  };

  const handleBookingRequest = async (type) => {
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.post('http://localhost:5000/api/bookings', {
        listing_id: parseInt(id),
        type: type // 'view' or 'rent'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        alert(type === 'rent' ? 'Deposit request sent!' : 'Viewing request sent!');
        if (type === 'rent') navigate('/payment');
      }
    } catch (err) {
      alert('Failed to send request. ' + (err.response?.data?.message || err.message));
    }
  };

  const handleChatWithLandlord = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }
      // First, get or create conversation
      const response = await axios.post('http://localhost:5000/api/landlord/conversations', {
        participantId: roomData.landlord_id,
        roomId: roomData.room_id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const convId = response.data.data.conversationId;
        navigate(`/messages?conversationId=${convId}`);
      }
    } catch (err) {
      alert('Failed to start chat. ' + (err.response?.data?.message || ''));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !roomData) return <div className="p-8 text-center text-red-500">{error || 'Listing not found'}</div>;

  const images = roomData.images?.length > 0 
    ? roomData.images.map(img => `http://localhost:5000${img.image_url}`)
    : (roomData.thumbnailUrl ? [`http://localhost:5000${roomData.thumbnailUrl}`] : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format&fit=crop&q=60']);
    
  // Ensure we have at least 5 images for the grid
  while (images.length < 5) {
    images.push(images[0]);
  }

  return (
    <div className="room-detail-page container pt-20">
      {/* Back button for convenient navigation */}
      <button className="back-btn" onClick={() => navigate('/listings')}>
        <ChevronLeft size={16} />
        <span>Back to Explore</span>
      </button>

      {/* Gallery Section */}
      <section className="detail-gallery">
        <div className="gallery-main">
          <img src={images[0]} alt="Main space" />
        </div>
        <div className="gallery-grid">
          <div className="gallery-item"><img src={images[1]} alt="Bedroom" /></div>
          <div className="gallery-item"><img src={images[2]} alt="Kitchen" /></div>
          <div className="gallery-item"><img src={images[3]} alt="Bathroom" /></div>
          <div className="gallery-item relative">
            <img src={images[4]} alt="Lounge" />
            <button className="show-photos-btn">
              <Grid size={16} />
              <span>Show all photos</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Column Layout */}
      <div className="detail-layout">
        {/* Left Side: Room Details */}
        <div className="detail-content-main">
          <div className="detail-header-section">
            <div className="title-row">
              <h1>{roomData.title}</h1>
              <div className="header-actions">
                <button className="circle-action-btn" title="Share">
                  <Share2 size={18} />
                </button>
                <button 
                  className={`circle-action-btn ${isFavorite ? 'favorite-active' : ''}`} 
                  onClick={() => setIsFavorite(!isFavorite)}
                  title="Save"
                >
                  <Heart size={18} fill={isFavorite ? "#EF4444" : "none"} />
                </button>
              </div>
            </div>
            
            <div className="location-row">
              <MapPin size={16} className="location-icon" />
              <span>{roomData.address}</span>
            </div>

            <div className="meta-specs-row">
              <span className="rating-span">
                <Star size={14} className="star-icon" />
                <strong>5.0</strong> (12 reviews)
              </span>
              <span className="spec-dot">•</span>
              <span>1 Bedroom</span>
              <span className="spec-dot">•</span>
              <span>{roomData.areaSqm || 0} sqm</span>
            </div>
          </div>

          <hr className="section-divider" />

          {/* Host Card Section */}
          <section className="host-card">
            <div className="host-info">
              <img src={roomData.landlord?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} alt={roomData.landlord?.full_name} className="host-avatar" />
              <div className="host-text">
                <h3>Managed by {roomData.landlord?.full_name || 'Landlord'}</h3>
                <p>Phone: {roomData.landlord?.phone || 'N/A'}</p>
              </div>
            </div>
            <button className="contact-host-btn flex items-center justify-center gap-2" onClick={handleChatWithLandlord}>
              <MessageSquare size={16} /> [Chat with Landlord]
            </button>
          </section>

          <hr className="section-divider" />

          {/* About Section */}
          <section className="about-section">
            <h2>About this space</h2>
            <div className={`about-text ${showMoreAbout ? 'expanded' : ''}`}>
              <p>{roomData.description}</p>
            </div>
            <button 
              className="show-more-link" 
              onClick={() => setShowMoreAbout(!showMoreAbout)}
            >
              {showMoreAbout ? 'Show less' : 'Show more'} <ChevronDown size={14} className={showMoreAbout ? 'rotate-180' : ''} />
            </button>
          </section>

          <hr className="section-divider" />

          {/* Amenities Section */}
          <section className="amenities-section">
            <h2>What this place offers</h2>
            <div className="amenities-grid">
              {roomData.facilities?.map((amenity, idx) => {
                return (
                  <div className="amenity-item" key={idx}>
                    <CheckCircle size={20} className="amenity-icon" />
                    <span>{amenity.facility_name}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Side: Booking Card */}
        <aside className="detail-sidebar">
          <div className="booking-card">
            <div className="booking-price-row">
              <span className="booking-price">${roomData.pricePerMonth?.toLocaleString() || 0}</span>
              <span className="booking-period">/ month</span>
            </div>

            <div className="booking-form-box">
              <div className="date-fields-row">
                <div className="date-field">
                  <label>MOVE IN</label>
                  <input 
                    type="date" 
                    value={moveIn} 
                    onChange={(e) => setMoveIn(e.target.value)} 
                  />
                </div>
                <div className="date-field border-left">
                  <label>MOVE OUT</label>
                  <input 
                    type="date" 
                    value={moveOut} 
                    onChange={(e) => setMoveOut(e.target.value)} 
                  />
                </div>
              </div>
              <div className="guests-field">
                <label>GUESTS</label>
                <div className="guests-dropdown">
                  <span>{guests}</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button className="send-request-btn" onClick={() => handleBookingRequest('view')}>
                [Request Viewing]
              </button>
              <button className="border border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary/5 transition" onClick={() => handleBookingRequest('rent')}>
                [Request Rent / Deposit]
              </button>
            </div>
            
            <p className="booking-disclaimer">You won't be charged yet</p>

            <hr className="booking-divider" />

            <div className="booking-estimate-row">
              <span>Total Monthly Estimate</span>
              <span>${roomData.pricePerMonth?.toLocaleString() || 0}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RoomDetailPage;
