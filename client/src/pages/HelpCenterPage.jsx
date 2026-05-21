import React, { useState, useRef } from 'react';
import {
  Home,
  CreditCard,
  Wrench,
  UploadCloud,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  MessageSquare,
  X,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Search,
} from 'lucide-react';
import React from 'react';
import { Search, Smartphone, CreditCard, UserCog, Bot, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import './HelpCenterPage.css';

const HelpCenterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="hc-container">
      {/* Hero Section */}
      <div className="hc-hero">
        <h1 className="hc-title">How can we help you today?</h1>
        <p className="hc-subtitle">
          Search our knowledge base or browse categories below to find answers to your questions about the SmartBoarding platform.
        </p>

      {/* Large Central Search Box */}
      <div className="help-search-container">
        <Search size={22} className="help-search-icon" />
        <input
          type="text"
          placeholder="Search for articles, guides, or keywords..."
          className="help-search-input"
        />
      </div>

      {/* Grid split */}
      <div className="help-grid-split">
        
        {/* Left Column: Multi-Step Ticket Wizard Card */}
        <div className="help-wizard-card">
          
          {/* Form Header */}
          <header className="wizard-card-header">
            <div className="wizard-icon-badge">
              <FileText size={20} className="badge-icon" />
            </div>
            <div className="wizard-header-meta">
              <h3 className="wizard-card-title">Submit a Ticket</h3>
              <p className="wizard-card-subtitle">
                {step === 1 && 'Step 1 of 3: Issue Details'}
                {step === 2 && 'Step 2 of 3: Contact & Urgency'}
                {step === 3 && 'Step 3 of 3: Ticket Submitted'}
              </p>
            </div>
          </header>

          <div className="wizard-card-body">
            
            {/* STEP 1: Issue Details */}
            {step === 1 && (
              <form onSubmit={handleContinue} className="wizard-form-flow">
                
                {/* Category Selection */}
                <div className="wizard-field-group">
                  <label className="wizard-field-label">What do you need help with?</label>
                  <div className="category-selection-row">
                    
                    {/* Cat 1: Property Listing */}
                    <div 
                      onClick={() => setSelectedCategory('Property Listing')}
                      className={`category-select-pill ${selectedCategory === 'Property Listing' ? 'active' : ''}`}
                    >
                      <Home size={18} className="cat-icon" />
                      <span className="cat-text">Property Listing</span>
                    </div>

                    {/* Cat 2: Billing & Payments */}
                    <div 
                      onClick={() => setSelectedCategory('Billing & Payments')}
                      className={`category-select-pill ${selectedCategory === 'Billing & Payments' ? 'active' : ''}`}
                    >
                      <CreditCard size={18} className="cat-icon" />
                      <span className="cat-text">Billing & Payments</span>
                    </div>

                    {/* Cat 3: Technical Issue */}
                    <div 
                      onClick={() => setSelectedCategory('Technical Issue')}
                      className={`category-select-pill ${selectedCategory === 'Technical Issue' ? 'active' : ''}`}
                    >
                      <Wrench size={18} className="cat-icon" />
                      <span className="cat-text">Technical Issue</span>
                    </div>

                  </div>
                </div>

                {/* Issue Description Area */}
                <div className="wizard-field-group">
                  <label className="wizard-field-label">Describe the issue</label>
                  <textarea 
                    value={issueDescription}
                    onChange={e => setIssueDescription(e.target.value)}
                    placeholder="Please provide as much detail as possible so we can assist you quickly..."
                    className="wizard-textarea-input"
                    rows={6}
                  ></textarea>
                </div>

                {/* Upload Attachment Section */}
                <div className="wizard-field-group">
                  <label className="wizard-field-label">Attachments (Optional)</label>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }} 
                  />

                  {!uploadedFile ? (
                    <div 
                      onClick={triggerFileInput}
                      className="attachment-upload-zone"
                    >
                      <UploadCloud size={32} className="upload-zone-icon" />
                      <span className="upload-zone-main-text">Click to upload or drag and drop</span>
                      <span className="upload-zone-sub-text">SVG, PNG, JPG or GIF (max. 800x400px)</span>
                    </div>
                  ) : (
                    <div className="attached-file-preview-card">
                      <div className="attached-file-left">
                        <FileText size={20} className="file-preview-icon" />
                        <div className="file-preview-info">
                          <span className="file-preview-name">{uploadedFile.name}</span>
                          <span className="file-preview-size">{uploadedFile.size}</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={removeAttachment}
                        className="btn-remove-attachment"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Button actions row */}
                <div className="wizard-buttons-action-row">
                  <button 
                    type="button" 
                    onClick={handleSaveDraft}
                    className="btn-wizard-outline"
                  >
                    Save Draft
                  </button>
                  <button 
                    type="submit" 
                    className="btn-wizard-solid"
                  >
                    <span>Continue</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

              </form>
            )}

            {/* STEP 2: Contact & Urgency */}
            {step === 2 && (
              <form onSubmit={handleSubmitTicket} className="wizard-form-flow">
                
                {/* Contact Email */}
                <div className="wizard-field-group">
                  <label className="wizard-field-label">Contact Email</label>
                  <div className="wizard-input-capsule">
                    <Mail size={16} className="input-capsule-icon" />
                    <input 
                      type="email" 
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      required
                      placeholder="admin@smartboarding.com"
                      className="wizard-capsule-input"
                    />
                  </div>
                </div>

                {/* Contact Phone */}
                <div className="wizard-field-group">
                  <label className="wizard-field-label">Contact Phone Number</label>
                  <div className="wizard-input-capsule">
                    <Phone size={16} className="input-capsule-icon" />
                    <input 
                      type="tel" 
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      required
                      placeholder="+1 (555) 019-2834"
                      className="wizard-capsule-input"
                    />
                  </div>
                </div>

                {/* Urgency selection dropdown */}
                <div className="wizard-field-group">
                  <label className="wizard-field-label">Urgency Level</label>
                  <select 
                    value={urgencyLevel}
                    onChange={e => setUrgencyLevel(e.target.value)}
                    className="wizard-dropdown-select"
                  >
                    <option value="Low">Low - Minor issue or request</option>
                    <option value="Medium">Medium - Standard support inquiry</option>
                    <option value="High">High - Critical block (payments or checkin)</option>
                  </select>
                </div>

                {/* Information Callout */}
                <div className="wizard-form-callout-info">
                  <AlertTriangle size={18} className="callout-warn-icon" />
                  <p className="callout-text">
                    Our team will reach out to you via the provided email or phone number depending on the selected urgency. High urgency tickets are resolved in less than 30 minutes.
                  </p>
                </div>

                {/* Button actions row */}
                <div className="wizard-buttons-action-row">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="btn-wizard-outline"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button 
                    type="submit" 
                    className="btn-wizard-solid"
                  >
                    <span>Submit Ticket</span>
                    <CheckCircle size={16} />
                  </button>
                </div>

              </form>
            )}

            {/* STEP 3: Success Screen */}
            {step === 3 && (
              <div className="wizard-success-pane">
                <div className="success-lottie-badge">
                  <CheckCircle size={56} className="lottie-check-icon" />
                </div>
                <h3 className="success-main-title">Ticket Submitted Successfully!</h3>
                <p className="success-sub-title">
                  Thank you! Your support ticket has been received. Our team has already started reviewing the details.
                </p>

                <div className="success-ticket-details-box">
                  <div className="ticket-detail-row">
                    <span className="detail-lbl">Ticket ID:</span>
                    <span className="detail-val font-mono">#SB-9854</span>
                  </div>
                  <div className="ticket-detail-row">
                    <span className="detail-lbl">Category:</span>
                    <span className="detail-val">{selectedCategory}</span>
                  </div>
                  <div className="ticket-detail-row">
                    <span className="detail-lbl">Urgency:</span>
                    <span className="detail-val urgency-badge">{urgencyLevel}</span>
                  </div>
                  <div className="ticket-detail-row">
                    <span className="detail-lbl">Average Response Time:</span>
                    <span className="detail-val highlight-time">15 minutes</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleResetForm}
                  className="btn-wizard-solid full-width"
                >
                  Create New Ticket
                </button>
              </div>
            )}

        <div className="hc-search-wrapper">
          <Search className="hc-search-icon" size={20} />
          <input 
            type="text" 
            className="hc-search-input" 
            placeholder="Search for articles, guides, or keywords..." 
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="hc-categories-grid">
        {/* Card 1 */}
        <div className="hc-category-card">
          <div className="hc-icon-wrapper">
            <Smartphone size={24} className="hc-icon" />
          </div>
          <h3 className="hc-card-title">Booking & Reservations</h3>
          <p className="hc-card-desc">
            Manage stays, modifications, and cancellation policies.
          </p>
        </div>

        {/* Card 2 */}
        <div className="hc-category-card">
          <div className="hc-icon-wrapper">
            <CreditCard size={24} className="hc-icon" />
          </div>
          <h3 className="hc-card-title">Billing & Payments</h3>
          <p className="hc-card-desc">
            Invoices, payment methods, and payout scheduling.
          </p>
        </div>

        {/* Card 3 */}
        <div className="hc-category-card">
          <div className="hc-icon-wrapper">
            <UserCog size={24} className="hc-icon" />
          </div>
          <h3 className="hc-card-title">Account Management</h3>
          <p className="hc-card-desc">
            Profile settings, user roles, and security features.
          </p>
        </div>

        {/* Card 4 */}
        <div className="hc-category-card">
          <div className="hc-icon-wrapper">
            <Bot size={24} className="hc-icon" />
          </div>
          <h3 className="hc-card-title">AI Assistant</h3>
          <p className="hc-card-desc">
            Learn how to utilize our automated support tools.
          </p>
        </div>
      </div>

      {/* Bottom Assistance Card */}
      <div className="hc-assistance-card">
        <div className="hc-assistance-content">
          <h2 className="hc-assistance-title">Still need assistance?</h2>
          <p className="hc-assistance-desc">
            Our support team and AI agents are available 24/7 to resolve complex issues.
          </p>
        </div>
        <div className="hc-assistance-actions">
          <button className="hc-btn hc-btn-outline" onClick={() => navigate(ROUTES.LANDLORD?.CONTACT_SUPPORT || '#')}>
            Contact Support
          </button>
          <button className="hc-btn hc-btn-solid" onClick={() => navigate(ROUTES.TENANT?.CHAT || '#')}>
            <MessageSquare size={18} />
            Chat with AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
