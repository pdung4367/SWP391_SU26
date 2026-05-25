import React, { useState, useEffect } from 'react';
import { 
  Calendar, ShieldCheck, Star, Edit, Edit3, Lock, Bell, 
  CreditCard, ChevronRight, Wrench, ThermometerSnowflake, 
  CheckCircle2, Clock, ArrowRight, Plus, Save, X
} from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';
import { supabase } from '../../../config/supabase';
import ChangePasswordModal from '../../auth/components/ChangePasswordModal';
import './TenantProfilePage.css';

const MOCK_REQUESTS = [
  {
    id: '8492',
    unit: 'Unit 4B',
    title: 'Leaking Faucet in Kitchen',
    status: 'Resolved',
    description: 'The cold water faucet in the kitchen sink is dripping continuously. Needs washer replacement.',
    date: 'Oct 12, 2023',
    iconType: 'plumbing'
  },
  {
    id: '8510',
    unit: 'Unit 4B',
    title: 'AC Not Cooling',
    status: 'In Progress',
    description: 'Air conditioning unit is blowing warm air. Maintenance scheduled for tomorrow morning.',
    date: 'Nov 02, 2023',
    iconType: 'hvac'
  }
];

const TenantProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.fullName || '',
        phone: user.user_metadata?.phone || ''
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          fullName: formData.fullName,
          phone: formData.phone
        }
      });
      if (error) throw error;
      updateUser(data.user);
      setIsEditing(false);
    } catch (error) {
      alert(error.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getJoinDate = () => {
    if (!user?.created_at) return 'Member';
    const date = new Date(user.created_at);
    return `Member since ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-page container">
        
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="profile-header-info">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.user_metadata?.fullName || 'User'}&background=random&size=150`}
              alt="Profile" 
              className="profile-avatar" 
            />
            <div className="profile-details">
              <h1 className="profile-name">{user?.user_metadata?.fullName || 'User Name'}</h1>
              <p className="profile-member-since">
                <Calendar size={16} />
                <span>{getJoinDate()}</span>
              </p>
              <div className="profile-badges">
                <div className="badge-blue">
                  <ShieldCheck size={16} />
                  <span>Verified Tenant</span>
                </div>
                <div className="badge-gray">
                  <Star size={16} className="star-icon" />
                  <span>Excellent Rating</span>
                </div>
              </div>
            </div>
          </div>
          {!isEditing ? (
            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
              <Edit3 size={18} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="edit-profile-btn" onClick={() => setIsEditing(false)} style={{ background: '#f3f4f6', color: '#374151' }}>
                <X size={18} />
                <span>Cancel</span>
              </button>
              <button className="edit-profile-btn" onClick={handleSaveProfile} disabled={isSaving}>
                <Save size={18} />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Content Grid */}
        <div className="profile-content-grid">
          
          {/* Left Sidebar */}
          <aside className="profile-sidebar">
            
            {/* Personal Information */}
            <div className="profile-card personal-info-card">
              <div className="card-header">
                <h2>Personal Information</h2>
                {!isEditing && (
                  <button className="icon-btn" aria-label="Edit personal info" onClick={() => setIsEditing(true)}>
                    <Edit size={18} />
                  </button>
                )}
              </div>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.fullName} 
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="edit-input"
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', width: '100%' }}
                    />
                  ) : (
                    <span className="info-value">{user?.user_metadata?.fullName || 'Not provided'}</span>
                  )}
                </div>
                <div className="info-item">
                  <span className="info-label">Email Address</span>
                  <span className="info-value" style={{ color: '#6b7280' }}>{user?.email || 'Not provided'} (Cannot change)</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone Number</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="edit-input"
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', width: '100%' }}
                    />
                  ) : (
                    <span className="info-value">{user?.user_metadata?.phone || 'Not provided'}</span>
                  )}
                </div>
                <div className="info-item">
                  <span className="info-label">Role</span>
                  <span className="info-value" style={{ textTransform: 'capitalize' }}>{user?.user_metadata?.role || 'Tenant'}</span>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="profile-card settings-card">
              <div className="card-header">
                <h2>Account Settings</h2>
              </div>
              <div className="settings-menu">
                <button className="settings-item" onClick={() => setIsPasswordModalOpen(true)}>
                  <div className="settings-item-left">
                    <div className="settings-icon-wrapper">
                      <Lock size={18} />
                    </div>
                    <span>Password &amp; Security</span>
                  </div>
                  <ChevronRight size={20} className="chevron-icon" />
                </button>
                
                <button className="settings-item">
                  <div className="settings-item-left">
                    <div className="settings-icon-wrapper">
                      <Bell size={18} />
                    </div>
                    <span>Notifications</span>
                  </div>
                  <ChevronRight size={20} className="chevron-icon" />
                </button>

                <button className="settings-item">
                  <div className="settings-item-left">
                    <div className="settings-icon-wrapper">
                      <CreditCard size={18} />
                    </div>
                    <span>Payment Methods</span>
                  </div>
                  <ChevronRight size={20} className="chevron-icon" />
                </button>
              </div>
            </div>

          </aside>

          {/* Main Content */}
          <main className="profile-main">
            
            {/* My Requests */}
            <div className="profile-card requests-card">
              <div className="card-header">
                <h2>My Requests</h2>
                <button className="view-all-link">View All</button>
              </div>
              
              <div className="requests-list">
                {MOCK_REQUESTS.map(req => (
                  <div key={req.id} className="request-item">
                    <div className="request-item-header">
                      <div className="request-item-title-group">
                        <div className={`request-icon-wrapper ${req.iconType}`}>
                          {req.iconType === 'plumbing' ? <Wrench size={20} /> : <ThermometerSnowflake size={20} />}
                        </div>
                        <div className="request-title-area">
                          <h3>{req.title}</h3>
                          <span className="request-subtitle">Req #{req.id} • {req.unit}</span>
                        </div>
                      </div>
                      
                      <div className={`request-status-badge ${req.status.toLowerCase().replace(' ', '-')}`}>
                        {req.status === 'Resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                        <span>{req.status}</span>
                      </div>
                    </div>
                    
                    <p className="request-description">{req.description}</p>
                    
                    <div className="request-item-footer">
                      <span className="request-date">Submitted: {req.date}</span>
                      <button className="details-link">
                        Details <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="new-request-container">
                <button className="new-request-btn">
                  <Plus size={18} />
                  <span>New Request</span>
                </button>
              </div>
            </div>

          </main>

        </div>
      </div>
      
      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default TenantProfilePage;
